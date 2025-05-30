import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Post } from "../post/post";
import axios from "../../axios";
import styles from '../../style/post-fullview/FULLPOST.scss';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { themes } from 'prism-react-renderer';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShareIcon from '@mui/icons-material/Share';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Popover from '@mui/material/Popover';


export const FullPost = () => {
  const [post, setPost] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState(null);
  const [commentsLoading, setCommentsLoading] = React.useState(false);
  const [commentsCount, setCommentsCount] = React.useState(0);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [lengthLimitModalOpen, setLengthLimitModalOpen] = React.useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.data);

  const processImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${process.env.REACT_APP_API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  };

  const handleDownload = () => {
    if (!post) return;
    const element = document.createElement("a");
    const file = new Blob([post.text], {type: 'text/markdown'});
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
        text: post.text.substring(0, 100) + '...',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована!');
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const [commentsRes, countRes] = await Promise.all([
        axios.get(`/posts/${id}/comments`),
        axios.get(`/posts/${id}/comments/count`)
      ]);
      setComments(commentsRes.data);
      setCommentsCount(countRes.data.count);
    } catch (err) {
      setErrorMessage('Ошибка загрузки комментариев');
      setErrorModalOpen(true);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.length > 100) {
      setLengthLimitModalOpen(true);
      return;
    }
    
    if (!userData) return navigate('/login');
    
    try {
      const endpoint = replyingTo 
        ? `/posts/${id}/comments/${replyingTo}/reply`
        : `/posts/${id}/comments`;
      
      await axios.post(endpoint, { text: newComment });
      await fetchComments();
      setNewComment('');
      setReplyingTo(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Ошибка добавления');
      setErrorModalOpen(true);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;
    try {
      await axios.delete(`/posts/${id}/comments/${commentId}`);
      await fetchComments();
    } catch (err) {
      setErrorMessage('Ошибка удаления');
      setErrorModalOpen(true);
    }
  };

  const Comment = ({ comment, level = 0 }) => (
    <div className={`comment comment-level-${level}`}>
      <div className="comment-header">
        <Avatar 
          src={processImageUrl(comment.user?.avatarUrl)}
          className="comment-avatar"
        />
        <div className="comment-author">
          <span>{comment.user?.fullName}</span>
          <time className="comment-time">
            {formatDistanceToNow(new Date(comment.createdAt), { locale: ru, addSuffix: true })}
          </time>
        </div>
      </div>
      
      <div className="comment-content">
        {comment.text}
      </div>

      <div className="comment-actions">

        {(userData?._id === comment.user?._id || userData?.isAdmin) && (
          <Button 
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteComment(comment._id)}
            className="comment-action-btn danger"
          >
            Удалить
          </Button>
        )}
      </div>

      {replyingTo === comment._id && (
        <div className="comment-reply-form">
          <TextField
            fullWidth
            multiline
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите ответ..."
            className="comment-input"
          />
          <div className="comment-form-actions">
            <Button 
              variant="contained" 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="comment-submit-btn"
            >
              Отправить
            </Button>
          </div>
        </div>
      )}

      {comment.replies?.map(reply => (
        <Comment key={reply._id} comment={reply} level={level + 1} />
      ))}
    </div>
  );

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/posts/${id}`);
        setPost({
          ...data,
          imageUrl: processImageUrl(data.imageUrl),
          user: {
            ...data.user,
            avatarUrl: processImageUrl(data.user?.avatarUrl)
          }
        });
        await fetchComments();
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) return (
    <Box className="loading-container">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <div className="error-container">
      <h3>Ошибка загрузки</h3>
      <p>{error}</p>
      <Button onClick={() => navigate('/')}>На главную</Button>
    </div>
  );

  return (
    <div className="full-post-container">
      {post && (
        <>
          <Post {...post} isFullPost={true} />
          
          <div className="comments-section">
            <h3>Комментарии ({commentsCount})</h3>
            
            {userData ? (
              <div className="comment-form">
                <input
                  type="text"
                  multiline
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Оставьте комментарий..."
                  className="comment-input"
                />
                <div className="form-actions">
                  <Button 
                    variant="contained" 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Отправить
                  </Button>
                </div>
              </div>
            ) : (
              <div className="auth-prompt">
                <Button onClick={() => navigate('/login')}>Войдите чтобы комментировать</Button>
              </div>
            )}

            <div className="comments-list">
              {commentsLoading ? (
                <CircularProgress />
              ) : comments.length > 0 ? (
                comments.map(comment => (
                  <Comment key={comment._id} comment={comment} />
                ))
              ) : (
                <p className="no-comment">Пока нет комментариев</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Модальные окна */}
      <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <DialogTitle>Ошибка</DialogTitle>
        <DialogContent><p>{errorMessage}</p></DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorModalOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={lengthLimitModalOpen} onClose={() => setLengthLimitModalOpen(false)}>
        <DialogTitle>Слишком длинный комментарий</DialogTitle>
        <DialogContent>
          <p>Максимум 100 символов (сейчас {newComment.length})</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLengthLimitModalOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};