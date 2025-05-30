import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Link,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Avatar,
  Paper,
  Collapse,
  styled,
  Fade,
  Slide,
  Grow,
  Zoom,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import GroupIcon from '@mui/icons-material/Group';
import GavelIcon from '@mui/icons-material/Gavel';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Темная цветовая схема
const darkColors = {
  primary: '#9147ff',
  secondary: '#772ce8',
  background: '#0d1117',
  card: '#161b22',
  text: '#e6edf3',
  accent: '#58a6ff',
  border: '#30363d',
  success: '#238636',
  danger: '#da3633',
  warning: '#d29922'
};

// Создаем темную тему
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: darkColors.primary,
    },
    secondary: {
      main: darkColors.secondary,
    },
    background: {
      default: darkColors.background,
      paper: darkColors.card,
    },
    text: {
      primary: darkColors.text,
      secondary: '#8b949e',
    },
    divider: darkColors.border,
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      color: '#8b949e',
    },
  },
});

// Стилизованные компоненты
const DarkHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${darkColors.primary} 0%, ${darkColors.secondary} 100%)`,
  color: 'white',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '6px 6px 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const DarkCard = styled(Card)(({ theme }) => ({
  backgroundColor: darkColors.card,
  border: `1px solid ${darkColors.border}`,
  borderRadius: '6px',
  boxShadow: 'none',
  marginBottom: theme.spacing(3),
  transition: 'transform 0.2s, border-color 0.2s',
  '&:hover': {
    borderColor: darkColors.accent,
    transform: 'translateY(-2px)'
  }
}));

const DarkCodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a1f29',
  padding: theme.spacing(2),
  borderRadius: '6px',
  overflowX: 'auto',
  fontFamily: 'monospace',
  fontSize: '0.9rem',
  borderLeft: `3px solid ${darkColors.accent}`,
  margin: theme.spacing(2, 0),
  color: darkColors.text
}));

const DarkSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${darkColors.border}`
}));

const DarkSidebarItem = styled(ListItem)(({ theme, active }) => ({
  padding: '4px 8px',
  borderRadius: '6px',
  backgroundColor: active ? 'rgba(145, 71, 255, 0.2)' : 'transparent',
  borderLeft: active ? `3px solid ${darkColors.primary}` : 'none',
  '&:hover': {
    backgroundColor: 'rgba(145, 71, 255, 0.1)'
  }
}));

