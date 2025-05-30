import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../../../axios';
import { fetchAuth } from '../../../redux/slices/auth';
import { Link, useNavigate } from 'react-router-dom';
import { FORBIDDEN_USERNAMES } from './forvidden-usernames';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import './reg.scss';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const validateUsername = (username) => {
    let processedUsername = username.startsWith('@') ? username : `@${username}`;

    if (!/^@[a-zA-Z0-9_]{3,20}$/.test(processedUsername)) {
      return 'Username должен начинаться с @ и содержать 3-20 символов (буквы, цифры, _)';
    }

    const cleanUsername = processedUsername.toLowerCase().replace('@', '');
    if (FORBIDDEN_USERNAMES.includes(cleanUsername)) {
      return 'Этот username запрещен к использованию';
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'username') {
      const error = validateUsername(value);
      setErrors({...errors, username: error});
    } else if (name === 'password') {
      validatePassword(value);
      if (formData.confirmPassword) {
        validatePasswords(value, formData.confirmPassword);
      }
    } else if (name === 'confirmPassword') {
      validatePasswords(formData.password, value);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setErrors({...errors, password: 'Пароль должен содержать минимум 6 символов'});
    } else {
      setErrors({...errors, password: ''});
    }
  };

  const validatePasswords = (password, confirmPassword) => {
    let error = '';
    if (password !== confirmPassword) {
      error = 'Пароли не совпадают';
    } else if (password.length < 6) {
      error = 'Пароль должен содержать минимум 6 символов';
    }
    setErrors({...errors, confirmPassword: error});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      validationErrors.username = usernameError;
    }
    
    if (formData.password.length < 6) {
      validationErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (Object.keys(validationErrors).length > 0) {
      return setErrors({...errors, ...validationErrors});
    }

    setIsSubmitting(true);
    setErrors({...errors, general: ''});

    try {
      const data = {
        username: formData.username.startsWith('@') 
          ? formData.username 
          : `@${formData.username}`,
        password: formData.password,
        fullName: `User${Date.now()}` // Добавляем временное имя
      };

      const response = await axios.post('/auth/register', data);
      
      const authResult = await dispatch(fetchAuth({
        username: data.username,
        password: data.password
      }));

      if (authResult.payload?.token) {
        navigate('/');
      }

    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Ошибка при регистрации';
      if (error.response?.data?.message?.includes('Username')) {
        errorMessage = 'Username уже занят';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setErrors({...errors, general: errorMessage});
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='loading-container'>
        <motion.div
          className='loading-spinner'
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className='spinner-inner'></div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className='loading-text'
        >
          Загрузка...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div 
      className='honky-all'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="honky-2"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <motion.div
          className="cs"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="title-h">Регистрация</h1>
          <h4 className='subtitle-h'>Есть аккаунт?</h4>
          <Link to="/login" className='subtitle-ho'>нажми чтобы войти</Link>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className='h-cat'>
            <h4 className='subtitle-hi'>Username</h4>
            <motion.input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder='Придумай @username' 
              className='input-h'
              whileFocus={{ borderBottomColor: "#06ec7d", boxShadow: "0 2px 0 0 #06ec7d" }}
            />
            {errors.username && <motion.span 
              className="error-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.username}
            </motion.span>}
          </div>
          
          <div className='h-cat'>
            <h4 className='subtitle-hi'>Пароль</h4>
            <div className="password-input-container">
              <motion.input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder='Введите пароль (мин. 6 символов)' 
                className='input-h'
                whileFocus={{ borderBottomColor: "#06ec7d", boxShadow: "0 2px 0 0 #06ec7d" }}
              />
              <motion.button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </motion.button>
            </div>
            {errors.password && <motion.span 
              className="error-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.password}
            </motion.span>}
          </div>
          
          <div className='h-cat'>
            <h4 className='subtitle-hi'>Подтвердите пароль</h4>
            <div className="password-input-container">
              <motion.input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder='Повторите пароль' 
                className='input-h'
                whileFocus={{ borderBottomColor: "#06ec7d", boxShadow: "0 2px 0 0 #06ec7d" }}
              />
              <motion.button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </motion.button>
            </div>
            {errors.confirmPassword && <motion.span 
              className="error-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.confirmPassword}
            </motion.span>}
          </div>
          
          {errors.general && <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.general}
          </motion.div>}
          
          <motion.button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Регистрация...
              </motion.span>
            ) : 'Зарегистрироваться'}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default RegistrationForm;