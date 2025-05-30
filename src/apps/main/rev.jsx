import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import { selectIsAuth } from '../../redux/slices/auth';
import '../../style/work/work.scss';
import { Post } from '../post/post';
import axios from '../../axios';
import { Tabs, Tab, Box, TextField, Chip, CircularProgress } from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Rev = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { posts, tags } = useSelector(state => state.posts);
  const userData = useSelector(state => state.auth.data);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('help');
  const [searchQuery, setSearchQuery] = useState('');

  // Категории тегов
  const tagCategories = [
    { id: 'help', name: 'Помощь', tags: ['Ответь', 'Отвечай', 'Помогите'] },
    { id: 'programming', name: 'Программирование', tags: ['JavaScript', 'Python', 'Java', 'C++', 'PHP', 'Ruby'] },
    { id: 'games', name: 'Игры', tags: ['Game', 'Games', 'Gaming'] },
    { id: 'all', name: 'Все теги', tags: [] }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchPosts());
        await dispatch(fetchTags());
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchQuery('');
  };

  const filteredPosts = posts.items.filter(post => {
    // Фильтрация по выбранной категории тегов
    if (activeTab !== 'all') {
      const categoryTags = tagCategories.find(cat => cat.id === activeTab)?.tags || [];
      const hasCategoryTag = post.tags?.some(tag => 
        categoryTags.some(catTag => 
          tag.toLowerCase().includes(catTag.toLowerCase())
        )
      );
      if (!hasCategoryTag) return false;
    }

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      return matchesSearch;
    }

    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
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
      <div className='ad-music'>
      <h1 className='ad-music-title'>Музыка уже в AtomGlide !</h1>
      <h4 className="ad-music-subtitle">
          AtomGlide Music — совершенно бесплатная платформа без подписок и рекламы. 
          Загружай любую музыку — здесь нет проверки на авторские права и различных ограничений. 
          Слушай музыку в наилучшем качестве с поддержкой Dolby Atmos.
        </h4>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tagCategories.map(category => (
            <Tab 
              key={category.id} 
              label={category.name} 
              value={category.id} 
            />
          ))}
        </Tabs>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Поиск по ${tagCategories.find(c => c.id === activeTab)?.name.toLowerCase() || 'постам'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {activeTab !== 'all' && (
        <Box mb={3} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tagCategories.find(c => c.id === activeTab)?.tags.map(tag => (
            <Chip
              key={tag}
              label={`#${tag}`}
              variant="outlined"
              onClick={() => setSearchQuery(tag)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      )}

      <div className="post-main">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
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
              user={post.user || {}}
              createdAt={post.createdAt}
              isEditable={userData?._id === (post.user?._id || null)}
              likesCount={post.likes?.count || 0}
              dislikesCount={post.dislikes?.count || 0}
              isLoading={false}
            />
          ))
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: 'text.secondary'
          }}>
            {searchQuery ? 'Посты не найдены' : 'Нет постов с выбранными тегами'}
          </Box>
        )}
      </div>
    </div>
  );
}

export default Rev;