// components/Music/PopularMusic.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { actions as playerActions } from '../../redux/slices/player';
import axios from '../../axios';

import { CircularProgress } from '@mui/material';
import '../../style/work/work.scss';
import MusicItem from '../components/Music/MusicItem';
import MusicPlayer from '../components/Music/MusicPlayer';

const PopularMusic = () => {
  const dispatch = useDispatch();
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    fetchPopularMusic();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime / audioRef.current.duration || 0);
        }
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const fetchPopularMusic = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/music?sort=popular');
      setMusicList(data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке популярной музыки:', err);
      setLoading(false);
    }
  };

  const playMusic = async (music) => {
    try {
      if (currentTrack?._id === music._id && isPlaying) {
        return;
      }

      if (currentTrack?._id === music._id && !isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
        dispatch(playerActions.setIsPlaying(true));
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audioUrl = `${process.env.REACT_APP_API_BASE_URL}/uploads${music.filePath}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onerror = () => {
        console.error('Ошибка воспроизведения:', audio.error);
        alert(`Ошибка: ${audio.error.message}`);
      };

      audio.onended = () => {
        setIsPlaying(false);
        dispatch(playerActions.setIsPlaying(false));
        setProgress(0);
      };

      await audio.play();
      setIsPlaying(true);
      setCurrentTrack(music);
      dispatch(playerActions.setCurrentTrack(music));
      dispatch(playerActions.setIsPlaying(true));
      dispatch(playerActions.setAudioRef(audio));
    } catch (err) {
      console.error('Ошибка воспроизведения:', err);
      alert(`Не удалось воспроизвести: ${err.message}`);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      dispatch(playerActions.setIsPlaying(false));
    } else {
      audioRef.current.play();
      dispatch(playerActions.setIsPlaying(true));
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (newProgress) => {
    if (!audioRef.current) return;
    
    setProgress(newProgress);
    audioRef.current.currentTime = newProgress * audioRef.current.duration;
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="mu">
          <div className='ad-music'>
        <h1 className='ad-music-title'>Топ чарты</h1>
        <h4 className="ad-music-subtitle">
        На этой странице представлен список самых популярных треков в AtomGlide. Наши серверы с помощью специального алгоритма отбирают треки на основе их прослушиваний.
        </h4>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress />
        </div>
      ) : (
        <div className="recommendations-container">
          {musicList.length > 0 ? (
            musicList.map((music) => (
              <MusicItem
                key={music._id}
                item={music}
                onPlay={playMusic}
                isCurrent={currentTrack?._id === music._id}
                isPlaying={isPlaying && currentTrack?._id === music._id}
                showPlays={true}
              />
            ))
          ) : (
            <p className="no-music" style={{ color: '#b3b3b3', textAlign: 'center', gridColumn: '1 / -1' }}>
              Нет данных о популярных треках
            </p>
          )}
        </div>
      )}

      <MusicPlayer 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={togglePlayPause}
        progress={progress}
        volume={volume}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
};

export default PopularMusic;