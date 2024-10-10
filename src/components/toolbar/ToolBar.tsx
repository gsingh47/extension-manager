import React from 'react';
import { useExtensionsContext } from '../../providers/ExtensionsContextProvider';
import { ActionType, ExtensionActions } from '../../providers/actions';
import { TABS } from '../tabs/Tabs';
import { ChromeActions, ChromeResponseMsg, StorageKey } from '../../background/background';
import { GroupTab, State } from '../../providers/reducers';
import { useColorScheme } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const SortByMenuItemValue = {
  FAVORITE: 'favorite',
  STATUS: 'status'
};

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

type EnableAllDefaultState = {
  enableAll: boolean;
  disabled: boolean;
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

const defaultState = (state: State): EnableAllDefaultState => {
  const { createdGroupTabs, selectedTab, extensionsData } = state;
  const extensionIds = selectedTab === TABS.ALL && extensionsData ? Object.keys(extensionsData) :
    createdGroupTabs.find(grp => grp.key === selectedTab)?.extensionIds;
  const enableAllState = {enableAll: false, disabled: false};

  if (!extensionsData || !extensionIds.length) {
    return {...enableAllState, disabled: true};
  }
  if (extensionsData) {
    const anyDisabled = extensionIds.map(extId => extensionsData[extId]?.enabled).filter(enabled => !enabled);
    return anyDisabled.length === 0 ? {...enableAllState, enableAll: true} : enableAllState;
  }  

  return enableAllState;
};

export const ToolBar: React.FC = () => {
  const {state, dispatch} = useExtensionsContext();
  const [enableAllState, setEnableAllState] = React.useState(defaultState(state));
  const [colorScheme, setColorScheme] = React.useState('light');
  const { mode, systemMode } = useColorScheme();

  React.useEffect(() => {
    if (mode === 'system') {
      setColorScheme(systemMode);
    } else {
      setColorScheme(mode);
    }
  }, [mode, systemMode]);

  React.useEffect(() => {
    setEnableAllState(defaultState(state))
  }, [state.createdGroupTabs, state.selectedTab, state.extensionsData]);

  const handleEnableAllClick = () => {
    if (state.selectedTab === TABS.ALL) {
      enableOrDisableAll(Object.keys(state.extensionsData), !enableAllState.enableAll, dispatch);

    } else {
      const currentGroup = state.createdGroupTabs.find(grp => grp.key === state.selectedTab);
      const extensionIds = currentGroup?.extensionIds;
      extensionIds && enableOrDisableAll(extensionIds, !enableAllState.enableAll, dispatch);
    }
    setEnableAllState({...enableAllState, enableAll: !enableAllState.enableAll});
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

  const mainItems = !state.createNewGroup && (
    <>
      <Fab disabled={enableAllState.disabled} sx={colorScheme === 'dark' ? fabCustomCss : {}} aria-label='Master switch' size='small' variant='extended' onClick={handleEnableAllClick}>
        <Switch checked={enableAllState.enableAll} size='small' />
        <Typography variant="caption">
          {enableAllState.enableAll ? ToolBarText.DISABLE_ALL : ToolBarText.ENABLE_ALL}
        </Typography>
      </Fab>
      {state.selectedTab !== TABS.ALL && (
        <Fab sx={colorScheme === 'dark' ? fabCustomCss : {}} aria-label='Edit' size='small' variant='extended' onClick={handleEditClick}>
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
        <Fab sx={colorScheme === 'dark' ? fabCustomCss : {}} color='default' aria-label='Delete' size='small' variant='extended' onClick={handleDeleteClick}>
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