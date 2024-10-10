import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { fabCustomCss } from '../toolbar/ToolBar';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import Switch from '@mui/material/Switch';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import StoreIcon from '@mui/icons-material/Store';

const CHROME_WEB_STORE_URL = 'https://chromewebstore.google.com/';

export const Top: React.FC = () => {
  const { mode, systemMode, setMode } = useColorScheme();
  const [colorScheme, setColorScheme] = React.useState('light');

  React.useEffect(() => {
    if (mode === 'system') {
      setColorScheme(systemMode);
    } else {
      setColorScheme(mode);
    }
  }, [mode, systemMode]);

  const openChromeStore = () => {
    chrome.tabs.create({url: CHROME_WEB_STORE_URL});
  };

  const toggleDarkMode = () => {
    const turningDark = colorScheme === 'light';
    if (turningDark) { 
      setMode('dark');
    } else {
      setMode('light');
    }
  };

  return (
    <Stack sx={{ mb: 2 }} direction={'row'} spacing={1} justifyContent={'right'}>
      <Fab color='info' aria-label='Chrome web store' size='small' variant='extended' onClick={openChromeStore}>
        <StoreIcon fontSize='small' />
      </Fab>
      <Fab sx={colorScheme === 'dark' ? fabCustomCss : {}} aria-label='Dark mode switch' size='small' variant='extended' onClick={toggleDarkMode}>
        <DarkModeIcon fontSize='small' />
        <Switch checked={colorScheme === 'dark'} size='small' />
      </Fab>
    </Stack>
  )
};