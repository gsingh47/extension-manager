import React from 'react';
import './App.css';
import { ExtensionsWrapper } from './components/ExtensionsWrapper';
import { ExtensionsContextProvider } from './providers/ExtensionsContextProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  colorSchemes: {
    dark: true
  }
});

const App: React.FC = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ExtensionsContextProvider>
          <ExtensionsWrapper />
        </ExtensionsContextProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
