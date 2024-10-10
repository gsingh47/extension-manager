import React from 'react';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import { ChromeExtensionInfo, extensionsToExclude, StorageKey } from '../background/background';
import { Extensions } from './Extensions';
import { ToolBar } from './toolbar/ToolBar';
import { GroupingTabs } from './tabs/Tabs';
import { SEARCH_TYPE, SearchForm } from './forms/SearchForm';
import { CreateEditGroupForm } from './forms/CreateEditGroupForm';
import { useExtensionsContext } from '../providers/ExtensionsContextProvider';
import { ActionType } from '../providers/actions';
import { ExtensionsDataType, FavoriteExtensions } from '../providers/reducers';
import { Top } from './top/Top';

export const ExtensionsWrapper: React.FC = () => {
  const { state, dispatch } = useExtensionsContext();

  React.useEffect(() => {
    chrome.management.getAll().then(extensions => {
      if (extensions.length) {
        const mappedData: ExtensionsDataType = {};
        const refinedExts = extensions.filter(ext => (ext.type === 'extension' && !(ext.id in extensionsToExclude)));

        refinedExts.forEach((ext: ChromeExtensionInfo) => (mappedData[ext.id] = ext));
        
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
      <Top />
      {(state.createNewGroup || state.editGroup) ? (
        <CreateEditGroupForm />
      ): (
        <SearchForm />
      )}
      <GroupingTabs />
      {!state.createNewGroup && (!state.searchTerm || (state.searchTerm && state.searchType === SEARCH_TYPE.GROUP)) && (
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