function Dock() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [expandedSections, setExpandedSections] = useState({});

  // Добавляем скрипт для плавной прокрутки
  useEffect(() => {
    const smoothScroll = document.createElement('script');
    smoothScroll.innerHTML = `
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
        });
      });
    `;
    document.body.appendChild(smoothScroll);

    return () => {
      document.body.removeChild(smoothScroll);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
    // Прокрутка к верху страницы при смене раздела
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Разделы меню
  const menuSections = [
    { id: 'features', text: 'Заметки о выпуске', icon: <CodeIcon /> },
    { id: 'quick-start', text: 'Начало работы', icon: <RocketLaunchIcon /> },
    { id: 'API', text: 'Правила сообщества', icon: <GavelIcon /> },
    { id: 'social', text: 'Сообщество', icon: <GroupIcon /> },
    { id: 'if-not-work', text: 'Решение проблем', icon: <BugReportIcon /> },
    { id: 'thanks', text: 'Участники', icon: <GroupIcon /> }
  ];

  // Боковая панель
  const drawer = (
    <Box sx={{ 
      width: 260, 
      height: '100vh', 
      bgcolor: darkColors.background,
      borderRight: `1px solid ${darkColors.border}`,
      padding: 2,
      overflowY: 'auto'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: 2,
        paddingLeft: 1
      }}>
        <Box sx={{ 
          width: 32, 
          height: 32, 
          backgroundColor: darkColors.primary, 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 1
        }}>
          <CodeIcon sx={{ color: 'white', fontSize: 16 }} />
        </Box>
        <Typography variant="h6" sx={{ 
          color: darkColors.primary,
          fontWeight: '600'
        }}>
          AtomGlide
        </Typography>
      </Box>
      
      <List sx={{ padding: 0 }}>
        {menuSections.map((item) => (
          <DarkSidebarItem 
            key={item.id} 
            disablePadding
            active={activeSection === item.id ? 1 : 0}
          >
            <ListItemButton 
              onClick={() => handleSectionChange(item.id)}
              sx={{
                py: 1,
                px: 2
              }}
            >
              <Box sx={{ 
                color: activeSection === item.id ? darkColors.primary : darkColors.text,
                mr: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiTypography-root': {
                    color: activeSection === item.id ? darkColors.primary : darkColors.text,
                    fontWeight: activeSection === item.id ? '600' : '400',
                    fontSize: '14px'
                  }
                }} 
              />
            </ListItemButton>
          </DarkSidebarItem>
        ))}
      </List>
    </Box>
  );

  // Основное содержимое
  const renderContent = () => {
    switch (activeSection) {
      case 'features':
        return (
          <Box>
            <DarkHeader>
              <Typography variant="h4" sx={{ fontWeight: '600' }}>
                Заметки о выпуске
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                AtomGlide v7.5
              </Typography>
            </DarkHeader>
            
            <DarkCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                  <Avatar sx={{ bgcolor: darkColors.primary, width: 24, height: 24, mr: 1 }}>
                    <CodeIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>
                    Версия 7.0 - Крупное обновление интерфейса
                  </Typography>
                </Box>
                
                <DarkCodeBlock>
                  <Box component="ul" sx={{ margin: 0, paddingLeft: '20px' }}>
                    {[
                      [
  "Посты теперь в сетке",
  "Посты имеют новые иконки и анимации",
  "Новая шапка сайта",
  "Новое меню в виде dock с регулировкой положения",
  "+20 тем обоев для сайта",
  "Новый дизайн профиля 1 в 1 как из GitHub",
  "Добавлен магазин проектов",
  "Добавлен плеер в музыке на весь экран",
  "Новая панель для создания поста",
  "Панель для создания поста теперь доступна и на телефонах",
  "Новая документация",
  "Проект переписан почти с нуля",
  "Меньше использования React MUI",
  "Улучшена работа React Markdown в постах",
  "Оптимизация памяти сайта, снижена нагрузка на оперативную память",
  "Исправлено множество багов, включая редактирование профиля, создание постов и другие"
]

                    ].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </Box>
                </DarkCodeBlock>
                
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                  <Avatar sx={{ width: 20, height: 20, mr: 1 }} src="https://avatars.githubusercontent.com/u/1?s=40&v=4" />
                  <Typography variant="body2" sx={{ color: darkColors.text, mr: 2 }}>
                    Выпущено DKhorov
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkColors.text }}>
                    30 мая 2025
                  </Typography>
                </Box>
              </CardContent>
            </DarkCard>
            
            {/* Предыдущие версии */}
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Предыдущие версии
              </Typography>
              
              <Grid container spacing={2}>
                {[
                  {
                    version: "6.0",
                    date: "15 мая 2025",
                    highlights: [
                      "Интерфейс AtomUI 3",
                      "Копирование данных профиля",
                      "Предпросмотр постов",
                      "Описания на мобильных"
                    ]
                  },
                  {
                    version: "5.5",
                    date: "28 апреля 2025",
                    highlights: [
                      "Исправлено создание постов на мобильных",
                      "Новый главный экран для авторизованных",
                      "Улучшенные рекомендации"
                    ]
                  },
                  {
                    version: "5.0",
                    date: "10 апреля 2025",
                    highlights: [
                      "AtomUI 3",
                      "Кошелек и переводы",
                      "Логика регионов постов",
                      "AtomScript Gen 1"
                    ]
                  },
                  {
                    version: "4.0",
                    date: "22 марта 2025",
                    highlights: [
                      "Исправлена ошибка с часами",
                      "Исправления раздела 'О себе'",
                      "Аватары в чатах",
                      "Редактор на базе VS Code"
                    ]
                  }
                ].map((release, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <DarkCard>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: '600', marginBottom: 1 }}>
                          v{release.version}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkColors.text, marginBottom: 1 }}>
                          {release.date}
                        </Typography>
                        <Box component="ul" sx={{ 
                          paddingLeft: '20px', 
                          margin: 0,
                          fontSize: '0.8rem'
                        }}>
                          {release.highlights.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </Box>
                        <Link href="#" sx={{ 
                          fontSize: '0.8rem',
                          display: 'inline-block',
                          marginTop: 1,
                          color: darkColors.accent
                        }}>
                        </Link>
                      </CardContent>
                    </DarkCard>
                  </Grid>
                ))}
              </Grid>
            </DarkSection>
          </Box>
        );
      
      case 'quick-start':
        return (
          <Box>
            <DarkHeader>
              <Typography variant="h4" sx={{ fontWeight: '600' }}>
                Начало работы
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Начните использовать AtomGlide за минуты
              </Typography>
            </DarkHeader>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Настройка аккаунта
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    Регистрация
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Чтобы зарегистрироваться в AtomGlide:
                  </Typography>
                  <DarkCodeBlock>
                    1. Нажмите кнопку "Регистрация" на странице входа\n
                    2. Заполните все обязательные поля\n
                    3. Имя пользователя должно начинаться с @\n
                    4. Пароль должен быть не менее 6 символов\n
                    5. Завершите процесс регистрации
                  </DarkCodeBlock>
                  <Typography variant="body2" sx={{ color: darkColors.text, marginTop: 1 }}>
                    После регистрации ваш аккаунт может инициализироваться до 5 минут.
                  </Typography>
                </CardContent>
              </DarkCard>
            </DarkSection>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Создание контента
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    Создание постов
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Как создавать интересные посты:
                  </Typography>
                  <DarkCodeBlock>
                    1. Нажмите кнопку "Новый пост"\n
                    2. Заполните заголовок, описание и содержание\n
                    3. Все поля обязательны\n
                    4. Используйте #теги для лучшего обнаружения\n
                    5. Предпросмотр перед публикацией (на ПК)\n
                    6. Нажмите "Опубликовать" когда готово
                  </DarkCodeBlock>
                  <Typography variant="body2" sx={{ color: darkColors.text, marginTop: 1 }}>
                    Посты с недопустимым содержанием могут быть удалены модераторами.
                  </Typography>
                </CardContent>
              </DarkCard>
            </DarkSection>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Общение
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    Начало чатов
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Общайтесь с другими пользователями через личные сообщения:
                  </Typography>
                  <DarkCodeBlock>
                    1. Перейдите в раздел "Чаты"\n
                    2. Нажмите "+" для нового чата\n
                    3. Введите ID пользователя (находится в профиле)\n
                    4. Чат откроется автоматически\n
                    5. Начните общение
                  </DarkCodeBlock>
                  <Typography variant="body2" sx={{ color: darkColors.text, marginTop: 1 }}>
                    Все чаты приватны, но могут быть проверены модераторами при жалобе.
                  </Typography>
                </CardContent>
              </DarkCard>
            </DarkSection>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Разработка
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    AtomScript и мини-приложения
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Создание мини-приложений внутри AtomGlide:
                  </Typography>
                  <DarkCodeBlock>
                    AtomScript - наша внутренняя среда разработки:\n
                    - Проекты на основе HTML\n
                    - Встроенные стили и скрипты\n
                    - Хостинг на инфраструктуре AtomGlide\n
                    - Публикация как посты с тегом #apps\n
                    \n
                    Примечание: Внешняя интеграция API временно недоступна
                  </DarkCodeBlock>
                  <Typography variant="body2" sx={{ color: darkColors.text, marginTop: 1 }}>
                    AtomScript Gen 1 сейчас в стадии бета-тестирования.
                  </Typography>
                </CardContent>
              </DarkCard>
            </DarkSection>
          </Box>
        );
      
      case 'API':
        return (
          <Box>
            <DarkHeader>
              <Typography variant="h4" sx={{ fontWeight: '600' }}>
                Правила сообщества
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Правила для безопасной и дружелюбной среды
              </Typography>
            </DarkHeader>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Политика контента
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    Запрещенный контент
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Следующий контент запрещен в AtomGlide:
                  </Typography>
                  <DarkCodeBlock>
                    🔹 Откровенный сексуальный контент\n
                    🔹 Оскорбления религий или разжигание ненависти\n
                    🔹 Экстремистские материалы или призывы к насилию\n
                    🔹 Антиправительственный контент (мемы разрешены)\n
                    🔹 Попытки саботажа платформы\n
                    🔹 Спам или низкокачественные посты\n
                    🔹 Травля или буллинг\n
                    🔹 Незаконная деятельность\n
                    🔹 Утечка личной информации
                  </DarkCodeBlock>
                  <Typography variant="body2" sx={{ color: darkColors.text, marginTop: 1 }}>
                    Модераторы могут удалять нарушающий контент без предупреждения.
                  </Typography>
                </CardContent>
              </DarkCard>
            </DarkSection>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Конфиденциальность и данные
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    Сбор данных
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Наш подход к вашей конфиденциальности:
                  </Typography>
                  <DarkCodeBlock>
                    - Мы не собираем лишние данные\n
                    - Пароли надежно зашифрованы\n
                    - Даже разработчики не имеют доступа к паролям\n
                    - Модерация применяется ко всем публичным зонам\n
                    - Личные чаты проверяются только при жалобе\n
                    - Нет регулярного мониторинга личных сообщений
                  </DarkCodeBlock>
                  <Typography variant="body2" sx={{ color: darkColors.text, marginTop: 1 }}>
                    Мы можем связаться с вами через Telegram для важных уведомлений.
                  </Typography>
                </CardContent>
              </DarkCard>
            </DarkSection>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Стандарты профилей
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    Рекомендуемая настройка профиля
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Для лучшего опыта и видимости:
                  </Typography>
                  <DarkCodeBlock>
                    ✅ Четкая фотография профиля\n
                    ✅ Пользовательский баннер\n
                    ✅ Читаемое имя пользователя\n
                    ✅ Заполненный раздел "О себе"\n
                    ✅ Соответствующий контент\n
                    ✅ Подтвержденная контактная информация\n
                    \n
                    Хорошо оформленные профили могут быть показаны в рекомендациях!
                  </DarkCodeBlock>
                  <Typography variant="body2" sx={{ color: darkColors.text, marginTop: 1 }}>
                    Профили, нарушающие правила, могут быть ограничены.
                  </Typography>
                </CardContent>
              </DarkCard>
            </DarkSection>
          </Box>
        );
      
      case 'social':
        return (
          <Box>
            <DarkHeader>
              <Typography variant="h4" sx={{ fontWeight: '600' }}>
                Сообщество
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Свяжитесь с нами и другими пользователями
              </Typography>
            </DarkHeader>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Официальные каналы
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DarkCard>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <TelegramIcon sx={{ 
                        color: '#0088cc', 
                        fontSize: 40,
                        marginRight: 2 
                      }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: '600' }}>
                          Telegram
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                          Анонсы и обсуждения
                        </Typography>
                        <Link 
                          href="https://t.me/dkdevelop" 
                          target="_blank"
                          sx={{ 
                            color: darkColors.accent,
                            fontSize: '0.9rem'
                          }}
                        >
                          Присоединиться →
                        </Link>
                      </Box>
                    </CardContent>
                  </DarkCard>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DarkCard>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <GitHubIcon sx={{ 
                        fontSize: 40,
                        marginRight: 2,
                        color: darkColors.text
                      }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: '600' }}>
                          GitHub
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                          Исходный код фронтенда
                        </Typography>
                        <Link 
                          href="https://github.com/DKhorov" 
                          target="_blank"
                          sx={{ 
                            color: darkColors.accent,
                            fontSize: '0.9rem'
                          }}
                        >
                          Посмотреть репозиторий →
                        </Link>
                      </Box>
                    </CardContent>
                  </DarkCard>
                </Grid>
              </Grid>
            </DarkSection>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Ресурсы сообщества
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    Получение помощи
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Свяжитесь с другими пользователями и получите поддержку:
                  </Typography>
                  
                  <Box sx={{ 
                    backgroundColor: darkColors.card,
                    border: `1px solid ${darkColors.border}`,
                    borderRadius: '6px',
                    padding: 2,
                    marginBottom: 2
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: '600', marginBottom: 1 }}>
                      Официальная поддержка
                    </Typography>
                    <Typography variant="body2">
                      Свяжитесь с @AtomGlideAdmin в Telegram по вопросам аккаунта
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    backgroundColor: darkColors.card,
                    border: `1px solid ${darkColors.border}`,
                    borderRadius: '6px',
                    padding: 2
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: '600', marginBottom: 1 }}>
                      Запросы функций
                    </Typography>
                    <Typography variant="body2">
                      Предложите новые функции через встроенную систему отзывов
                    </Typography>
                  </Box>
                </CardContent>
              </DarkCard>
            </DarkSection>
          </Box>
        );
      
      case 'if-not-work':
        return (
          <Box>
            <DarkHeader>
              <Typography variant="h4" sx={{ fontWeight: '600' }}>
                Решение проблем
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Решения распространенных проблем
              </Typography>
            </DarkHeader>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Частые проблемы
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: 1,
                    cursor: 'pointer'
                  }} onClick={() => toggleSection('images')}>
                    {expandedSections['images'] ? 
                      <ExpandMoreIcon sx={{ marginRight: 1 }} /> : 
                      <ChevronRightIcon sx={{ marginRight: 1 }} />}
                    <Typography variant="h6" sx={{ fontWeight: '600' }}>
                      Изображения не загружаются
                    </Typography>
                  </Box>
                  
                  <Collapse in={expandedSections['images']}>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                      Если изображения не отображаются:
                    </Typography>
                    <DarkCodeBlock>
                      1. Обновите страницу (Ctrl + F5)\n
                      2. Проверьте интернет-соединение\n
                      3. Убедитесь, что пост содержит изображения\n
                      4. Попробуйте другой браузер\n
                      5. Очистите кеш, если проблема остается
                    </DarkCodeBlock>
                  </Collapse>
                </CardContent>
              </DarkCard>
              
              <DarkCard sx={{ marginTop: 2 }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: 1,
                    cursor: 'pointer'
                  }} onClick={() => toggleSection('posts')}>
                    {expandedSections['posts'] ? 
                      <ExpandMoreIcon sx={{ marginRight: 1 }} /> : 
                      <ChevronRightIcon sx={{ marginRight: 1 }} />}
                    <Typography variant="h6" sx={{ fontWeight: '600' }}>
                      Посты не загружаются
                    </Typography>
                  </Box>
                  
                  <Collapse in={expandedSections['posts']}>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                      Когда посты не появляются:
                    </Typography>
                    <DarkCodeBlock>
                      1. Проверьте статус сервера в Telegram\n
                      2. Подождите 2-3 минуты и обновите\n
                      3. Очистите кеш браузера\n
                      4. Попробуйте выйти и войти снова\n
                      5. Обратитесь в поддержку, если проблема продолжается
                    </DarkCodeBlock>
                  </Collapse>
                </CardContent>
              </DarkCard>
              
              <DarkCard sx={{ marginTop: 2 }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: 1,
                    cursor: 'pointer'
                  }} onClick={() => toggleSection('profile')}>
                    {expandedSections['profile'] ? 
                      <ExpandMoreIcon sx={{ marginRight: 1 }} /> : 
                      <ChevronRightIcon sx={{ marginRight: 1 }} />}
                    <Typography variant="h6" sx={{ fontWeight: '600' }}>
                      Ошибки профиля
                    </Typography>
                  </Box>
                  
                  <Collapse in={expandedSections['profile']}>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                      Проблемы с профилем:
                    </Typography>
                    <DarkCodeBlock>
                      1. Дождитесь инициализации аккаунта (до 5 минут)\n
                      2. Обновите страницу\n
                      3. Выйдите и войдите снова\n
                      4. Проверьте обновления браузера\n
                      5. Обратитесь к @AtomGlideAdmin, если не решено
                    </DarkCodeBlock>
                  </Collapse>
                </CardContent>
              </DarkCard>
            </DarkSection>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Проблемы на мобильных
              </Typography>
              
              <DarkCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    Производительность на мобильных
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Для лучшего опыта на мобильных:
                  </Typography>
                  <DarkCodeBlock>
                    1. Используйте версию для ПК, если возможно\n
                    2. Обновите браузер до последней версии\n
                    3. Включите "Версию для ПК" в настройках браузера\n
                    4. Закройте другие вкладки/приложения\n
                    5. Рассмотрите использование нашего Flutter-приложения (скоро)
                  </DarkCodeBlock>
                  <Typography variant="body2" sx={{ color: darkColors.text, marginTop: 1 }}>
                    Оптимизация для мобильных продолжается - ожидайте улучшений в будущих обновлениях.
                  </Typography>
                </CardContent>
              </DarkCard>
            </DarkSection>
          </Box>
        );
      
      case 'thanks':
        return (
          <Box>
            <DarkHeader>
              <Typography variant="h4" sx={{ fontWeight: '600' }}>
                Участники
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Люди, которые сделали AtomGlide возможным
              </Typography>
            </DarkHeader>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Основная команда
              </Typography>
              
              <Grid container spacing={2}>
                {[
                  {
                    name: "Dmitry Khorov",
                    role: "Fullstack разработчик",
                    contribution: "Архитектура платформы, основная разработка",
                  },
                  {
                    name: "Dmitry Khorov",
                    role: "Мобильный разработчик",
                    contribution: "Версия AtomGlide на Flutter",
                  },
                  {
                    name: "Александр Лукин",
                    role: "UI/UX дизайнер",
                    contribution: "Формы входа и регистрации",
                  }
                ].map((person, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <DarkCard>
                      <CardContent sx={{ textAlign: 'center' }}>
                
                        <Typography variant="h6" sx={{ fontWeight: '600' }}>
                          {person.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkColors.accent }}>
                          {person.role}
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                          {person.contribution}
                        </Typography>
                      </CardContent>
                    </DarkCard>
                  </Grid>
                ))}
              </Grid>
            </DarkSection>
            
            <DarkSection>
              <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                Особая благодарность
              </Typography>
              
              <Grid container spacing={2}>
                {[
                  {
                    name: "Егор Смирский (xxlOads)",
                    role: "Аналитика данных",
                    contribution: "Настройка сети AtomWiki"
                  },
                  {
                    name: "kinocide",
                    role: "Спонсор и менеджер сети",
                    contribution: "Инфраструктура AtomWiki"
                  },
                  {
                    name: "Участники сообщества",
                    role: "Бета-тестеры",
                    contribution: "Отзывы и отчеты об ошибках"
                  }
                ].map((person, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <DarkCard>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: '600' }}>
                          {person.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkColors.accent }}>
                          {person.role}
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                          {person.contribution}
                        </Typography>
                      </CardContent>
                    </DarkCard>
                  </Grid>
                ))}
              </Grid>
            </DarkSection>
          </Box>
        );
      
      default:
        return (
          <Box>
            <DarkHeader>
              <Typography variant="h4" sx={{ fontWeight: '600' }}>
                Документация AtomGlide
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                v7.0 - Последнее обновление 30 мая 2025
              </Typography>
            </DarkHeader>
            
            <DarkCard>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: '600', marginBottom: 2 }}>
                  Добро пожаловать в AtomGlide
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                  AtomGlide - это современная платформа, объединяющая общение, создание контента и мини-приложения в одной экосистеме.
                </Typography>
                
                <Box sx={{ 
                  backgroundColor: darkColors.card,
                  border: `1px solid ${darkColors.border}`,
                  borderRadius: '6px',
                  padding: 2,
                  marginBottom: 2
                }}>
                  <Typography variant="body2" sx={{ fontWeight: '600', marginBottom: 1 }}>
                    Быстрые ссылки
                  </Typography>
                  <Box component="ul" sx={{ margin: 0, paddingLeft: '20px' }}>
                    <li>
                      <Link href="#" onClick={() => handleSectionChange('quick-start')} sx={{ color: darkColors.accent }}>
                        Руководство по началу работы
                      </Link>
                    </li>
                    <li>
                      <Link href="#" onClick={() => handleSectionChange('features')} sx={{ color: darkColors.accent }}>
                        Последние заметки о выпуске
                      </Link>
                    </li>
                    <li>
                      <Link href="#" onClick={() => handleSectionChange('API')} sx={{ color: darkColors.accent }}>
                        Правила сообщества
                      </Link>
                    </li>
                  </Box>
                </Box>
                
                <Typography variant="body2">
                  Выберите раздел в боковой панели для просмотра документации.
                </Typography>
              </CardContent>
            </DarkCard>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        bgcolor: darkColors.background,
        minHeight: '100vh',
        color: darkColors.text
      }}>
        {/* Кнопка меню для мобильных */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            display: { xs: 'block', md: 'none' },
            color: darkColors.text
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Боковая панель навигации */}
        <Box
          component="nav"
          sx={{ 
            width: { md: 260 },
            flexShrink: { md: 0 }
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box',
                width: 260,
                bgcolor: darkColors.background,
                borderRight: `1px solid ${darkColors.border}`
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box',
                width: 260,
                bgcolor: darkColors.background,
                borderRight: `1px solid ${darkColors.border}`
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        
        {/* Основная область содержимого */}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - 260px)` },
            maxWidth: 1200,
            margin: '0 auto',
            overflowY: 'auto',
            height: '100vh'
          }}
        >
          <Box sx={{ 
            pt: { xs: 6, md: 3 },
            pb: 3
          }}>
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dock;