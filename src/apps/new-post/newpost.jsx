import React, { useState } from 'react';
import axios from '../../axios';
import Editor from '@monaco-editor/react';
import './newpost.scss';

const steps = ['Название', 'Описание', 'Теги', 'Текст поста'];

const defaultMarkdown = `I Love AtomGlide :)
`;

const NewPost = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [markdownContent, setMarkdownContent] = useState(defaultMarkdown);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 0:
        if (!title.trim()) {
          newErrors.title = 'Название обязательно';
        }
        break;
      case 1:
        if (!description.trim()) {
          newErrors.description = 'Описание обязательно';
        }
        break;
      case 2:
        if (tags.length === 0) {
          newErrors.tags = 'Добавьте хотя бы один тег';
        }
        break;
      case 3:
        if (!markdownContent.trim()) {
          newErrors.content = 'Текст поста обязателен';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const addTag = () => {
    if (newTag.trim()) {
      const tagToAdd = newTag.trim().replace(/,/g, '');
      if (!tags.includes(tagToAdd)) {
        setTags([...tags, tagToAdd]);
      }
      setNewTag('');
    }
  };

  const handleAddTag = (event) => {
    if ((event.key === 'Enter' || event.key === ',')) {
      event.preventDefault();
      addTag();
    }
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    if (value.endsWith(',')) {
      const tagToAdd = value.slice(0, -1).trim();
      if (tagToAdd && !tags.includes(tagToAdd)) {
        setTags([...tags, tagToAdd]);
        setNewTag('');
      }
    } else {
      setNewTag(value);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleEditorChange = (value) => {
    setMarkdownContent(value);
    if (errors.content && value.trim()) {
      setErrors({ ...errors, content: '' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    try {
      setIsLoading(true);
      let imageUrl = '';

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const uploadResponse = await axios.post('/upload', formData);
        imageUrl = uploadResponse.data.url;
      }

      const postData = {
        title,
        description,
        tags,
        text: markdownContent,
        imageUrl
      };

      await axios.post('/posts', postData);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Ошибка при создании поста');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
    window.location.reload();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="input-group">
            <label>Название проекта</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название поста"
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
        );
      case 1:
        return (
          <div className="input-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание поста"
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
        );
      case 2:
        return (
          <>
            <div className="tags-input">
              <label>Теги</label>
              <div className="tags-field">
                {tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>&times;</button>
                  </span>
                ))}
                <div className="tag-input-group">
                  <input
                    type="text"
                    value={newTag}
                    onChange={handleTagInput}
                    onKeyDown={handleAddTag}
                    placeholder="Добавьте тег"
                  />
                  <button 
                    type="button"
                    className="add-tag-button"
                    onClick={addTag}
                    disabled={!newTag.trim()}
                  >
                    Добавить
                  </button>
                </div>
              </div>
              {errors.tags && <div className="error-message">{errors.tags}</div>}
            </div>
            <div className="image-upload" onClick={() => document.getElementById('file-input').click()}>
              <input
                type="file"
                id="file-input"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
              <svg className="upload-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
              </svg>
              <p>{selectedFile ? selectedFile.name : 'Нажмите для загрузки обложки'}</p>
            </div>
          </>
        );
      case 3:
        return (
          <div className="editor-container">
            <label>Текст поста</label>
            {!markdownContent.trim() && (
              <div className="editor-placeholder">
                Введите текст вашего поста...
              </div>
            )}
            <Editor
              height="500px"
              defaultLanguage="markdown"
              value={markdownContent}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                automaticLayout: true
              }}
            />
            {errors.content && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12" y2="16" />
                </svg>
                {errors.content}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-window">
          <div className="modal-header">
            <div className="steps">
              {steps.map((label, index) => (
                <div
                  key={label}
                  className={`step ${index === activeStep ? 'active' : ''} ${
                    index < activeStep ? 'completed' : ''
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-content">
            <div className="content-wrapper">
              {renderStepContent(activeStep)}
            </div>
          </div>
          <div className="modal-footer">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className="btn-secondary"
            >
              Назад
            </button>
            <button
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isLoading || (activeStep === 0 && !title) || (activeStep === 1 && !description)}
              className="btn-primary"
            >
              {activeStep === steps.length - 1 ? 'Создать пост' : 'Далее'}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="success-modal">
          <div className="success-content">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Пост создан!</h3>
            <p>Ваш пост был успешно опубликован</p>
            <button className="close-button" onClick={handleCloseSuccess}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPost;