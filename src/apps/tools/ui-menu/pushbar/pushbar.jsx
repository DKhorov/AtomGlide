import React, { useState, useEffect, createContext } from 'react';
import styled from 'styled-components';

// 1. Создаем контекст уведомлений
export const NotificationContext = createContext({
  toggleNotifications: () => {},
  isNotificationsOpen: false,
  addNotification: () => {},
});

// 2. Стилизованные компоненты
const BarContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-400px')};
  width: 350px;
  height: 100vh;
  background-color: #f6f8fa;
  border-left: 1px solid #d0d7de;
  z-index: 1000;
  transition: right 0.3s ease-out;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
`;

const TimeDateContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #d0d7de;
`;

const Time = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  color: #24292f;
`;

const DateText = styled.div`
  font-size: 1rem;
  color: #57606a;
`;

const NotificationsContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 16px;
`;

const NotificationItem = styled.div`
  display: flex;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  transition: background-color 0.1s ease;

  &:hover {
    background-color: #eaeef2;
  }
`;

const NotificationIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 12px;
`;

const NotificationContent = styled.div`
  flex-grow: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: #24292f;
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  font-size: 0.875rem;
  color: #57606a;
  margin-bottom: 4px;
`;

const NotificationTime = styled.div`
  font-size: 0.75rem;
  color: #6e7781;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: #57606a;
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: #f6f8fa;
  color: #24292f;
  border: 1px solid rgba(27, 31, 36, 0.15);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
    border-color: rgba(27, 31, 36, 0.15);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 999;
`;

// 3. Компонент NotificationBar
const NotificationBar = ({ isOpen, toggle, notifications, setNotifications }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <>
      <BarContainer $isOpen={isOpen}>
        <TimeDateContainer>
          <Time>{formatTime(currentTime)}</Time>
          <DateText>{formatDate(currentTime)}</DateText>
        </TimeDateContainer>
        
        <NotificationsContainer>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem key={notification.id}>
                <NotificationIcon>{notification.icon}</NotificationIcon>
                <NotificationContent>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationMessage>{notification.message}</NotificationMessage>
                  <NotificationTime>{notification.time}</NotificationTime>
                </NotificationContent>
              </NotificationItem>
            ))
          ) : (
            <EmptyState>Нет новых уведомлений</EmptyState>
          )}
        </NotificationsContainer>
        
        <ClearButton onClick={clearNotifications}>
          Очистить уведомления
        </ClearButton>
      </BarContainer>
      
      {isOpen && <Overlay onClick={toggle} />}
    </>
  );
};

// 4. NotificationProvider
export const NotificationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Бета тест 3 - Дальше в долгий путь !',
      message: 'Читай больше тг канал автора и пиши ему,  он любит общение :)',
      time: 'сейчас',
      icon: '📦',
    },
  ]);

  const toggle = () => setIsOpen(!isOpen);

  const addNotification = (notification) => {
    setNotifications(prev => [{
      id: Date.now(),
      time: 'Только что',
      icon: 'ℹ️',
      ...notification
    }, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      toggleNotifications: toggle,
      isNotificationsOpen: isOpen,
      addNotification
    }}>
      {children}
      <NotificationBar 
        isOpen={isOpen} 
        toggle={toggle}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;