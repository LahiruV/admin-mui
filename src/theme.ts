import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007acc',
      light: '#66b5e3',
      dark: '#005a9e',
      contrastText: '#fff',
    },
    secondary: {
      main: '#3399cc',
      light: '#5bc0de',
      dark: '#2980b9',
      contrastText: '#fff',
    },
    error: {
      main: '#d9534f',
    },
    warning: {
      main: '#f0ad4e',
    },
    success: {
      main: '#5cb85c',
    },
    background: {
      default: '#f4f8fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f1f1f',
      secondary: '#6f6f6f',
    },
    divider: '#d6e0e9',
    action: {
      disabled: '#e1ecf4',
      disabledBackground: '#e1ecf4',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.35,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          minHeight: '42px',
          borderRadius: '4px',
          boxShadow: 'none',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 122, 204, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 122, 204, 0.1)',
        },
        outlined: {
          borderWidth: '1.5px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 122, 204, 0.08)',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 122, 204, 0.12)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.875rem',
          backgroundColor: '#f4f8fb',
          padding: '16px',
          borderBottom: '2px solid #d6e0e9',
        },
        body: {
          padding: '16px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            '& fieldset': {
              borderColor: '#d6e0e9',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: '#66b5e3',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007acc',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '24px',
        },
      },
    },
  },
});

export default theme;