import { Box, createTheme, Fab, Switch, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { CustomMenu } from './CustomMenu';
import { useExtensionsContext } from '../../providers/ExtensionsContextProvider';
import { ActionType, ExtensionActions } from '../../providers/actions';
import { TABS } from '../tabs/Tabs';
import { ChromeActions, ChromeResponseMsg, StorageKey } from '../../background/background';
import { GroupTab, State } from '../../providers/reducers';
import { useColorScheme } from '@mui/material/styles';

export const SortByMenuItemValue = {
  FAVORITE: 'favorite',
  STATUS: 'status'
};

const sortByMenuItems = [
  {name: 'Favorite', value: SortByMenuItemValue.FAVORITE},
  {name: 'Status', value: SortByMenuItemValue.STATUS}
];

const ToolBarText = {
  ENABLE_ALL: 'Enable All',
  DISABLE_ALL: 'Disable All'
};

export const fabCustomCss = { 
  backgroundColor: '#616161', 
  color: 'white', 
  '&:hover': { 
    backgroundColor: '#616161' 
  } 
};

const enableOrDisableAll = (
  ids: string[], 
  enableAll: boolean, 
  dispatch: React.Dispatch<ExtensionActions>
) => {
    chrome.runtime.sendMessage({
      action: ChromeActions.ENABLE_DISABLE_ALL, 
      payload: {ids, isChecked: enableAll}
    }).then(resp => {
        if (resp === ChromeResponseMsg.SUCCESS) {
          dispatch({type: ActionType.EXTENSION_UPDATED});
        }
      });
};

const defaultState = (state: State): boolean => {
  const { createdGroupTabs, selectedTab, extensionsData } = state;
  const extensionIds = selectedTab === TABS.ALL && extensionsData ? Object.keys(extensionsData) :
    createdGroupTabs.find(grp => grp.key === selectedTab)?.extensionIds;

  if (extensionsData && extensionIds) {
    const anyDisabled = extensionIds.map(extId => extensionsData[extId]?.enabled).filter(enabled => !enabled);
    return anyDisabled.length === 0 ? true : false;
  }  

  return false;
};

export const ToolBar: React.FC = () => {
  const {state, dispatch} = useExtensionsContext();
  const [enableAll, setEnableAll] = React.useState(defaultState(state));
  const { mode } = useColorScheme();

  React.useEffect(() => {
    setEnableAll(defaultState(state))
  }, [state.createdGroupTabs, state.selectedTab, state.extensionsData]);

  const handleEnableAllClick = () => {
    if (state.selectedTab === TABS.ALL) {
      enableOrDisableAll(Object.keys(state.extensionsData), !enableAll, dispatch);

    } else {
      const currentGroup = state.createdGroupTabs.find(grp => grp.key === state.selectedTab);
      const extensionIds = currentGroup?.extensionIds;
      extensionIds && enableOrDisableAll(extensionIds, !enableAll, dispatch);
    }
    setEnableAll(!enableAll);
  };

  const handleEditClick = () => {
    dispatch({type: ActionType.EDIT_GRP_CLICK, payload: true});

    chrome.storage.local.get(StorageKey.GROUPS)
      .then((resp) => {
        const groupToEdit: GroupTab = resp.groups && resp.groups.find((grp: GroupTab) => grp.key === state.selectedTab);
        groupToEdit && dispatch({type: ActionType.ADD_EXTENSIONS_TO_GRP, payload: groupToEdit.extensionIds.map(extId => extId)});
      });
  };

  const handleDeleteClick = () => {
    const updatedFavs = state.favoriteExts;
    delete updatedFavs[state.selectedTab];
    
    chrome.runtime.sendMessage({action: ChromeActions.MARK_FAVORITE_EXTENSIONS, payload: updatedFavs})
      .then(resp => resp === ChromeResponseMsg.SUCCESS && dispatch({type: ActionType.STORAGE_UPDATED_WITH_FAV}));

    const updatedGroupTabs = state.createdGroupTabs.filter(grp => grp.key !== state.selectedTab);
    chrome.runtime.sendMessage({action: ChromeActions.SAVE_GROUP, payload: updatedGroupTabs})
      .then(resp => {
        if (resp === ChromeResponseMsg.SUCCESS) {
          dispatch({type: ActionType.STORAGE_UPDATED_WITH_GRP});
          dispatch({type: ActionType.EDIT_GRP_CLICK, payload: false});
          dispatch({type: ActionType.UPDATE_GRP_TAB_VALUE, payload: TABS.ALL});
          dispatch({type: ActionType.CLEAR_ADDED_EXTENSIONS});
        }
      });
  };

  const handleSortMenuItemClick = (value: string) => {
    // TODO: not implemented yet
    if (state.sortBy !== value) {
      if (value === SortByMenuItemValue.STATUS) {
        
      }
    }
  };

  const mainItems = !state.createNewGroup && (
    <>
      <Fab sx={mode === 'dark' && fabCustomCss} aria-label='Master switch' size='small' variant='extended' onClick={handleEnableAllClick}>
        <Switch checked={enableAll} size='small' />
        <Typography variant="caption">
          {enableAll ? ToolBarText.DISABLE_ALL : ToolBarText.ENABLE_ALL}
        </Typography>
      </Fab>
      {/* <CustomMenu menuItems={sortByMenuItems} onMenuItemClick={handleSortMenuItemClick} /> */}
      {state.selectedTab !== TABS.ALL && (
        <Fab sx={mode === 'dark' && fabCustomCss} aria-label='Edit' size='small' variant='extended' onClick={handleEditClick}>
          <EditIcon fontSize='small' color='primary' />
          <Typography variant="caption">
            Edit
          </Typography>
        </Fab>
      )}
    </>
  );

  return (
    <Box sx={{ '& > :not(style)': { mr: 1 } }}>
      {state.editGroup ? (
        <Fab sx={mode === 'dark' && fabCustomCss} color='default' aria-label='Delete' size='small' variant='extended' onClick={handleDeleteClick}>
          <DeleteIcon fontSize='small' color='error' />
          <Typography variant="caption">
            Delete Group
          </Typography>
        </Fab>
      ): (
        mainItems
      )}
    </Box>
  );
};