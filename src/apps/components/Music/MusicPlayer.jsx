import React, { useState, useEffect, useRef } from 'react';
import { 
  SkipPrevious, 
  SkipNext, 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  VolumeOff,
  HighQuality,
  SurroundSound,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import { SiDolby } from "react-icons/si";

import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer = ({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  progress, 
  volume, 
  onProgressChange,
  onVolumeChange
}) => {
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [coverImage, setCoverImage] = useState('');
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [hqEnabled, setHqEnabled] = useState(false);
  const [dolbyEnabled, setDolbyEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const audioRef = useRef(null);
  const playerRef = useRef(null);

  const formatTime = (seconds) => {
    const secs = Math.floor(seconds || 0);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const getCoverImageUrl = (track) => {
    if (!track) return '';
    
    try {
      if (track.coverImage) {
        const cleanPath = track.coverImage
          .replace(/^\/+/, '')
          .replace(/\/+/g, '/');
        return `${process.env.REACT_APP_API_BASE_URL}/uploads/${cleanPath}`;
      }
      return track.image || "https://via.placeholder.com/150";
    } catch (err) {
      console.error('Error processing cover image:', err);
      return "https://via.placeholder.com/150";
    }
  };

  useEffect(() => {
    if (currentTrack) {
      const newCoverUrl = getCoverImageUrl(currentTrack);
      setCoverImage(newCoverUrl);

      const audio = new Audio();
      audioRef.current = audio;

      const audioUrl = `${process.env.REACT_APP_API_BASE_URL}/uploads/${currentTrack.filePath.replace(/^\/+/, '')}`;
      audio.src = audioUrl;

      const handleLoadedMetadata = () => {
        if (audio.duration) {
          setDuration(formatTime(audio.duration));
        }
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack?.duration) {
      setCurrentTime(formatTime(progress * currentTrack.duration));
    }
  }, [progress, currentTrack]);

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    onProgressChange(Math.max(0, Math.min(1, clickPos)));
  };

  const handleVolumeClick = (e) => {
    if (!volumeRef.current) return;
    
    const rect = volumeRef.current.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    onVolumeChange(Math.max(0, Math.min(1, clickPos)));
  };

  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl);
  };

  const toggleHq = () => {
    setHqEnabled(!hqEnabled);
    // Здесь можно добавить логику переключения качества
  };

  const toggleDolby = () => {
    setDolbyEnabled(!dolbyEnabled);
    // Здесь можно добавить логику переключения Dolby Atmos
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        playerRef.current.webkitRequestFullscreen();
      } else if (playerRef.current.msRequestFullscreen) {
        playerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!currentTrack) return null;

  return (
    <motion.div 
      className={`music-player ${isFullscreen ? 'fullscreen' : ''}`}
      ref={playerRef}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25 }}
    >
      <div className="player-track-info">
        <AnimatePresence>
          {coverImage && (
            <motion.img
              key="cover"
              src={coverImage}
              alt="Cover"
              className="player-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                e.target.src = "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999";
              }}
            />
          )}
        </AnimatePresence>
        <div className="player-info">
          <h3 className="player-title">{currentTrack.title}</h3>
          <p className="player-artist">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="player-controls">
        <button className="player-btn" onClick={onPrevious}>
          <SkipPrevious />
        </button>
        <motion.button 
          className="player-btn play-btn" 
          onClick={onPlayPause}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </motion.button>
        <button className="player-btn" onClick={onNext}>
          <SkipNext />
        </button>
      </div>

      <div className="player-progress">
        <span className="progress-time">{currentTime}</span>
        <div className="progress-bar" ref={progressRef} onClick={handleProgressClick}>
          <div 
            className="progress-fill" 
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="progress-time">{duration}</span>
      </div>

      <div className="player-extra-controls">
        <button 
          className={`player-extra-btn ${hqEnabled ? 'active' : ''}`}
          onClick={toggleHq}
          title="HQ качество"
        >
          <HighQuality />
        </button>
        <button 
          className={`player-extra-btn ${dolbyEnabled ? 'active' : ''}`}
          onClick={toggleDolby}
          title="Dolby Atmos"
        >
          <SiDolby />
        </button>
        <button
          className="player-extra-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
        >
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </button>
        <div className="volume-container">
          <button 
            className="player-extra-btn" 
            onClick={toggleVolumeControl}
            title="Громкость"
          >
            {volume > 0 ? <VolumeUp /> : <VolumeOff />}
          </button>
          {showVolumeControl && (
            <motion.div 
              className="volume-control"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="volume-bar" ref={volumeRef} onClick={handleVolumeClick}>
                <div 
                  className="volume-fill" 
                  style={{ height: `${volume * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;