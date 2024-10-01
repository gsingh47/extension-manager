import { Box, Fab, Switch, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { CustomMenu } from './CustomMenu';
import { useExtensionsContext } from '../../providers/ExtensionsContextProvider';
import { ActionType, ExtensionActions } from '../../providers/actions';
import { TABS } from '../tabs/Tabs';
import { ChromeActions, ChromeResponseMsg, StorageKey } from '../../background/background';
import { GroupTab, State } from '../../providers/reducers';

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

const enableOrDisableAll = (
  ids: string[], 
  enableAll: boolean, 
  dispatch: React.Dispatch<ExtensionActions>, 
  extensionUpdated: number
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
  const { extensionsOriginalOrder, createdGroupTabs, selectedTab, extensionsData } = state;
  const extensionIds = selectedTab === TABS.ALL ? extensionsOriginalOrder :
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

  React.useEffect(() => {
    setEnableAll(defaultState(state))
  }, [state.extensionsOriginalOrder, state.createdGroupTabs, state.selectedTab, state.extensionsData]);

  const handleEnableAllClick = () => {
    if (state.selectedTab === TABS.ALL) {
      enableOrDisableAll(state.extensionsOriginalOrder, !enableAll, dispatch, state.extensionUpdated + 1);

    } else {
      const currentGroup = state.createdGroupTabs.find(grp => grp.key === state.selectedTab);
      const extensionIds = currentGroup?.extensionIds;
      extensionIds && enableOrDisableAll(extensionIds, !enableAll, dispatch, state.extensionUpdated + 1);
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
    if (state.sortBy !== value) {
      if (value === SortByMenuItemValue.STATUS) {
        
      }
    }
  };

  const mainItems = !state.createNewGroup && (
    <>
      <Fab color='default' aria-label='Master switch' size='small' variant='extended' onClick={handleEnableAllClick}>
        <Switch checked={enableAll} size='small' />
        <Typography variant="caption">
          {enableAll ? ToolBarText.DISABLE_ALL : ToolBarText.ENABLE_ALL}
        </Typography>
      </Fab>
      <CustomMenu menuItems={sortByMenuItems} onMenuItemClick={handleSortMenuItemClick} />
      {state.selectedTab !== TABS.ALL && (
        <Fab color='default' aria-label='Edit' size='small' variant='extended' onClick={handleEditClick}>
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
        <Fab color='default' aria-label='Delete' size='small' variant='extended' onClick={handleDeleteClick}>
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