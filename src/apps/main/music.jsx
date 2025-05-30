import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { actions as playerActions } from '../../redux/slices/player';
import axios from '../../axios';
import MusicItem from '../components/Music/MusicItem';
import MusicPlayer from '../components/Music/MusicPlayer';
import UploadDialog from '../components/Music/UploadDialog';
import { CloudUpload } from '@mui/icons-material';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import '../../style/work/work.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Music = () => {
  const dispatch = useDispatch();
  const [musicList, setMusicList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [newMusic, setNewMusic] = useState({
    title: '',
    artist: '',
    genre: 'Pop',
    album: '',
    lyrics: '',
    explicit: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    fetchMusic();
    fetchFavorites();
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

  const fetchMusic = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/music');
      setMusicList(data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке музыки:', err);
      setLoading(false);
      showSnackbar('Ошибка при загрузке музыки', 'error');
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data } = await axios.get('/music/favorites');
      setFavorites(data.map(item => item._id));
    } catch (err) {
      console.error('Ошибка при загрузке избранного:', err);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleCoverChange = (file) => {
    setSelectedCover(file);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMusic(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showSnackbar('Пожалуйста, выберите аудиофайл', 'error');
      return;
    }
    
    const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const fileExt = selectedFile.name.toLowerCase().slice(
      ((selectedFile.name.lastIndexOf('.') - 1) >>> 0) + 2
    );
    
    if (!validExtensions.includes('.' + fileExt)) {
      showSnackbar('Разрешены только: .mp3, .wav, .ogg, .m4a, .aac', 'error');
      return;
    }

    if (selectedCover) {
      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const imageExt = selectedCover.name.toLowerCase().slice(
        ((selectedCover.name.lastIndexOf('.') - 1) >>> 0) + 2
      );
      
      if (!validImageExtensions.includes('.' + imageExt)) {
        showSnackbar('Для обложки разрешены только: .jpg, .jpeg, .png, .gif, .webp', 'error');
        return;
      }
    }
  
    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', newMusic.title || selectedFile.name.replace(/\.[^/.]+$/, ""));
    formData.append('artist', newMusic.artist || 'Unknown Artist');
    formData.append('genre', newMusic.genre || 'Other');
    
    if (selectedCover) formData.append('cover', selectedCover);
    if (newMusic.album) formData.append('album', newMusic.album);
    if (newMusic.lyrics) formData.append('lyrics', newMusic.lyrics);
    formData.append('explicit', String(newMusic.explicit));
  
    try {
      setUploading(true);
      const response = await axios.post('/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 60000
      });
  
      if (response.data.success) {
        showSnackbar('Файл успешно загружен!', 'success');
        fetchMusic();
        setOpenUploadDialog(false);
        resetForm();
      } else {
        throw new Error(response.data.message || 'Ошибка загрузки');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showSnackbar(err.response?.data?.message || err.message || 'Ошибка загрузки', 'error');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setNewMusic({
      title: '',
      artist: '',
      genre: 'Pop',
      album: '',
      lyrics: '',
      explicit: false
    });
    setSelectedFile(null);
    setSelectedCover(null);
  };

  const playMusic = async (music) => {
    try {
      if (currentTrack?._id === music._id && isPlaying) {
        showSnackbar('Эта песня уже играет', 'info');
        return;
      }

      if (currentTrack?._id === music._id && !isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
        dispatch(playerActions.setIsPlaying(true));
        return;
      }

      showSnackbar('Загрузка трека...', 'info');
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
  
      const audioUrl = `${process.env.REACT_APP_API_BASE_URL}/uploads/${music.filePath}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onerror = () => {
        console.error('Playback error:', audio.error);
        showSnackbar(`Ошибка воспроизведения: ${audio.error.message}`, 'error');
      };
  
      audio.onended = () => {
        setIsPlaying(false);
        dispatch(playerActions.setIsPlaying(false));
        setProgress(0);
      };

      audio.oncanplaythrough = () => {
        showSnackbar('Трек загружен', 'success');
      };
  
      await audio.play();
      setIsPlaying(true);
      setCurrentTrack(music);
      dispatch(playerActions.setCurrentTrack(music));
      dispatch(playerActions.setIsPlaying(true));
      dispatch(playerActions.setAudioRef(audio));
    } catch (err) {
      console.error('Play failed:', err);
      showSnackbar(`Не удалось воспроизвести: ${err.message}`, 'error');
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

  const playNext = () => {
    if (!currentTrack || musicList.length === 0) return;
    
    const currentIndex = musicList.findIndex(item => item._id === currentTrack._id);
    const nextIndex = (currentIndex + 1) % musicList.length;
    playMusic(musicList[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack || musicList.length === 0) return;
    
    const currentIndex = musicList.findIndex(item => item._id === currentTrack._id);
    const prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
    playMusic(musicList[prevIndex]);
  };

  const addToFavorites = async (musicId) => {
    try {
      const { data } = await axios.post('/music/favorites', { musicId });
      setFavorites(data.favorites);
      showSnackbar('Добавлено в избранное', 'success');
    } catch (err) {
      console.error('Ошибка при добавлении в избранное:', err);
      showSnackbar('Ошибка при добавлении в избранное', 'error');
    }
  };

  return (
    <div className="mu">
      <h1 className='mu-title'>Home</h1>
      
      <div className='ad-music'>
        <h1 className='ad-music-title'>Никаких Ограничений</h1>
        <h4 className="ad-music-subtitle">
          AtomGlide Music — совершенно бесплатная платформа без подписок и рекламы. 
          Загружай любую музыку — здесь нет проверки на авторские права и различных ограничений. 
          Слушай музыку в наилучшем качестве с поддержкой Dolby Atmos.
        </h4>
      </div>

      <div className="upload-section">
        <Button 
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setOpenUploadDialog(true)}
          style={{
            background: 'linear-gradient(to right, #4A90E2, #357ABD)',
            color: 'white',
            borderRadius: '20px',
            padding: '10px 20px',
            margin: '20px 30px',
            textTransform: 'none',
            fontWeight: '600'
          }}
        >
          Загрузить музыку
        </Button>
      </div>

      <h1 className='mu-title2'>Все треки сообщества</h1>
      <div className="recommendations-container">
        {loading ? (
          <div className="loading-spinner">
            <CircularProgress style={{ color: '#4A90E2' }} />
          </div>
        ) : musicList.length > 0 ? (
          musicList.map((music) => (
            <MusicItem
              key={`community-${music._id}`}
              item={music}
              onPlay={playMusic}
              isCurrent={currentTrack?._id === music._id}
              isPlaying={isPlaying && currentTrack?._id === music._id}
              onAddToFavorites={addToFavorites}
              isFavorite={favorites.includes(music._id)}
            />
          ))
        ) : (
          <p className="no-music" style={{ color: '#b3b3b3', textAlign: 'center', gridColumn: '1 / -1' }}>
            В сообществе пока нет музыки
          </p>
        )}
      </div>

      <UploadDialog
        openUploadDialog={openUploadDialog}
        setOpenUploadDialog={setOpenUploadDialog}
        handleUpload={handleUpload}
        handleFileChange={handleFileChange}
        handleCoverChange={handleCoverChange}
        handleInputChange={handleInputChange}
        newMusic={newMusic}
        selectedFile={selectedFile}
        selectedCover={selectedCover}
        uploading={uploading}
      />

      <MusicPlayer 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={togglePlayPause}
        onNext={playNext}
        onPrevious={playPrevious}
        progress={progress}
        volume={volume}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Music;