import React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import StoreIcon from '@mui/icons-material/Store';
import { Fab, Stack, Switch } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { fabCustomCss } from '../toolbar/ToolBar';

const CHROME_WEB_STORE_URL = 'https://chromewebstore.google.com/';

export const Top: React.FC = () => {
  const { mode, setMode } = useColorScheme();

  const openChromeStore = () => {
    chrome.tabs.create({url: CHROME_WEB_STORE_URL});
  };

  const toggleDarkMode = () => {
    const turningDark = mode === 'light';
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
      <Fab sx={mode === 'dark' && fabCustomCss} aria-label='Dark mode switch' size='small' variant='extended' onClick={toggleDarkMode}>
        <DarkModeIcon fontSize='small' />
        <Switch checked={mode === 'dark'} size='small' />
      </Fab>
    </Stack>
  )
};