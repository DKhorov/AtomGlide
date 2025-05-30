import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import { selectIsAuth } from '../../redux/slices/auth';
import { BsGrid3X3Gap, BsListUl, BsGrid } from 'react-icons/bs';
import '../../style/work/work.scss';
import { Post } from '../post/post';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button, Box, CircularProgress } from '@mui/material';

const Time = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visiblePosts, setVisiblePosts] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { posts, tags } = useSelector(state => state.posts);
  const userData = useSelector(state => state.auth.data);
  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchPosts());
        await dispatch(fetchTags());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const githubPanels = [
    {
      icon: '🏪',
      color: '#4CAF50',
      title: 'AtomGlide Store',
      description:'Магазин проектов пользователей и их проекты,программы'
    },
    {
      icon: '📻',
      color: '#2196F3',
      title: 'AtomGlide Music',
      description:'Музыкальный сервис от AtomGlide без ограничений в высоком качестве'
    },
    {
      icon: '⚡',
      color: '#9C27B0',
      title: 'Popular Post',
      description: 'Топ чарт самых поплуряных постов за все время!'
    },
    {
      icon: '❤️‍🔥',
      color: '#FF9800',
      title: 'Live-Chat',
      description: 'Форум,живой чат'
    }
  ];

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisiblePosts(prev => prev + 20);
      setIsLoadingMore(false);
    }, 500);
  };

  // Фильтруем невалидные посты
  const validPosts = Array.isArray(posts?.items) ? posts.items.filter(post => 
    post && 
    post._id && 
    post.title && 
    post.createdAt && 
    !post.isDeleted && 
    post.user
  ) : [];

  // Сортируем по дате создания
  const sortedValidPosts = [...validPosts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Фильтруем по поиску и ограничиваем количество видимых постов
  const filteredPosts = sortedValidPosts
    .filter(post => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        post.title?.toLowerCase().includes(searchLower) || 
        post.text?.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    })
    .slice(0, visiblePosts);

  const hasMorePosts = filteredPosts.length < sortedValidPosts.length;

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 0);
    }
  };

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <div className="mepost-main">
        <div className="post-main">
          {[...Array(5)].map((_, index) => (
            <Post key={`skeleton-${index}`} isLoading={true} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mepost-main">
      <div className="main-container">
        <div className="welcome-section">
          <div className="welcome-header">
            <div className="welcome-info">
              <div className="welcome-text">Привет {userData?.fullName || 'User'} !</div>
              <div className="welcome-name">AtomGlide 7.5</div>
            </div>
            <div className="current-time">{formatTime(currentTime)}</div>
          </div>

        </div>

        {showSearch && (
          <input 
            type="text"
            className="search-input"
            ref={searchInputRef}
            placeholder="Введите запрос..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <Post
              key={post._id}
              _id={post._id}
              imageUrl={post.imageUrl}
              title={post.title}
              description={post.description}
              text={post.text}
              tags={post.tags}
              language={post.language}
              viewsCount={post.viewsCount}
              commentsCount={post.commentsCount}
              user={post.user}
              createdAt={post.createdAt}
              isEditable={userData?._id === post.user?._id}
              likesCount={post.likes?.count || 0}
              dislikesCount={post.dislikes?.count || 0}
              files={post.attachments}
              isLoading={false}
            />
          ))}
        </div>

        {hasMorePosts && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Button
              variant="contained"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              sx={{
                backgroundColor: '#238636',
                '&:hover': {
                  backgroundColor: '#2ea043'
                }
              }}
            >
              {isLoadingMore ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Загрузить еще'
              )}
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
}

export default Time;