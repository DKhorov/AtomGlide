import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../axios';
import { logout } from '../redux/slices/auth';
import { Post } from '../apps/post/post';
import image from '../img/nft.gif';
import image1 from '../img/nft2.gif';
import image3 from '../img/nft3.gif';
import image4 from '../img/code.gif';

import { 
  Avatar, Button, Typography, Grid, CircularProgress,
  Badge, IconButton, Tooltip, Alert, Box, Divider,
  Tabs, Tab, Fade, Snackbar, Modal, Paper
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Store as StoreIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Telegram as TelegramIcon,
  Public as PublicIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Book as BookIcon,
  Storage as StorageIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { NotificationContext } from '../apps/tools/ui-menu/pushbar/pushbar';
import '../style/profile/profile.scss';
import { IoCopy } from "react-icons/io5";

const Profile = () => {
  const { toggleNotifications } = useContext(NotificationContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.data);
  
  const [state, setState] = useState({
    user: null,
    posts: [],
    isSubscribed: false,
    followersCount: 0,
    subscriptionsCount: 0,
    isLoading: true,
    error: null
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    username: '',
    bio: '',
    avatarFile: null,
    avatarPreview: null
  });

  const gifsData = [
    {
      id: 1,
      image: image,
      title: "Golden Teddy",
      description: "Эксклюзивный NFT-медведь, созданный в честь 1 миллиона пользователей AtomGlide. Этот редкий цифровой актив символизирует успех и престиж.",
      rarity: "Легендарный",
      owner: `---`,
      dateAcquired: " 27.04.2025 до 05.05.2025"
    },
    {
      id: 2,
      image: image1,
      title: "Pavel Durov",
      description: "Особая коллекционная NFT-карточка с изображением Павла Дурова. Выпущена ограниченным тиражом в 100 экземпляров.",
      rarity: "Редкий",
      owner: '---',
      dateAcquired: " 27.04.2025 до 05.05.2025"
    },

  ];

  const getAvatarUrl = (avatarPath) => 
    avatarPath?.startsWith('http') ? avatarPath : `${process.env.REACT_APP_API_BASE_URL}${avatarPath || '/default-avatar.jpg'}`;

  const getCoverUrl = (coverPath) => 
    coverPath?.startsWith('http') ? coverPath : `${process.env.REACT_APP_API_BASE_URL}${coverPath}`;

  const getThemeColor = () => {
    const theme = state.user?.theme || 'dark';
    const themes = {
      light: '#f5f5f5',
      dark: '#121212',
      blue: '#1e88e5',
      green: '#43a047',
      purple: '#8e24aa'
    };
    return themes[theme] || themes.dark;
  };

  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  const handleGifClick = (gif) => {
    setSelectedGif(gif);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [profileRes, postsRes] = await Promise.all([
          axios.get(`/users/${id}`, { headers }),
          axios.get(`/posts/user/${id}`, { headers })
        ]);

        const userData = profileRes.data?.user || profileRes.data;
        if (!userData?._id) throw new Error('Неверный формат данных пользователя');

        const isSubscribed = userData.followers?.some(follower => 
          (follower === currentUser?._id) || (follower._id === currentUser?._id)
        );

        setState(prev => ({
          ...prev,
          user: userData,
          posts: postsRes.data || [],
          isSubscribed,
          followersCount: userData.followers?.length || 0,
          subscriptionsCount: userData.subscriptions?.length || 0,
          isLoading: false
        }));

      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err.response?.data?.message || err.message || 'Ошибка загрузки данных'
        }));
      }
    };

    fetchData();
  }, [id, currentUser?._id]);

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const method = state.isSubscribed ? 'delete' : 'post';
      await axios[method](`/users/${state.isSubscribed ? 'unsubscribe' : 'subscribe'}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setState(prev => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        followersCount: prev.isSubscribed 
          ? prev.followersCount - 1 
          : prev.followersCount + 1
      }));

    } catch (err) {
      console.error('Ошибка подписки:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleEditClick = () => {
    setEditForm({
      fullName: state.user.fullName,
      username: state.user.username?.replace('@', ''),
      bio: state.user.about || '',
      avatarFile: null,
      avatarPreview: null
    });
    setEditModalOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditForm(prev => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('fullName', editForm.fullName);
      formData.append('username', editForm.username);
      formData.append('about', editForm.bio);
      
      if (editForm.avatarFile) {
        formData.append('avatar', editForm.avatarFile);
      }

      const response = await axios.patch(`/users/${state.user._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        setState(prev => ({
          ...prev,
          user: {
            ...prev.user,
            fullName: editForm.fullName,
            username: editForm.username,
            about: editForm.bio,
            avatarUrl: response.data.avatarUrl || prev.user.avatarUrl
          }
        }));
        setEditModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      // Handle error (show notification, etc.)
    }
  };

  const renderEditModal = () => (
    <div className="edit-profile-modal" onClick={() => setEditModalOpen(false)}>
      <div className="edit-profile-content" onClick={e => e.stopPropagation()}>
        <div className="edit-profile-header">
          <h2>Edit profile</h2>
          <button className="close-button" onClick={() => setEditModalOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="edit-profile-form">
          <div className="avatar-upload">
            <div className="avatar-preview">
              <img 
                src={editForm.avatarPreview || getAvatarUrl(state.user.avatarUrl)} 
                alt="Avatar preview" 
              />
            </div>
            <input
              type="file"
              accept="image/*"
              id="avatar-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="avatar-input" className="upload-button">
              Change avatar
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="input-field"
              value={editForm.fullName}
              onChange={e => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="input-field"
              value={editForm.username}
              onChange={e => setEditForm(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              className="input-field"
              value={editForm.bio}
              onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
              maxLength={160}
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              {editForm.bio.length}/160 characters
            </small>
          </div>

          <div className="form-actions">
            <button className="cancel-button" onClick={() => setEditModalOpen(false)}>
              Cancel
            </button>
            <button className="save-button" onClick={handleSaveProfile}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileHeader = () => (
    <div className="profile-header">
      <div className="profile-avatar-wrapper">
        <Avatar 
          alt={state.user.fullName} 
          src={getAvatarUrl(state.user.avatarUrl)} 
          className="profile-avatar"
        />
        {isCurrentUser && (
          <button className="edit-button avatar-edit-button" onClick={handleEditClick}>
            <EditIcon fontSize="small" />
          </button>
        )}
      </div>

      <div className="profile-info">
        <h1 className="profile-name">{state.user.fullName}</h1>
        <h2 className="profile-username">@{state.user.username?.replace('@', '')}</h2>
        
        {isCurrentUser ? (
          <button className="action-button" onClick={handleEditClick}>
            Edit profile
          </button>
        ) : (
          <button 
            className={`action-button follow-button ${state.isSubscribed ? 'following' : ''}`}
            onClick={handleSubscribe}
          >
            {state.isSubscribed ? 'Unfollow' : 'Follow'}
          </button>
        )}

        <div className="profile-bio">
          {state.user.about || 'No bio provided'}
        </div>

        <div className="followers-panel">
          <a href="#" className="followers-link">
            <PeopleIcon className="followers-icon" fontSize="small" />
            <span className="followers-count">{state.followersCount}</span>
            followers
          </a>
          <a href="#" className="followers-link">
            <PeopleIcon className="followers-icon" fontSize="small" />
            <span className="followers-count">{state.subscriptionsCount}</span>
            following
          </a>
        </div>

        <div className="profile-details">
          {state.user.location && (
            <div className="info-item">
              <LocationIcon className="info-icon" />
              <span>{state.user.location}</span>
            </div>
          )}
          {state.user.email && (
            <div className="info-item">
              <EmailIcon className="info-icon" />
              <span>{state.user.email}</span>
            </div>
          )}
          {state.user.website && (
            <div className="info-item">
              <LinkIcon className="info-icon" />
              <a href={state.user.website} target="_blank" rel="noopener noreferrer">
                {state.user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="info-item">
            <CalendarIcon className="info-icon" />
            <span>Joined {new Date(state.user.createdAt).toLocaleDateString('en-US', { 
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="profile-tabs">
      <ul className="tabs-list">
        <li 
          className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BookIcon className="tab-icon" fontSize="small" />
          Overview
        </li>
        <li 
          className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <StorageIcon className="tab-icon" fontSize="small" />
          Posts
        </li>
      </ul>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="overview-content">
          <div className="readme-section">
            <div className="readme-header">About</div>
            <div className="readme-content">
              {state.user.about || 'No description provided.'}
            </div>
          </div>

          <div className="pinned-items">
            <h3>Popular posts</h3>
            <div className="posts-grid">
              {state.posts.slice(0, 6).map(post => (
                <Post
                  key={post._id}
                  _id={post._id}
                  title={post.title}
                  text={post.text}
                  imageUrl={post.imageUrl}
                  tags={post.tags}
                  viewsCount={post.viewsCount}
                  user={state.user}
                  createdAt={post.createdAt}
                  likesCount={post.likes?.count || 0}
                  dislikesCount={post.dislikes?.count || 0}
                  userReaction={post.userReaction}
                  compact={true}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="posts-section">
        <div className="posts-grid">
          {state.posts.map(post => (
            <Post
              key={post._id}
              _id={post._id}
              title={post.title}
              text={post.text}
              imageUrl={post.imageUrl}
              tags={post.tags}
              viewsCount={post.viewsCount}
              user={state.user}
              createdAt={post.createdAt}
              likesCount={post.likes?.count || 0}
              dislikesCount={post.dislikes?.count || 0}
              userReaction={post.userReaction}
              compact={true}
            />
          ))}
        </div>
      </div>
    );
  };

  if (state.isLoading) {
    return (
      <div className="profile-loading">
        <CircularProgress />
      </div>
    );
  }

  if (state.error || !state.user) {
    return (
      <div className="profile-error">
        <Typography color="error">{state.error || 'User not found'}</Typography>
      </div>
    );
  }

  const isCurrentUser = currentUser?._id === state.user._id;

  return (
    <div className="profile-container">
      <div className="profile-left-side">
        {renderProfileHeader()}
      </div>
      <div className="profile-content">
        {renderTabs()}
        {renderContent()}
      </div>

      {editModalOpen && renderEditModal()}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

export default Profile;