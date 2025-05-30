import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import Avatar from '@mui/material/Avatar';
import { fetchUser, selectUser } from '../../redux/slices/getme';
import { selectIsAuth } from '../../redux/slices/auth';
import image from '../../img/user-logo6.jpg';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from '../../axios';
import CircularProgress from '@mui/material/CircularProgress';
import { keyframes, styled } from '@mui/system';
import { UserInfo } from '../../account/UserInfo';
import '../../style/mobile-menu/mm.scss';
import { FaCode, FaWallet, FaStore } from 'react-icons/fa';
import { FaFireFlameCurved, FaPerson } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { FiCheckSquare } from "react-icons/fi";
import { FiCode } from "react-icons/fi";
import { FiAward } from "react-icons/fi";
import { IoMusicalNotesSharp } from "react-icons/io5";

import { FiBookmark } from "react-icons/fi";
import { 
  BsHouseDoor, 
  BsChat,
  BsCommand,
  BsFillHeartFill,
} from 'react-icons/bs';

const fadeIn = keyframes`
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

export const Mobile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [openFavoritesModal, setOpenFavoritesModal] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  const fetchFavorites = async () => {
    try {
      setModalLoading(true);
      const { data } = await axios.get('/users/favorites', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Восстановлены заголовки
        }
      });
      // Расширенная проверка структуры данных
      const posts = Array.isArray(data) ? data : data?.favorites || [];
      setFavoritePosts(posts);
      console.log('Fetched favorites:', posts); // Логирование для отладки
    } catch (err) {
      console.error('Error fetching favorites:', err.response?.data || err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenFavorites = async (e) => {
    if (e) e.preventDefault();
    if (!isAuth) {
      alert('Для просмотра избранного нужно авторизоваться');
      return;
    }
    try {
      await fetchFavorites();
      setOpenFavoritesModal(true);
    } catch (err) {
      console.error('Failed to open favorites:', err);
    }
  };

  const handleCloseFavorites = () => {
    setOpenFavoritesModal(false);
  };

  const removeFromFavorites = async (postId) => {
    try {
      await axios.delete(`/users/favorites/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Добавлены заголовки
        }
      });
      setFavoritePosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error removing from favorites:', err.response?.data || err.message);
      alert('Не удалось удалить из избранного');
    }
  };

  if (!user) {
    return <div className='de'>Загрузка... Если долгая загрузка войди в аккаунт или прочти доку</div>;
  }

  return (
    <div className="mobile-menu">
      <Link to="/" className="menu-icon-z">
        <BsHouseDoor />
      </Link>
      <Link to="/popular" className="menu-icon-z">
        <FaFireFlameCurved />
      </Link>
      <Link to="/store" className="menu-icon-z">
        <FaStore />
      </Link>
      <Link to="/music" className="menu-icon-z">
        <IoMusicalNotesSharp />
      </Link>
      <Link to="/chat" className="menu-icon-z">
        <BsChat />
      </Link>

      <BsFillHeartFill 
        className="menu-icon-z" 
        onClick={handleOpenFavorites} 
        style={{ cursor: 'pointer' }} // Добавлен стиль для кликабельности
      />
      
      <Link to={`/account/profile/${user._id}`}>
        <Avatar 
          alt='' 
          src={user.avatarUrl ? `https://atomglidedev.ru${user.avatarUrl}` : image} 
          sx={{ width: 25, height: 25 }} 
          className='pro-avtr-o-io' 
        />
      </Link>

      <StyledModal
        open={openFavoritesModal}
        onClose={handleCloseFavorites}
        aria-labelledby="favorites-modal-title"
      >
        <Box sx={{
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          bgcolor: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '6px',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto',
          color: '#c9d1d9',
          outline: 'none'
        }}>
          <h2 id="favorites-modal-title" style={{ 
            color: '#f0f6fc', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <BookmarkIcon fontSize="large" />
            Мои сохраненные посты
          </h2>
          
          {modalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : favoritePosts.length > 0 ? (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {favoritePosts.map((post) => (
                <div 
                  key={post._id} 
                  style={{
                    position: 'relative',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '16px',
                    backgroundColor: '#161b22',
                    transition: 'transform 0.2s',
                    ':hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <div 
                    onClick={() => navigate(`/posts/${post._id}`)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <UserInfo 
                      {...post.user} 
                      additionalText={new Date(post.createdAt).toLocaleDateString()}
                      avatarUrl={post.user?.avatarUrl ? `https://atomglidedev.ru${post.user.avatarUrl}` : ''}
                    />
                    <h3 style={{ color: '#f0f6fc', margin: '10px 0' }}>{post.title}</h3>
                    {post.imageUrl && (
                      <img 
                        src={`https://atomglidedev.ru${post.imageUrl}`} 
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginBottom: '10px'
                        }}
                      />
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b949e' }}>
                      <span>{post.viewsCount} просмотров</span>
                    </div>
                  </div>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Предотвращает навигацию при клике на кнопку
                      removeFromFavorites(post._id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      color: '#f85149',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '200px',
              color: '#8b949e',
              animation: `${fadeIn} 0.3s ease-out`
            }}>
              <BookmarkIcon sx={{ fontSize: '48px', mb: 2 }} />
              <p style={{ textAlign: 'center' }}>
                У вас пока нет сохраненных постов.<br />
                Нажмите на значок закладки в постах, чтобы сохранить понравившиеся.
              </p>
            </Box>
          )}
        </Box>
      </StyledModal>
    </div>
  );
};