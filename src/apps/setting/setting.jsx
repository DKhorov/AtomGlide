import React, { useState, useEffect } from 'react';
import {
  SettingsContainer,
  SettingsSection,
  SectionTitle,
  ThemeGrid,
  ThemeOption,
  ThemePreview,
  ThemeName,
  Button,
  PasswordForm,
  FormGroup,
  ComingSoon,
  SoundOption,
  SoundLabel,
  RadioGroup,
  RadioOption,
  ExportButton,
  CustomThemePanel
} from './settingsStyles';
import styled from '@emotion/styled';

const SettingsPage = () => {
  const [soundSetting, setSoundSetting] = useState('medium');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCustomThemeActive, setIsCustomThemeActive] = useState(false);

  const themes = [
     {
      name: 'Classic ( AtomGlide OrangeStorm)',
      imgUrl: 'https://wallpapercave.com/wp/wp2757874.gif',
      text: '#00FF00',
      isAnimated: true
    },
    { 
      name: 'Fruiter Aero', 
      imgUrl: 'https://atomglidedev.ru/uploads/1747260633817-703941042.png',
      text: '#FFFFFF' 
    },
    { 
      name: 'Dark Aero', 
      imgUrl: 'https://frutiger-aero.org/img/dark-aurora.webp',
      text: '#FFFFFF' 
    },
    { 
      name: 'Windows Vista', 
      imgUrl: 'https://atomglidedev.ru/uploads/1747260730232-445972766.jpg',
      text: '#000000' 
    },
    { 
      name: 'MacOS 9', 
      imgUrl: 'https://preview.redd.it/old-macos-9-wallpapers-remastered-to-the-new-finder-logo-v0-mf89d4qu7u4e1.png?width=4480&format=png&auto=webp&s=2b74c97789f2f4961879e3f4621bd712dee8db5d',
      text: '#000000' 
    },
    { 
      name: 'Windows XP', 
      imgUrl: 'https://cdn.wallpaperhub.app/cloudcache/c/1/4/5/2/7/c1452724f0c3bb5a9a9a9898b4c0a0cfac091f70.jpg',
      text: '#FFFFFF' 
    },
    { 
      name: 'macOS Sequoia', 
      imgUrl: 'https://images.macrumors.com/t/V21I5UD3QqbDolmG1zZM_OAzIS4=/2000x/article-new/2024/08/macos-sequoia-hidden-wallpaper.jpg',
      text: '#FFFFFF' 
    },
    { 
      name: 'ThinkPad', 
      imgUrl: 'https://preview.redd.it/8nixmv7qg9g21.png?width=1920&format=png&auto=webp&s=7141b33be2b7a04658dcd99afc860b83b144a46e',
      text: '#FFFFFF' 
    },
    { 
      name: 'Telegram', 
      imgUrl: 'https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/Desktop.png',
      text: '#FFFFFF' 
    },
    { 
      name: 'GitHub', 
      imgUrl: 'https://preview.redd.it/3840-x-2160-github-link-preview-banner-with-dark-theme-v0-nt29vlmrr3je1.png?auto=webp&s=78e8c8226d49ee07e97cbbe07f6ba79c7fcdb7a7',
      text: '#FFFFFF' 
    },
   
    {
      name: 'Retro Wave',
      imgUrl: 'https://wallpaperaccess.com/full/1150714.jpg',
      text: '#FF00FF'
    },
    {
      name: 'Space',
      imgUrl: 'https://wallpapercave.com/wp/wp4190643.jpg',
      text: '#FFFFFF'
    },
    // Градиентные темы
    {
      name: 'Sunset Vibes',
      gradient: 'linear-gradient(45deg, #ff6b6b, #feca57)',
      text: '#FFFFFF'
    },
    {
      name: 'Ocean Breeze',
      gradient: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
      text: '#FFFFFF'
    },
    {
      name: 'Midnight Purple',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#FFFFFF'
    },
    {
      name: 'Electric Blue',
      gradient: 'linear-gradient(135deg, #0100ec 0%, #fb36f4 100%)',
      text: '#FFFFFF'
    },
    {
      name: 'Neon Dreams',
      gradient: 'linear-gradient(to right, #fc00ff 0%, #00dbde 100%)',
      text: '#FFFFFF'
    },
    {
      name: 'Cyber Punk',
      gradient: 'linear-gradient(to right, #f953c6 0%, #b91d73 100%)',
      text: '#FFFFFF'
    }
  ];

  // Загрузка сохраненных настроек
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('selectedTheme') || themes[0].name;
  });

  const [customThemeUrl, setCustomThemeUrl] = useState(() => {
    return localStorage.getItem('customThemeUrl') || '';
  });

  // Применение темы при загрузке
  useEffect(() => {
    applyTheme(selectedTheme);
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }, []);

  const applyTheme = (themeName) => {
    const theme = themes.find(t => t.name === themeName);
    if (!theme) return;

    if (theme.gradient) {
      document.body.style.backgroundImage = 'none';
      document.body.style.background = theme.gradient;
    } else {
      document.body.style.background = 'none';
      document.body.style.backgroundImage = `url(${theme.imgUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
      
      if (theme.isAnimated) {
        document.body.style.animation = 'backgroundScroll 20s linear infinite';
      } else {
        document.body.style.animation = 'none';
      }
    }

    localStorage.setItem('selectedTheme', themeName);
  };

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
    applyTheme(themeName);
  };

  const handleCustomThemeSubmit = (e) => {
    e.preventDefault();
    if (customThemeUrl) {
      localStorage.setItem('customThemeUrl', customThemeUrl);
      localStorage.setItem('selectedTheme', 'Custom');
      applyTheme('Custom');
    }
  };

  return (
    <SettingsContainer>
      <SettingsSection>
        <SectionTitle>Темы</SectionTitle>
        <ThemeGrid>
          {themes.map((theme) => (
            <ThemeOption 
              key={theme.name} 
              onClick={() => handleThemeSelect(theme.name)}
              className={selectedTheme === theme.name ? 'selected' : ''}
            >
              <ThemePreview 
                style={{ 
                  background: theme.gradient || `url(${theme.imgUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: theme.text,
                  animation: theme.isAnimated ? 'backgroundScroll 20s linear infinite' : 'none'
                }}
              >
                <ThemeName>{theme.name}</ThemeName>
              </ThemePreview>
            </ThemeOption>
          ))}
        </ThemeGrid>
      </SettingsSection>

      {/* Custom Theme Section */}
      <SettingsSection>
        <SectionTitle>Пользовательская тема</SectionTitle>
        <form onSubmit={handleCustomThemeSubmit}>
          <FormGroup>
            <label htmlFor="customThemeUrl">URL изображения:</label>
            <input
              type="text"
              id="customThemeUrl"
              value={customThemeUrl}
              onChange={(e) => setCustomThemeUrl(e.target.value)}
              placeholder="Введите URL изображения для фона"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--background-dark)',
                color: 'var(--text-primary)'
              }}
            />
          </FormGroup>
          <Button type="submit" disabled={!customThemeUrl}>
            Применить тему
          </Button>
        </form>
      </SettingsSection>
    </SettingsContainer>
  );
};

export default SettingsPage;