import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { fabCustomCss } from '../toolbar/ToolBar';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import Switch from '@mui/material/Switch';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@mui/icons-material/Home';

const CHROME_WEB_STORE_URL = 'https://chromewebstore.google.com/';
const EXTENSION_HOME_PAGE = 'https://chromewebstore.google.com/detail/extension-manager-beta/dnognfggomfnlohdpelnamgooacpaffi?authuser=1&hl=en';

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

  const openExtensionHomePage = () => {
    chrome.tabs.create({url: EXTENSION_HOME_PAGE});
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
      <Fab color='secondary' aria-label='Extension page link' size='small' variant='extended' onClick={openExtensionHomePage}>
        <HomeIcon fontSize='small' />
      </Fab>
      <Fab sx={colorScheme === 'dark' ? fabCustomCss : {}} aria-label='Dark mode switch' size='small' variant='extended' onClick={toggleDarkMode}>
        <DarkModeIcon fontSize='small' />
        <Switch checked={colorScheme === 'dark'} size='small' />
      </Fab>
    </Stack>
  )
};