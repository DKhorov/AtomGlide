import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import styles from './Login.module.scss';
import { fetchAuth } from '../../../redux/slices/auth';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({...errors, [name]: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      return setErrors({...errors, password: 'Password must be at least 6 characters'});
    }

    setIsSubmitting(true);
    setErrors({...errors, general: ''});

    try {
      const authResult = await dispatch(fetchAuth({
        username: formData.username,
        password: formData.password
      }));

      if (authResult.payload?.token) {
        navigate('/');
      } else {
        setErrors({...errors, general: 'Incorrect username or password'});
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setErrors({...errors, general: 'Login error'});
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
    <div className={styles.spaceContainer}>
      <div className={styles.dynamicBar}></div>
      
      <div className={styles.grayPanel}>
        <div className={styles.panelHeader}>
          <Avatar
            src="${process.env.REACT_APP_API_BASE_URL}/uploads/1746963814842-747665437.png"
            className={styles.metalAvatar}
          />
          <h1 className={styles.osTitle}>AtomGlide</h1>
          <p className={styles.osSubtitle}>Sign in with your account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.terminalForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.hudLabel}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.graphiteField}
              autoFocus
              placeholder="@dmitry"
            />
            {errors.username && <div className={styles.systemAlert}>{errors.username}</div>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.hudLabel}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.graphiteField}
              placeholder="Тут пароль"
            />
            {errors.password && <div className={styles.systemAlert}>{errors.password}</div>}
          </div>

          {errors.general && (
            <div className={styles.securityNotice}>
              <svg className={styles.warningIcon} viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 12a1 1 0 110 2 1 1 0 010-2zm1-9a1 1 0 00-2 0v4a1 1 0 002 0V5z"/>
              </svg>
              {errors.general}
            </div>
          )}

          <div className={styles.controlRow}>
            <a href="/register" className={styles.titaniumLink}>Create System Account</a>
            <button type="submit" className={styles.proceedButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <div className={styles.loaderRing}></div>
              ) : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;