import { Box, Fab, Grid2, Stack, Switch } from '@mui/material';
import React from 'react';
import { ChromeExtensionInfo, extensionToExclude, StorageKey } from '../background/background';
import { Extensions } from './Extensions';
import { ToolBar } from './toolbar/ToolBar';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import StoreIcon from '@mui/icons-material/Store';
import { GroupingTabs } from './tabs/Tabs';
import { SearchForm } from './forms/SearchForm';
import { CreateEditGroupForm } from './forms/CreateEditGroupForm';
import { useExtensionsContext } from '../providers/ExtensionsContextProvider';
import { ActionType } from '../providers/actions';
import { ExtensionsDataType, FavoriteExtensions } from '../providers/reducers';

export const ExtensionsWrapper: React.FC = () => {
  const { state, dispatch } = useExtensionsContext();

  React.useEffect(() => {
    chrome.management.getAll().then(extensions => {
      if (extensions.length) {
        const mappedData: ExtensionsDataType = {};
        const refinedExts = extensions.filter(ext => ext.id !== extensionToExclude);
        const ids = refinedExts.map(ext => ext.id);

        refinedExts.forEach((ext: ChromeExtensionInfo) => (mappedData[ext.id] = ext));
        
        dispatch({type: ActionType.EXTENSIONS_ORIGINAL_ORDER, payload: ids});
        dispatch({type: ActionType.LOAD_EXTENSIONS_DATA, payload: mappedData});
      }
    });
  }, [state.extensionUpdated]);

  React.useEffect(() => {
    chrome.storage.local.get(StorageKey.FAVORITE_EXTENSIONS)
      .then(resp => {
        const favoriteExts: FavoriteExtensions = resp.favoriteExts;
        favoriteExts && dispatch({type: ActionType.MARK_FAVORITE_EXTENSIONS, payload: favoriteExts});
      });
  }, [state.storageUpdatedWithFav]);
  
  return (
    <Box sx={{ m: 1 }} component={'section'}>
      <Stack sx={{ mb: 2 }} direction={'row'} spacing={1} justifyContent={'right'}>
        <Fab color='info' aria-label='Chrome web store' size='small' variant='extended'>
          <StoreIcon fontSize='small' />
        </Fab>
        <Fab color='default' aria-label='Dark mode switch' size='small' variant='extended'>
          <DarkModeIcon fontSize='small' />
          <Switch size='small' />
        </Fab>
      </Stack>
      {(state.createNewGroup || state.editGroup) ? (
        <CreateEditGroupForm />
      ): (
        <SearchForm />
      )}
      <GroupingTabs />
      {!state.createNewGroup && !state.searchTerm && (
        <Grid2 container spacing={2}>
          <Grid2 display={'flex'} justifyContent={'left'} alignItems={'center'} size={12}>
            <ToolBar />
          </Grid2>
        </Grid2>
      )}
      <Box sx={{ mt: 2 }}>
        <Extensions />
      </Box>
    </Box>
  );
};