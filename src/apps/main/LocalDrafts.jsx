import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  styled,
  ListItemIcon // Добавлен этот импорт
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  SortByAlpha as SortAlphaIcon,
  AccessTime as TimeIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

const tagColors = [
  '#ff80ab', '#82b1ff', '#b9f6ca', '#ffd180', 
  '#ea80fc', '#8c9eff', '#ccff90', '#ffff8d'
];
const LocalDrafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('codeDrafts')) || [];
      setDrafts(savedDrafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };

  const handleDeleteDraft = (id) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    localStorage.setItem('codeDrafts', JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
    setDeleteDialogOpen(false);
  };

  const handleSaveAsTxt = (draft) => {
    const content = `Title: ${draft.title}\n\nDescription: ${draft.description}\n\nTags: ${draft.postTags}\n\nLanguage: ${draft.language}\n\nContent:\n${draft.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${draft.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImageClick = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentImageUrl(url);
      setImageModalOpen(true);
    }
  };

  const filteredDrafts = drafts.filter(draft => 
    draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDrafts = [...filteredDrafts].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const colors = {
    card: '#161b22',
    accent: '#58a6ff'
  };

  const CodeBlock = styled(Box)(({ theme }) => ({
    backgroundColor: colors.card,
    padding: theme.spacing(2),
    borderRadius: '8px',
    overflowX: 'auto',
    fontFamily: 'monospace',
    margin: theme.spacing(2, 0),
    borderLeft: `4px solid ${colors.accent}`
  }));

  return (
    <div className="mepost-main">
      <div className="controls-section">
        <div className="search-sort-container">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Поиск черновиков..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
            }}
            sx={{ width: 300 }}
          />

          <FormControl variant="outlined" size="small" sx={{ ml: 2, width: 200 }}>
            <InputLabel>Сортировка</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Сортировка"
            >
              <MenuItem value="date">
                <TimeIcon fontSize="small" sx={{ mr: 1 }} /> По дате
              </MenuItem>
              <MenuItem value="title">
                <SortAlphaIcon fontSize="small" sx={{ mr: 1 }} /> По названию
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="post-main">
        {sortedDrafts.map((draft) => {
          const tagsArray = draft.postTags.split(',').map(tag => tag.trim()).filter(tag => tag);
          
          return (
            <div key={draft.id} className="post-ad">
              <div className="post-GHJ">
                <div className="post-header">
                  <div className="user-info">
                    <span className="post-date">
                      {new Date(draft.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDraft(draft);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>

                <h1 className="title-GHJ-d">{draft.title || 'Без названия'}</h1>

                <p className="post-description2">
                  {draft.description || 'Нет описания'}
                </p>

                {draft.file && (
                  <div className="image-container" onClick={() => handleImageClick(draft.file)}>
                    <img
                      className="img-IKLS"
                      src={URL.createObjectURL(draft.file)}
                      alt={draft.title}
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="post-content">
                  <div className="description-GHJ">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          return (
                            <CodeBlock {...props}>
                              {children}
                            </CodeBlock>
                          );
                        }
                      }}
                    >
                      {draft.content}
                    </ReactMarkdown>
                  </div>

                  <div className="meta-info">
                    <div className="tags-GHJ">
                      <Chip
                        label={draft.language}
                        variant="outlined"
                        size="small"
                        sx={{
                          color: '#18a3f9',
                          fontSize: '10px',
                          borderColor: 'rgba(24, 163, 249, 0.3)',
                          bgcolor: 'rgba(24, 163, 249, 0.08)'
                        }}
                      />
                    </div>
                    
                    {tagsArray.length > 0 && (
                      <div className="tags-GHJ">
                        {tagsArray.map((tag, i) => {
                          const color = tagColors[i % tagColors.length];
                          return (
                            <Chip
                              key={i}
                              label={`#${tag}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                color: color,
                                fontSize: '10px',
                                borderColor: `${color}40`,
                                bgcolor: `${color}10`
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                
                </div>
              </div>
            </div>
          );
        })}

        {drafts.length === 0 && (
          <div className="empty-drafts">
            <p>Нет сохраненных черновиков</p>
          </div>
        )}
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Удалить черновик?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить "{selectedDraft?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button 
            onClick={() => handleDeleteDraft(selectedDraft?.id)}
            color="error"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        fullScreen
      >
        <DialogActions>
          <IconButton onClick={() => setImageModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <img
            src={currentImageUrl}
            alt="Превью"
            style={{ maxWidth: '100%', maxHeight: '90vh' }}
          />
        </DialogContent>
      </Dialog>

      <Menu
        open={Boolean(selectedDraft)}
        onClose={() => setSelectedDraft(null)}
        anchorEl={document.body}
      >
        <MenuItem onClick={() => {
          handleSaveAsTxt(selectedDraft);
          setSelectedDraft(null);
        }}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          Скачать
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteDialogOpen(true);
          setSelectedDraft(null);
        }}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          Удалить
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LocalDrafts;