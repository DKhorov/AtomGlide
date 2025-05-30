import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { Post } from '../post/post';
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Chip,
  CircularProgress,
  Pagination,
  Typography
} from '@mui/material';
import './tage.scss';

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'education', name: 'Образование' },
  { id: 'main', name: 'Основные' },
  { id: 'entertainment', name: 'Развлечения' },
  { id: 'news', name: 'Новости' }
];

export const TagsPage = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagsData, setTagsData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Загрузка тегов по категориям
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await axios.get('/posts/tags/categories');
        setTagsData(data);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    
    fetchTags();
  }, []);

  // Загрузка постов по тегу (если есть тег в URL)
  useEffect(() => {
    if (!tag) return;

    const fetchPostsByTag = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/posts/tag/${tag}?page=${page}`);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching posts by tag:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByTag();
  }, [tag, page]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchQuery('');
  };

  const handleTagClick = (tagName) => {
    navigate(`/tags/${tagName}`);
    setPage(1);
  };

  const filteredTags = () => {
    if (!tagsData) return [];
    
    const tags = activeTab === 'all' 
      ? tagsData.all 
      : tagsData[activeTab] || [];
    
    return tags.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (tag) {
    return (
      <div className="tags-page-container">
        <div className="tag-header">
          <Typography variant="h4" component="h1">
            Посты с тегом: #{tag}
          </Typography>
          <Link to="/tags" className="back-link">
            ← Назад ко всем тегам
          </Link>
        </div>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography variant="body1" color="textSecondary" my={4}>
            Нет постов с этим тегом
          </Typography>
        ) : (
          <>
            <div className="posts-list">
              {posts.map(post => (
                <Post key={post._id} {...post} isFullPost={false} />
              ))}
            </div>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" my={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="tags-page-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Все теги
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categories.map(category => (
          <Tab 
            key={category.id} 
            label={category.name} 
            value={category.id} 
          />
        ))}
      </Tabs>

      <Box my={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск тегов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {!tagsData ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="tags-grid">
          {filteredTags().map(tagItem => (
            <Chip
              key={tagItem.name}
              label={`#${tagItem.name} (${tagItem.count})`}
              clickable
              onClick={() => handleTagClick(tagItem.name)}
              className="tag-chip"
            />
          ))}
        </div>
      )}
    </div>
  );
};