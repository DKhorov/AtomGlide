import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../style/menu/menu.scss';
import { FaFireFlameCurved, FaPerson } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { FiCheckSquare } from "react-icons/fi";
import { FiCode } from "react-icons/fi";
import { FiAward } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
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
import { BsFillRssFill } from "react-icons/bs";
import { BsChatFill } from "react-icons/bs";
import { BsFillCupHotFill } from "react-icons/bs";
import { BsFillTagsFill } from "react-icons/bs";
import { BsFillPersonFill } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import { BsBoxFill } from "react-icons/bs";
import { FaCode } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { IoMusicalNotesSharp } from "react-icons/io5";
import { VscGitPullRequestClosed } from "react-icons/vsc";
import { 
  FaHome,
  FaGamepad,
  FaLaptopCode,
  FaGraduationCap,
  FaBriefcase,
  FaMusic,
  FaFilm,
  FaChartBar
} from 'react-icons/fa';
import { Typography } from '@mui/material';

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

const StoreMenu = styled(Box)({
  width: '240px',
  height: '100vh',
  backgroundColor: '#000000',
  borderRight: '1px solid #1c1c1e',
  padding: '20px 0',
  position: 'fixed',
  left: 0,
  top: 0,
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column'
});

const MenuItem = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 24px',
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#1c1c1e',
    color: '#ffffff'
  },
  '&.active': {
    color: '#0a84ff'
  }
});

const MenuSection = styled(Box)({
  marginBottom: '24px',
  '& h6': {
    padding: '0 24px',
    marginBottom: '8px',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
});

const IconWrapper = styled(Box)({
  marginRight: '12px',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const MenuStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [openFavoritesModal, setOpenFavoritesModal] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const { data } = await axios.get('/posts/tags/all');
        const sortedTags = data.sort((a, b) => b.count - a.count).slice(0, 3);
        setPopularTags(sortedTags);
      } catch (err) {
        console.error('Ошибка при загрузке популярных тегов:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTags();
  }, []);

  useLayoutEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/users/favorites', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavoritePosts(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFavorites = async (e) => {
    e.preventDefault();
    if (!isAuth) {
      alert('Для просмотра избранного нужно авторизоваться');
      return;
    }
    await fetchFavorites();
    setOpenFavoritesModal(true);
  };

  const handleCloseFavorites = () => {
    setOpenFavoritesModal(false);
  };

  const removeFromFavorites = async (postId) => {
    try {
      await axios.delete(`/users/favorites/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavoritePosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      alert('Не удалось удалить из избранного');
    }
  };

  const handleThemeClick = (themeName) => {
    navigate(`/tags/${themeName.toLowerCase()}`);
  };

  const handleTagClick = (tagName) => {
    navigate(`/tags/${tagName}`);
  };

  if (isMobile) return null;

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const themes = [
    { name: 'Python', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQpDU7-J_NbGKkHAlMRWgdFRqoj5vK3DehTQ&s' },
    { name: 'HTML', image: 'https://www.itss.paris/sites/itss-dev/files/styles/scaling_cropping_1200x800/public/2017-12/HTML5_0_0.jpg?itok=bnzL8xFI' },
    { name: 'React', image: 'https://kasterra.github.io/images/thumbnails/React.png' },
    { name: 'JavaScript', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHnJDLOcdm_0b6N6kNj-1OvO9KhKYgqIy0w&s' },
    { name: 'News', image: 'https://st2.depositphotos.com/6789684/12262/v/450/depositphotos_122620866-stock-illustration-illustration-of-flat-icon.jpg' },
    { name: 'Практикум', image: 'https://cdn-icons-png.flaticon.com/512/4366/4366867.png' }
  ];

  const menuItems = {
    discover: [
      { path: '/store', icon: <FaHome />, label: 'Главная' },
      { path: '/store/games', icon: <FaGamepad />, label: 'Игры' },
      { path: '/store/apps', icon: <FaLaptopCode />, label: 'Приложения' },
      { path: '/store/education', icon: <FaGraduationCap />, label: 'Образование' }
    ],
    categories: [
      { path: '/store/business', icon: <FaBriefcase />, label: 'Бизнес' },
      { path: '/store/entertainment', icon: <FaFilm />, label: 'Развлечения' },
      { path: '/store/music', icon: <FaMusic />, label: 'Музыка' },
      { path: '/store/productivity', icon: <FaChartBar />, label: 'Продуктивность' }
    ]
  };

  return (
    <StoreMenu>
      <MenuSection>
        <Typography variant="h6">Обзор</Typography>
        {menuItems.discover.map((item) => (
          <MenuItem key={item.path} to={item.path} className={isActive(item.path)}>
            <IconWrapper>{item.icon}</IconWrapper>
            <span>{item.label}</span>
          </MenuItem>
        ))}
      </MenuSection>

      <MenuSection>
        <Typography variant="h6">Категории</Typography>
        {menuItems.categories.map((item) => (
          <MenuItem key={item.path} to={item.path} className={isActive(item.path)}>
            <IconWrapper>{item.icon}</IconWrapper>
            <span>{item.label}</span>
          </MenuItem>
        ))}
      </MenuSection>
    </StoreMenu>
  );
};

export default MenuStore;