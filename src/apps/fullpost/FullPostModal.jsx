import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { 
  Box,
  IconButton,
  Button,
  Avatar,
  TextField,
  CircularProgress,
  Divider,
  Chip,
  Container,
  Grid,
  Typography,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const FullPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.data);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState('');
  const [commentsCount, setCommentsCount] = React.useState(0);
  const [isDraft, setIsDraft] = React.useState(false);

  const processImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://atomglidedev.ru${url}`;
  };

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const [postRes, commentsRes, countRes] = await Promise.all([
        axios.get(`/posts/${id}`),
        axios.get(`/posts/${id}/comments`),
        axios.get(`/posts/${id}/comments/count`)
      ]);

      setIsDraft(postRes.data.status === 'draft');
      
      setPost({
        ...postRes.data,
        imageUrl: processImageUrl(postRes.data.imageUrl),
        user: {
          ...postRes.data.user,
          avatarUrl: processImageUrl(postRes.data.user?.avatarUrl)
        }
      });
      setComments(commentsRes.data);
      setCommentsCount(countRes.data.count);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!userData) return;
    if (!newComment.trim()) return;

    try {
      await axios.post(`/posts/${id}/comments`, { text: newComment });
      setNewComment('');
      await fetchPostAndComments();
    } catch (err) {
      setError('Ошибка добавления комментария');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;
    try {
      await axios.delete(`/posts/${id}/comments/${commentId}`);
      await fetchPostAndComments();
    } catch (err) {
      setError('Ошибка удаления комментария');
    }
  };

  const handleDownload = () => {
    if (!post) return;
    const element = document.createElement("a");
    const file = new Blob([post.text], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${post.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  React.useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h4" color="error" gutterBottom>Ошибка</Typography>
        <Typography variant="body1" paragraph>{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Назад
        </Button>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h4" gutterBottom>Пост не найден</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Назад
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
      {isDraft && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          <Box sx={{
            transform: 'rotate(-15deg)',
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#ff5555',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            НЕДОСТУПНО
          </Box>
        </Box>
      )}

      <Grid container spacing={isMobile ? 0 : 4}>
        {/* Левая колонка - изображение и информация о посте */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: isMobile ? 2 : 3, 
            position: isMobile ? 'static' : 'sticky', 
            top: 20,
            mb: isMobile ? 3 : 0,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar 
                  src={processImageUrl(post.user?.avatarUrl)} 
                  sx={{ 
                    width: 56, 
                    height: 56,
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="bold">{post.user?.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDistanceToNow(new Date(post.createdAt), { locale: ru, addSuffix: true })}
                  </Typography>
                </Box>
              </Box>

              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  opacity: isDraft ? 0.5 : 1,
                  fontWeight: 700,
                  lineHeight: 1.3
                }}
              >
                {post.title}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                {post.tags?.map((tag, i) => (
                  <Chip 
                    key={i}
                    label={`#${tag}`}
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(100, 149, 237, 0.2)',
                      color: 'cornflowerblue',
                      border: '1px solid rgba(100, 149, 237, 0.3)',
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
            </Box>

            {post.imageUrl && (
              <Box 
                mb={3} 
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  position: 'relative',
                  '&:hover img': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <img
                  src={processImageUrl(post.imageUrl)}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                    maxHeight: isMobile ? '300px' : '400px',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            )}

            <Box display="flex" gap={2} mb={3} flexDirection={isMobile ? 'column' : 'row'}>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={handleDownload}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                Скачать
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(100, 149, 237, 0.1)'
                  }
                }}
              >
                Поделиться
              </Button>
            </Box>

            <Typography 
              variant="body1" 
              sx={{ 
                opacity: isDraft ? 0.5 : 1,
                lineHeight: 1.7,
                color: 'text.secondary'
              }}
            >
              {post.description}
            </Typography>
          </Paper>
        </Grid>

        {/* Правая колонка - содержание поста и комментарии */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: isMobile ? 2 : 3, 
            mb: 3, 
            opacity: isDraft ? 0.5 : 1,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ 
              '& img': { 
                maxWidth: '100%', 
                borderRadius: 2,
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                margin: '20px auto',
                display: 'block'
              },
              '& pre': { 
                backgroundColor: 'rgba(51, 51, 51, 0.25)', 
                backdropFilter: 'blur(5px) saturate(0.5)',
                WebkitBackdropFilter: 'blur(5px) saturate(0.5)',
                border: '1px solid rgb(81, 81, 81)',
                borderRadius: 2,
                padding: 16,
                overflowX: 'auto',
                margin: '20px 0',
                fontSize: '0.95rem'
              },
              '& code': { 
                fontFamily: 'monospace',
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '2px 4px',
                borderRadius: 2
              },
              '& p': { 
                margin: '16px 0',
                lineHeight: 1.8,
                color: 'text.primary'
              },
              '& h1, h2, h3, h4, h5, h6': { 
                margin: '24px 0 16px',
                fontWeight: 600,
                color: 'text.primary'
              },
              '& blockquote': {
                borderLeft: '4px solid #3a7bd5',
                paddingLeft: '16px',
                margin: '16px 0',
                color: 'text.secondary',
                fontStyle: 'italic'
              },
              '& a': {
                color: '#3a7bd5',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              },
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                margin: '16px 0'
              },
              '& th, & td': {
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '8px 12px',
                textAlign: 'left'
              },
              '& th': {
                backgroundColor: 'rgba(0,0,0,0.2)'
              },
              '& tr:nth-of-type(even)': {
                backgroundColor: 'rgba(0,0,0,0.1)'
              }
            }}>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline ? (
                      <pre {...props}>
                        <code className={className}>{children}</code>
                      </pre>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {post.text}
              </ReactMarkdown>
            </Box>
          </Paper>

          {/* Комментарии */}
          <Paper sx={{ 
            p: isMobile ? 2 : 3,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            backdropFilter: 'blur(10px)'
          }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <span>Комментарии</span>
              <Chip 
                label={commentsCount} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(100, 149, 237, 0.2)',
                  color: 'cornflowerblue'
                }} 
              />
            </Typography>

            {userData ? (
              <Box display="flex" gap={2} mb={3}>
                <Avatar 
                  src={processImageUrl(userData.avatarUrl)} 
                  sx={{ 
                    width: 48, 
                    height: 48,
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}
                />
                <Box flexGrow={1}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Напишите комментарий..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        borderColor: 'rgba(255,255,255,0.2)',
                        '&:hover fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Button
                      variant="contained"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      endIcon={<SendIcon />}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
                        '&:hover': {
                          opacity: 0.9
                        }
                      }}
                    >
                      Отправить
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box 
                textAlign="center" 
                py={2}
                sx={{
                  border: '1px dashed rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  mb: 3
                }}
              >
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(100, 149, 237, 0.1)'
                    }
                  }}
                >
                  Войдите, чтобы комментировать
                </Button>
              </Box>
            )}

            {comments.length > 0 ? (
              <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
                {comments.map((comment) => (
                  <Box 
                    key={comment._id} 
                    mb={3} 
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.3)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Avatar 
                        src={processImageUrl(comment.user?.avatarUrl)} 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          border: '2px solid rgba(255,255,255,0.2)'
                        }}
                      />
                      <Box flexGrow={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {comment.user?.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDistanceToNow(new Date(comment.createdAt), { locale: ru, addSuffix: true })}
                        </Typography>
                      </Box>
                      {(userData?._id === comment.user?._id || userData?.isAdmin) && (
                        <IconButton
                          onClick={() => handleDeleteComment(comment._id)}
                          color="error"
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(255,0,0,0.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Typography 
                      variant="body1" 
                      paragraph 
                      sx={{ 
                        whiteSpace: 'pre-line',
                        ml: 6,
                        color: 'text.primary',
                        lineHeight: 1.7
                      }}
                    >
                      {comment.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box 
                textAlign="center" 
                py={3} 
                color="text.secondary"
                sx={{
                  border: '1px dashed rgba(255,255,255,0.2)',
                  borderRadius: 2
                }}
              >
                Нет комментариев
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FullPostPage;