import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#58a6ff', // GitHub синий
    },
    secondary: {
      main: '#8957e5', // GitHub фиолетовый
    },
    background: {
      default: '#0d1117', // GitHub темный фон
      paper: '#161b22', // GitHub карточки
    },
    text: {
      primary: '#c9d1d9', // GitHub основной текст
      secondary: '#8b949e', // GitHub второстепенный текст
    },
    grey: {
      300: '#c9d1d9',
      400: '#8b949e',
      500: '#6e7681',
      600: '#484f58',
      700: '#30363d',
      800: '#21262d',
      900: '#161b22',
    },
    divider: '#30363d',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #30363d',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #30363d',
        },
      },
    },
  },
});

export default theme;