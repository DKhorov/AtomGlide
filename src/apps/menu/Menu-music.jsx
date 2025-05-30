import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../style/menu/menu.scss';
import { IoMusicalNotesSharp } from "react-icons/io5";
import { FaFireFlameCurved } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa6";
import { RiPlayListFill } from "react-icons/ri";
import { TbMusicStar } from "react-icons/tb";
import { SiDolby } from "react-icons/si";
import { IoMdExit } from "react-icons/io";
import { MdQueueMusic } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { Navigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import axios from '../../axios';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import { selectIsAuth } from '../../redux/slices/auth';
import { fetchUser, selectUser } from '../../redux/slices/getme';
import { useSelector, useDispatch } from 'react-redux';
import { Post } from '../post/post';
import { keyframes, styled } from '@mui/system';
import { UserInfo } from '../../account/UserInfo';
import Modal from '@mui/material/Modal';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(3px)',
  animation: `${fadeIn} 0.3s ease-out forwards`,
});

const AnimatedPost = styled('div')(({ delay }) => ({
  animation: `${slideIn} 0.3s ease-out ${delay * 0.1}s forwards`,
  opacity: 0,
  position: 'relative',
  border: '1px solid #30363d',
  borderRadius: '6px',
  padding: '16px',
  backgroundColor: '#161b22',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const MenuMusic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);
  const [dockPosition, setDockPosition] = useState(() => {
    return localStorage.getItem('dockPosition') || 'bottom';
  });

  useEffect(() => {
    const handleDockPositionChange = (e) => {
      if (e.key === 'dockPosition') {
        setDockPosition(e.newValue || 'bottom');
      }
    };
    window.addEventListener('storage', handleDockPositionChange);
    return () => window.removeEventListener('storage', handleDockPositionChange);
  }, []);

  useLayoutEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (isMobile) return null;

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className={`dock dock-${dockPosition}`}>
        <Link to="/music" className={`dft-bth ${isActive('/music')}`}>
          <IoMusicalNotesSharp className='qazwsx' />
        </Link>
        
        <Link to="/popularmusic" className={`dft-bth ${isActive('/popularmusic')}`}>
          <FaFireFlameCurved className='qazwsx' />
        </Link>

        <Link to="/artists" className={`dft-bth ${isActive('/artists')}`}>
          <FaUsers className='qazwsx' />
        </Link>

        <Link to="/playlists" className={`dft-bth ${isActive('/playlists')}`}>
          <RiPlayListFill className='qazwsx' />
        </Link>

        <Link to="/favorites" className={`dft-bth ${isActive('/favorites')}`}>
          <MdFavorite className='qazwsx' />
        </Link>

        <Link to="/queue" className={`dft-bth ${isActive('/queue')}`}>
          <MdQueueMusic className='qazwsx' />
        </Link>

        <Link to="/discover" className={`dft-bth ${isActive('/discover')}`}>
          <TbMusicStar className='qazwsx' />
        </Link>

        <Link to="/" className={`dft-bth ${isActive('/')}`}>
          <IoMdExit className='qazwsx' />
        </Link>
      </div>

      <StyledModal
        open={false}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 800,
          maxHeight: '80vh',
          bgcolor: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflow: 'auto'
        }}>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : null}
        </Box>
      </StyledModal>
    </>
  );
};

export default MenuMusic;