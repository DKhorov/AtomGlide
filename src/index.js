import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import theme from './apps/sys-tool/theme';
import AppRouter from './Router';
import { NotificationProvider } from './apps/tools/ui-menu/pushbar/pushbar';
import store from './redux/store';
import { GlobalStyles } from '@mui/material';

// Глобальная функция для применения темы
export const applyTheme = (imageUrl) => {
  if (!imageUrl) return;
  
  document.body.style.backgroundImage = `url(${imageUrl})`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center';
  document.body.style.transition = 'background-image 0.5s ease';
};

// Полный список тем (теперь единый источник правды)
export const themes = {
  'Classic': 'https://example.com/classic.jpg',
  'Fruiter Aero': 'https://atomglidedev.ru/uploads/1747260633817-703941042.png',
  'Dark Aero': 'https://frutiger-aero.org/img/dark-aurora.webp',
  'Windows Vista': 'https://atomglidedev.ru/uploads/1747260730232-445972766.jpg',
  'MacOS 9': 'https://preview.redd.it/old-macos-9-wallpapers-remastered-to-the-new-finder-logo-v0-mf89d4qu7u4e1.png',
  'Windows XP': 'https://cdn.wallpaperhub.app/cloudcache/c/1/4/5/2/7/c1452724f0c3bb5a9a9a9898b4c0a0cfac091f70.jpg',
  'macOS Sequoia': 'https://images.macrumors.com/t/V21I5UD3QqbDolmG1zZM_OAzIS4=/2000x/article-new/2024/08/macos-sequoia-hidden-wallpaper.jpg',
  'ThinkPad': 'https://preview.redd.it/8nixmv7qg9g21.png?width=1920&format=png&auto=webp&s=7141b33be2b7a04658dcd99afc860b83b144a46e',
  'Lenovo': 'https://forums.lenovo.com/uploads/topic/202109/1631504567223.jpeg?aid=264092',
  'Windows 11 Dark': 'https://winblogs.thesourcemediaassets.com/sites/2/2021/10/Windows-11-Bloom-Screensaver-Dark-scaled.jpg',
  'Windows 11': 'https://cdn.wallpaperhub.app/cloudcache/2/b/c/3/7/5/2bc375a59ea8bb65dbd995b77ab56cbc3107a651.jpg',
  'GTA Vice City': 'https://wallpapercat.com/w/full/3/4/9/2154000-1920x1080-desktop-1080p-gta-vice-city-background-photo.jpg',
  'Pavel Durov': 'https://wallpapercat.com/w/full/b/9/b/18059-1920x1280-desktop-hd-pavel-durov-wallpaper.jpg',
  'Telegram': 'https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/Desktop.png',
  'GitHub': 'https://preview.redd.it/3840-x-2160-github-link-preview-banner-with-dark-theme-v0-nt29vlmrr3je1.png?auto=webp&s=78e8c8226d49ee07e97cbbe07f6ba79c7fcdb7a7',
  'Deanon': 'https://www.meme-arsenal.com/memes/a81c76e69f20880e5899baf47a1176bc.jpg',
  'Intel': 'https://wallpapercat.com/w/full/0/6/a/2124275-2560x1600-desktop-hd-intel-wallpaper-photo.jpg',
  'Steve Jobs': 'https://wallpapercat.com/w/full/6/c/b/11251-1920x1080-desktop-1080p-steve-jobs-background-photo.jpg',
  'Arch Linux': 'https://i.redd.it/i-made-this-wallpapers-for-arch-linux-users-v0-uti28fbf49mb1.png?width=1920&format=png&auto=webp&s=852b1164a9a3a27d4981efb4e88533f9adf42c55',
  'Ubuntu Linux': 'https://wallpapers.com/images/featured/ubuntu-z6rtxbp6rijb53hx.jpg'
};

// Инициализация темы при загрузке
const initTheme = () => {
  const savedTheme = localStorage.getItem('selectedTheme');
  const customUrl = localStorage.getItem('customThemeUrl');
  
  if (savedTheme === 'Custom' && customUrl) {
    applyTheme(customUrl);
  } else if (savedTheme && themes[savedTheme]) {
    applyTheme(themes[savedTheme]);
  }
};

// Применяем тему сразу при запуске
initTheme();

// Всплывающее уведомление для мобильных устройств
const MobileAlert = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(30, 30, 30, 0.95);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  font-family: "JetBrains Mono";
  font-size: 20px;
  
  button {
    background: #4CAF50;
    color: #fff;
    border: none;
    padding: 12px 18px;
    margin-top: 30px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.3s ease;
    
    &:hover {
      background: #3e8e41;
    }
  }
`;

const MobileNotice = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (!isMobile || !isVisible) return null;

  return (
    <MobileAlert>
      <p>Для лучшего опыта советуем использовать ПК-версию.</p>
      <button onClick={() => setIsVisible(false)}>
        Продолжить просмотр
      </button>
    </MobileAlert>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box'
          },
          'body': {
            margin: 0,
            padding: 0,
            overflow: 'hidden'
          },
          '#root': {
            width: '100vw',
            height: '100vh',
            overflow: 'hidden'
          }
        }} />
        <BrowserRouter>
          <NotificationProvider>
            <AppRouter />
            <MobileNotice />
          </NotificationProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);