import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, fetchUser } from '../../redux/slices/getme';
import { selectIsAuth, logout } from '../../redux/slices/auth';
import { actions as playerActions } from '../../redux/slices/player';
import '../../style/header/style.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import image from './Group 7.png';
import Newpost from '../new-post/newpost';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ArticleIcon from '@mui/icons-material/Article';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayArrow, Pause, SkipNext, SkipPrevious } from '@mui/icons-material';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalmOpen, setIsModalmOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const profileMenuRef = useRef(null);
  const [dockPosition, setDockPosition] = useState(() => {
    return localStorage.getItem('dockPosition') || 'bottom';
  });

  const playerState = useSelector((state) => state.player);
  const { currentTrack, isPlaying, audioRef } = playerState || {};

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const wasWelcomeShown = localStorage.getItem('welcomeShown');
    if (!wasWelcomeShown) {
      setIsWelcomeModalOpen(true);
      localStorage.setItem('welcomeShown', 'true');
    }

    if (isAuth && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuth, user]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('dockPosition')) {
      localStorage.setItem('dockPosition', 'bottom');
    }
  }, []);

  const userId = user?._id || '';
  const userName = user?.username || user?.fullName || 'User';

  const handleCloseWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };

  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Анимация меню
  const menuAnimation = {
    hidden: { 
      opacity: 0,
      y: -15,
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    visible: {
      opacity: 1,
      y: 5,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.1 }
    }
  };

  const onLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handlePlayPause = () => {
    if (currentTrack && audioRef) {
      if (isPlaying) {
        audioRef.pause();
        dispatch(playerActions.setIsPlaying(false));
      } else {
        audioRef.play();
        dispatch(playerActions.setIsPlaying(true));
      }
    }
  };

  const showMiniPlayer = location.pathname !== '/music' && currentTrack;

  return (
    <header className="github-header">
      {/* Welcome Modal */}
      <Modal
        open={isWelcomeModalOpen}
        onClose={handleCloseWelcomeModal}
        aria-labelledby="welcome-modal-title"
        aria-describedby="welcome-modal-description"
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box sx={modalStyle}>
          <Avatar 
            alt="AtomGlide Logo" 
            src={user?.avatarUrl ? `https://atomglidedev.ru${user.avatarUrl}` : image} 
            sx={{ 
              width: 70, 
              height: 70,
              margin: '0 auto 16px',
              display: 'block',
              animation: 'bounce 2s infinite'
            }}
          />
          <Typography 
            id="welcome-modal-title" 
            variant="h6" 
            component="h2"
            sx={{ 
              textAlign: 'center',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}
          >
            Добро пожаловать
          </Typography>
          <Typography 
            id="welcome-modal-description" 
            sx={{ 
              textAlign: 'center',
              marginBottom: '24px',
              color: 'text.secondary',
              fontSize: '1rem'
            }}
          >
            В новую версию AtomGlide 7.5
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleCloseWelcomeModal}
            sx={{
              display: 'block',
              margin: '0 auto',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              },
              padding: '8px 24px',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            Продолжить
          </Button>
        </Box>
      </Modal>

      {isAuth && (
        <Newpost
          isOpen={isModalOpen || isModalmOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setIsModalmOpen(false);
          }}
        />
      )}
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <img src={image} alt="AtomGlide" />
          </Link>
          <h4>AtomGlide 7.5</h4>
          {showMiniPlayer && (
            <div className="mini-player">
              <img 
                src={currentTrack.coverImage ? 
                  `https://atomglidedev.ru/uploads/${currentTrack.coverImage}` : 
                  "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999"
                } 
                alt={currentTrack.title} 
                className="mini-player-cover"
              />
              <div className="mini-player-info">
                <div className="mini-player-title">{currentTrack.title}</div>
                <div className="mini-player-artist">{currentTrack.artist}</div>
              </div>
              <div className="mini-player-controls">
                <button className="mini-player-btn" onClick={handlePlayPause}>
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="header-right">
          {isAuth ? (
            userId ? (
              <>
                {isMobile ? (
  <button class="cssbuttons-io-button" onClick={() => setIsModalmOpen(true)}>
                    📝
                    <div class="icon">
                      <svg id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path class="st0" d="M381,236H276V131c0-11-9-20-20-20s-20,9-20,20v105H131c-11,0-20,9-20,20s9,20,20,20h105v105c0,11,9,20,20,20  
                        s20-9,20-20V276h105c11,0,20-9,20-20S392,236,381,236z"/>
                      </svg>
                    </div>
                  </button>                ) : (
                  <button class="cssbuttons-io-button" onClick={() => setIsModalOpen(true)}>
                    Создать пост
                    <div class="icon">
                      <svg id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path class="st0" d="M381,236H276V131c0-11-9-20-20-20s-20,9-20,20v105H131c-11,0-20,9-20,20s9,20,20,20h105v105c0,11,9,20,20,20  
                        s20-9,20-20V276h105c11,0,20-9,20-20S392,236,381,236z"/>
                      </svg>
                    </div>
                  </button>
                )}
                
                <div className="profile-section" ref={profileMenuRef}>
                  <motion.div 
                    className="user-info-header" 
                    onClick={toggleProfileMenu}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar
                      alt={userName}
                      src={user?.avatarUrl ? `${process.env.REACT_APP_API_BASE_URL}${user.avatarUrl}` : image} 
                      sx={{ width: 32, height:32 }}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        className="profile-menu-dark"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuAnimation}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          marginTop: '15px',
                          width: '180px',
                          zIndex: 1000,
                          overflow: 'hidden',
                          color: '#ffffff',
                          transformOrigin: 'top right'
                        }}
                      >
                        {/* Часы и дата */}
                        <div className="profile-menu-time-section">
                          <div className="profile-menu-time">{formatTime(currentTime)}</div>
                          <div className="profile-menu-date">{formatDate(currentTime)}</div>
                        </div>
                        
                        {/* Основные кнопки */}
                        <div className="profile-menu-main-buttons">
                          <Link to="/" className="profile-menu-dark-item">
                            <HomeIcon className="profile-menu-icon" />
                            <span>Главная</span>
                          </Link>
                          
                          <Link to={`/account/profile/${userId}`} className="profile-menu-dark-item">
                            <PersonIcon className="profile-menu-icon" />
                            <span>Мой профиль</span>
                          </Link>
                          
                          <Link to="/setting" className="profile-menu-dark-item">
                            <SettingsIcon className="profile-menu-icon" />
                            <span>Настройки</span>
                          </Link>
                          
                          <Link to="/wallet" className="profile-menu-dark-item">
                            <NotificationsIcon className="profile-menu-icon" />
                            <span>Wallet</span>
                          </Link>

                          <div className="profile-menu-dark-item" onClick={() => {
                            const newPosition = {
                              'left': 'right',
                              'right': 'top',
                              'top': 'bottom',
                              'bottom': 'left'
                            }[dockPosition] || 'left';
                            
                            setDockPosition(newPosition);
                            localStorage.setItem('dockPosition', newPosition);
                            document.querySelectorAll('.dock').forEach(dock => {
                              dock.className = `dock dock-${newPosition}`;
                            });
                          }}>
                            <SettingsIcon className="profile-menu-icon" />
                            <span>Dock: {dockPosition}</span>
                          </div>
                          
                          <div className="profile-menu-dark-item" onClick={onLogout}>
                            <LogoutIcon className="profile-menu-icon" />
                            <span>Выйти</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="user-info-header">
                <Avatar 
                  alt="Loading..." 
                  src={image} 
                  sx={{ width: 32, height:32 }}
                />
                <span className="user-name">Loading...</span>
              </div>
            )
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="sign-up">Sign in</Link>
              <Link to="/register" className="sign-up">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
  outline: 'none',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    width: '90%',
    p: 3
  }
};

export default Header;