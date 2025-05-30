import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { Close, Image as ImageIcon } from '@mui/icons-material';

const UploadDialog = ({
  openUploadDialog,
  setOpenUploadDialog,
  handleUpload,
  handleFileChange,
  handleCoverChange,
  handleInputChange,
  newMusic,
  selectedFile,
  selectedCover,
  uploading
}) => {
  // Функция для обработки отправки формы
  const handleSubmit = () => {
    // Создаем FormData для отправки файлов и данных
    const formData = new FormData();
    
    // Добавляем аудиофайл
    if (selectedFile) {
      formData.append('audio', selectedFile);
    }
    
    // Добавляем обложку, если она есть
    if (selectedCover) {
      formData.append('cover', selectedCover);
    }
    
    // Добавляем остальные данные формы
    formData.append('title', newMusic.title);
    formData.append('artist', newMusic.artist);
    formData.append('album', newMusic.album || '');
    formData.append('genre', newMusic.genre);
    formData.append('lyrics', newMusic.lyrics || '');
    formData.append('explicit', newMusic.explicit ? 'true' : 'false');
    formData.append('isPodcast', newMusic.isPodcast ? 'true' : 'false');
    
    // Вызываем функцию handleUpload с formData
    handleUpload(formData);
  };

  return (
    <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} className="upload-dialog" maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="600">Загрузить музыку</Typography>
          <Button 
            onClick={() => setOpenUploadDialog(false)} 
            color="inherit"
            sx={{ minWidth: 'auto' }}
          >
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} py={2}>
          <Box display="flex" gap={2}>
            <Box flex={1}>
              <TextField
                label="Название трека"
                name="title"
                value={newMusic.title}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
              />
            </Box>
            <Box flex={1}>
              <TextField
                label="Исполнитель"
                name="artist"
                value={newMusic.artist}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
              />
            </Box>
          </Box>

          <TextField
            label="Альбом (необязательно)"
            name="album"
            value={newMusic.album}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />

          <TextField
            select
            label="Жанр"
            name="genre"
            value={newMusic.genre}
            onChange={handleInputChange}
            SelectProps={{ native: true }}
            fullWidth
            variant="outlined"
            required
          >
            <option value="">Выберите жанр</option>
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="Electronic">Electronic</option>
            <option value="Classical">Classical</option>
            <option value="Jazz">Jazz</option>
            <option value="Other">Other</option>
          </TextField>

          <Box>
            <Typography variant="subtitle2" gutterBottom>Обложка трека</Typography>
            <Box display="flex" alignItems="center" gap={2}>
              {selectedCover ? (
                <Box width={100} height={100} position="relative">
                  <img 
                    src={URL.createObjectURL(selectedCover)} 
                    alt="Обложка трека" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                  />
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleCoverChange(null)}
                    sx={{ position: 'absolute', top: 0, right: 0, minWidth: 'auto' }}
                  >
                    <Close fontSize="small" />
                  </Button>
                </Box>
              ) : (
                <Box 
                  width={100} 
                  height={100} 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  border="1px dashed" 
                  borderRadius={1}
                >
                  <ImageIcon color="action" />
                </Box>
              )}
              <Button variant="outlined" component="label">
                {selectedCover ? 'Заменить' : 'Добавить'}
                <input 
                  type="file" 
                  accept="image/*" 
                  hidden 
                  onChange={(e) => handleCoverChange(e.target.files[0])}
                />
              </Button>
            </Box>
          </Box>

          <TextField
            label="Текст песни (необязательно)"
            name="lyrics"
            value={newMusic.lyrics}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={newMusic.explicit}
                onChange={handleInputChange}
                name="explicit"
                color="primary"
              />
            }
            label="Содержит ненормативную лексику"
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>Аудиофайл</Typography>
            <Button variant="contained" component="label" fullWidth>
              {selectedFile ? selectedFile.name : 'Выбрать аудиофайл'}
              <input 
                type="file" 
                accept="audio/*" 
                hidden 
                onChange={(e) => handleFileChange(e.target.files[0])}
                required
              />
            </Button>
            <Typography variant="caption" color="textSecondary" mt={1} display="block">
              Поддерживаемые форматы: MP3, WAV, OGG (макс. 50MB)
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button 
          onClick={() => setOpenUploadDialog(false)} 
          variant="outlined"
          sx={{ mr: 2 }}
          disabled={uploading}
        >
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedFile || uploading || !newMusic.title || !newMusic.artist || !newMusic.genre}
          variant="contained"
          color="primary"
          sx={{ background: 'linear-gradient(to right, #4A90E2, #357ABD)' }}
        >
          {uploading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Загрузить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;