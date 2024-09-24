import { Box, Fab, Grid2, Stack, Switch } from '@mui/material';
import React from 'react';
import { ChromeActions, ChromeExtensionInfo, extensionToExclude, StorageKey } from '../background/background';
import { Extensions } from './Extensions';
import { ToolBar } from './toolbar/ToolBar';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import StoreIcon from '@mui/icons-material/Store';
import { GroupingTabs, TABS } from './tabs/Tabs';
import { SearchForm } from './forms/SearchForm';
import { CreateEditGroupForm } from './forms/CreateEditGroupForm';
import { useExtensionsContext } from '../providers/ExtensionsContextProvider';
import { ActionType } from '../providers/actions';
import { ExtensionIdWithFavType, ExtensionsDataType } from '../providers/reducers';

export const ExtensionsWrapper: React.FC = () => {
  const { state, dispatch } = useExtensionsContext();

  React.useEffect(() => {
    chrome.management.getAll().then(extensions => {
      if (extensions.length) {
        const mappedData: ExtensionsDataType = {};
        extensions.filter(ext => ext.id !== extensionToExclude)
          .forEach((ext: ChromeExtensionInfo) => (mappedData[ext.id] = ext));
        dispatch({type: ActionType.LOAD_EXTENSIONS_DATA, payload: mappedData});
      }
    });
  }, [state.extensionUpdated]);

  React.useEffect(() => {
    if (state.extensionsData && state.selectedTab === TABS.ALL) {
      chrome.storage.local.get(StorageKey.ORIGINAL_EXTENSIONS_ORDER)
        .then(resp => {
          const originalExtsOrder: ExtensionIdWithFavType[] = resp.originalExtensionsOrder;

          if (originalExtsOrder && originalExtsOrder.length) {
            const originalExtsOrderMap = new Map(originalExtsOrder.map(ext => [ext.id, ext.isFavorite]));
            const unMatchedExts = Object.keys(state.extensionsData!).filter(key => {
              return !originalExtsOrderMap.has(key);
            }).map(id => ({id, isFavorite: false}));
  
            if (!state.originalExtensionsOrder.length) {
              dispatch({type: ActionType.ADD_NEW_EXTS_TO_ORIGINAL_ORDER, payload: [...originalExtsOrder, ...unMatchedExts]});

            } else if (unMatchedExts) {
              const updatedList = [...originalExtsOrder, ...unMatchedExts];
              dispatch({type: ActionType.ADD_NEW_EXTS_TO_ORIGINAL_ORDER, payload: updatedList});
              chrome.runtime.sendMessage({action: ChromeActions.ADD_EXTS_TO_ORIGINAL_ORDER, paylod: updatedList});
            }
          }
        });
    }
  }, [state.extensionsData])
  
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