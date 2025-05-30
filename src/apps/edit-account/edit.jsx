import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axios';
import {
  Avatar, Button, TextField, Typography,
  Select, MenuItem, FormControl, InputLabel,
  Box, Paper, Grid, IconButton
} from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import '../../style/profile/profile.scss';

const themePreviewStyles = {
  light: { bg: '#ffffff', text: '#24292e', primary: '#0366d6' },
  dark: { bg: '#0d1117', text: '#c9d1d9', primary: '#58a6ff' },
  blue: { bg: '#f0f8ff', text: '#1a365d', primary: '#3182ce' },
  green: { bg: '#f0fff4', text: '#22543d', primary: '#38a169' },
  purple: { bg: '#faf5ff', text: '#44337a', primary: '#9f7aea' }
};

const ProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.auth.data);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    about: '',
    theme: 'light',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    // Разрешаем скролл при монтировании компонента
    document.body.style.overflow = 'auto';
    
    if (currentUser?._id !== id) {
      navigate('/');
      return;
    }

   const fetchUserData = async () => {
  try {
    const res = await axios.get(`/users/${id}`);
    const user = res.data; // Изменено: данные теперь в res.data
    setFormData({
      fullName: user.fullName,
      username: user.username?.replace('@', '') || '', // Удаляем @ если он есть
      about: user.about || '',
      theme: user.theme || 'light',
    });
    if (user.avatarUrl) setAvatarPreview(axios.defaults.baseURL + user.avatarUrl);
    if (user.coverUrl) setCoverPreview(axios.defaults.baseURL + user.coverUrl);
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    setError('Не удалось загрузить данные профиля');
  }
};

    fetchUserData();

    // Восстанавливаем исходное состояние overflow при размонтировании
    return () => {
      document.body.style.overflow = '';
    };
  }, [id, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'username') {
      // Удаляем все @ из ввода и добавляем один в начало
      const cleanValue = value.replace(/@/g, '');
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateUsername = (username) => {
    if (!username) return 'Username обязателен';
    if (username.length < 3) return 'Минимум 3 символа';
    if (username.length > 20) return 'Максимум 20 символов';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Только буквы, цифры и _';
    return null;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      setError('Пожалуйста, загрузите изображение');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }
    
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      setError('Пожалуйста, загрузите изображение');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('Размер файла не должен превышать 10MB');
      return;
    }
    
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
    setError(null);
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const removeCover = () => {
    setCoverPreview(null);
    setCoverFile(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('username', `@${formData.username}`); // Добавляем @ перед сохранением
      formDataToSend.append('about', formData.about);
      formDataToSend.append('theme', formData.theme);

      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      } else if (avatarPreview === null) {
        formDataToSend.append('removeAvatar', 'true');
      }

      if (coverFile) {
        formDataToSend.append('cover', coverFile);
      } else if (coverPreview === null) {
        formDataToSend.append('removeCover', 'true');
      }

      const response = await axios.patch(`/users/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        navigate(`/account/profile/${id}`, { state: { success: 'Профиль успешно обновлен' } });
      }
    } catch (err) {
      console.error('Ошибка обновления:', err);
      setError(err.response?.data?.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      maxWidth: "auto", 
      mx: 'auto', 
      p: 3, 
      marginTop: 5,
      overflow: 'scroll' // Добавляем явное разрешение скролла
    }} className='Q-IOP'>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          mb: 4,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          Редактирование профиля
        </Typography>

        {error && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'error.light', 
            color: 'error.contrastText',
            borderRadius: 1
          }}>
            {error}
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Основная информация */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Основная информация
                </Typography>
                
                <TextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ mr: 1, color: 'text.secondary' }}>@</Typography>
                    ),
                  }}
                  helperText="Только буквы, цифры и _ (3-20 символов)"
                />

                <TextField
                  label="Полное имя"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  variant="outlined"
                  size="small"
                />

                <TextField
                  label="О себе"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 500 }}
                  helperText={`${formData.about.length}/500 символов`}
                />
              </Box>
            </Grid>

            {/* Визуальные настройки */}
            <Grid item xs={12} md={6}>
              {/* Аватар */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Аватар
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={avatarPreview || '/default-avatar.jpg'}
                      sx={{ width: 100, height: 100, border: '2px solid #fff', boxShadow: 3 }}
                    />
                    {avatarPreview && (
                      <IconButton
                        onClick={removeAvatar}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'error.dark' }
                        }}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Box>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => avatarInputRef.current.click()}
                      size="small"
                    >
                      Изменить
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                      Рекомендуемый размер: 200×200 px (макс. 5MB)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Обложка */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Обложка профиля
                </Typography>
                <Box>
                  {coverPreview ? (
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <img 
                        src={coverPreview} 
                        alt="Cover preview" 
                        style={{ 
                          width: '100%', 
                          height: 150, 
                          objectFit: 'cover',
                          borderRadius: 4,
                          boxShadow: 3
                        }} 
                      />
                      <IconButton
                        onClick={removeCover}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'error.dark' }
                        }}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      width: '100%', 
                      height: 150, 
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      boxShadow: 3
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Нет обложки
                      </Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => coverInputRef.current.click()}
                    size="small"
                    fullWidth
                  >
                    {coverPreview ? 'Изменить обложку' : 'Добавить обложку'}
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    Рекомендуемый размер: 1500×500 px (макс. 10MB)
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => navigate(`/account/profile/${id}`)}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                bgcolor: '#28a745',
                '&:hover': { bgcolor: '#218838' }
              }}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfileEdit;