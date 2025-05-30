import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVert, 
  Favorite, 
  FavoriteBorder, 
  PlaylistAdd, 
  Report, 
  Share,
  PlayArrow // Добавлен импорт PlayArrow
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MusicItem = ({ item, onPlay, isCurrent, isPlaying, onAddToFavorites, isFavorite, showArtist }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null)
  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCoverImage = () => {
    if (item.coverImage) {
      const cleanPath = item.coverImage
        .replace(/^\/?uploads\/?/, '')
        .replace(/^\/?music\/?/, '');
      return `${process.env.REACT_APP_API_BASE_URL}/uploads/music/${cleanPath}?v=${new Date().getTime()}`;
    }
    return "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999";
  };

  return (
    <motion.div 
      className={`recommendation-item ${isCurrent ? 'active' : ''}`}
      onClick={() => onPlay(item)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="cover-container">
        <motion.img 
          src={getCoverImage()} 
          alt={item.title} 
          className="recommendation-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.src = "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999";
          }}
        />
        {isCurrent && (
          <motion.div 
            className="playing-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: isPlaying ? 1 : 0.5 }}
          >
            <div className="wave">
              {[1, 2, 3].map((i) => (
                <motion.span 
                  key={i}
                  className="dot"
                  animate={{
                    height: isPlaying ? ['50%', '100%', '50%'] : '50%',
                  }}
                  transition={{
                    repeat: isPlaying ? Infinity : 0,
                    repeatType: 'reverse',
                    duration: 0.8,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        {isHovered && !isCurrent && (
          <motion.div 
            className="play-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PlayArrow style={{ fontSize: 30 }} />
          </motion.div>
        )}
      </div>
      <div className="recommendation-info">
        <h3 className="recommendation-title">{item.title}</h3>
        {showArtist && item.artist && (
          <Link 
            to={`/artist/${encodeURIComponent(item.artist)}`} 
            className="recommendation-artist"
            onClick={(e) => e.stopPropagation()}
          >
            {item.artist}
          </Link>
        )}
        <p className="recommendation-genre"> {item.artist}</p>
      </div>
      <div className="context-menu" ref={menuRef}>
      
        {menuOpen && (
          <div className="menu-items open">
            <button 
              className="menu-item" 
              onClick={(e) => {
                e.stopPropagation();
                onAddToFavorites(item._id);
                setMenuOpen(false);
              }}
            >
              {isFavorite ? <Favorite style={{ color: '#ff4081' }} /> : <FavoriteBorder />}
              <span>{isFavorite ? 'Удалить из избранного' : 'В избранное'}</span>
            </button>
            <button className="menu-item" onClick={(e) => e.stopPropagation()}>
              <PlaylistAdd />
              <span>Добавить в плейлист</span>
            </button>
            <button className="menu-item" onClick={(e) => e.stopPropagation()}>
              <Share />
              <span>Поделиться</span>
            </button>
            <button className="menu-item" onClick={(e) => e.stopPropagation()}>
              <Report />
              <span>Пожаловаться</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MusicItem;