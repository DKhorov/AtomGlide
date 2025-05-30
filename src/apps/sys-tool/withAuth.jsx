import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuth } from '../../redux/slices/auth';

const withAuth = (Component) => {
  return (props) => {
    const isAuth = useSelector(selectIsAuth);
    const location = useLocation(); // Это заставит компонент обновляться при изменении маршрута
    
    return isAuth ? <Component {...props} /> : <Navigate to="/login" />;
  };
};

export default withAuth;