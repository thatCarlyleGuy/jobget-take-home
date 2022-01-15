import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#5662b2',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#ea8981',
      dark: '#ba000d',
      contrastText: '#fff',
    },
    text: {
      primary: '#5b6775',
      secondary: '#616ba9',
    },
  },
});

export default theme;
