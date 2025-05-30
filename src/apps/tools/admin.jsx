import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography,
  Box,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField
} from '@mui/material';
import axios from '../../axios';
import VerifiedIcon from '@mui/icons-material/Verified';
import StoreIcon from '@mui/icons-material/Store';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/admin/users');
        console.log('Получены данные:', response.data);
        
        // Исправляем обращение к данным
        const receivedUsers = response.data?.users || response.data || [];
        setUsers(Array.isArray(receivedUsers) ? receivedUsers : []);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError(err.response?.data?.message || 'Ошибка загрузки пользователей');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAccountTypeChange = async (userId, newType) => {
    setUpdating(userId);
    try {
      await axios.patch(`/admin/users/${userId}/account-type`, {
        accountType: newType
      });

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, accountType: newType } : user
        )
      );
      setSuccess('Тип аккаунта обновлен');
    } catch (err) {
      console.error('Ошибка обновления:', err);
      setError(err.response?.data?.message || 'Ошибка при обновлении');
    } finally {
      setUpdating(null);
    }
  };

  // Улучшенная фильтрация
  const filteredUsers = users.filter(user => {
    if (!user) return false;
    const term = searchTerm.toLowerCase();
    return (
      (user.fullName?.toLowerCase().includes(term)) ||
      (user.email?.toLowerCase().includes(term)) ||
      (user._id?.toLowerCase().includes(term)) ||
      (user.accountType?.toLowerCase().includes(term))
    );
  });

  const getAccountTypeBadge = (type) => {
    switch (type) {
      case 'verified_user': return <VerifiedIcon color="primary" />;
      case 'shop': return <StoreIcon color="secondary" />;
      case 'admin': return <AdminPanelSettingsIcon color="success" />;
      default: return null;
    }
  };

  const getAccountTypeText = (type) => {
    switch (type) {
      case 'user': return 'Обычный';
      case 'verified_user': return 'Верифицированный';
      case 'shop': return 'Магазин';
      case 'admin': return 'Администратор';
      default: return type || 'Не указан';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Загрузка данных...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Панель администратора
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          label="Поиск пользователей"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
          sx={{ width: 350 }}
          placeholder="Поиск по имени, email или ID"
        />
        <Typography variant="body2" color="text.secondary">
          Всего: {users.length} | Найдено: {filteredUsers.length}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Тип аккаунта</TableCell>
              <TableCell>Изменить тип</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell sx={{ fontFamily: 'monospace' }}>
                    {user._id?.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {user.fullName || 'Без имени'}
                      <Box sx={{ ml: 1 }}>
                        {getAccountTypeBadge(user.accountType)}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email || 'Нет email'}</TableCell>
                  <TableCell>
                    {getAccountTypeText(user.accountType)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.accountType || 'user'}
                      onChange={(e) => handleAccountTypeChange(user._id, e.target.value)}
                      disabled={updating === user._id}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="user">Обычный</MenuItem>
                      <MenuItem value="verified_user">Верифицированный</MenuItem>
                      <MenuItem value="shop">Магазин</MenuItem>
                      <MenuItem value="admin">Администратор</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleAccountTypeChange(
                        user._id,
                        user.accountType === 'verified_user' ? 'user' : 'verified_user'
                      )}
                      disabled={updating === user._id}
                      startIcon={
                        updating === user._id ? 
                        <CircularProgress size={20} /> : 
                        <VerifiedIcon />
                      }
                    >
                      {user.accountType === 'verified_user' ? 'Снять верификацию' : 'Верифицировать'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1">
                    {users.length === 0 ? 'Нет пользователей' : 'Ничего не найдено'}
                  </Typography>
                  {searchTerm && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Попробуйте изменить параметры поиска
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;