import React, { useState, useEffect, useRef } from 'react';
import { 
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Badge,
  Drawer,
  useMediaQuery,
  SwipeableDrawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Fade,
  Zoom
} from '@mui/material';
import { Send, Menu, Close, Group, Wifi, PersonAdd, Refresh } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import io from 'socket.io-client';

const PrivChat = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Симуляция обновления данных
    if (isRefreshing) {
      const timer = setTimeout(() => {
        setIsRefreshing(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Здесь можно добавить реальную логику обновления данных
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Красивый индикатор обновления */}
      <Fade in={isRefreshing}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ff8a00, #e52e71, #1e90ff)',
            zIndex: 9999,
            animation: isRefreshing ? 'progress 1.5s ease-in-out infinite' : 'none',
            '@keyframes progress': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            }
          }}
        />
      </Fade>

      {/* Кнопка обновления с анимацией */}
      <Zoom in={!isRefreshing}>
        <IconButton
          onClick={handleRefresh}
          disabled={isRefreshing}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: 3,
          }}
        >
          {isRefreshing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <Refresh sx={{ transform: 'rotate(0deg)', transition: 'transform 0.3s' }} />
          )}
        </IconButton>
      </Zoom>

      {/* Уведомление об обновлении */}
      <Snackbar
        open={isRefreshing}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 6 }}
      >
        <Alert
          icon={<Wifi sx={{ transform: 'rotate(45deg)' }} />}
          severity="info"
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 3,
            alignItems: 'center'
          }}
        >
          Обновление данных...
        </Alert>
      </Snackbar>

      {/* Остальное содержимое вашего компонента */}
      <h4>Еще в обновлении чаты , пишите разрабу в тг скажет почему так </h4>
    </Box>
  );
};

export default PrivChat;