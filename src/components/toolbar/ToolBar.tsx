import { Box, Fab, Switch, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { CustomMenu } from './CustomMenu';
import { useExtensionsContext } from '../../providers/ExtensionsContextProvider';
import { ActionType } from '../../providers/actions';
import { TABS } from '../tabs/Tabs';
import { ChromeActions, ChromeResponseMsg, StorageKey } from '../../background/background';
import { GroupTab } from '../../providers/reducers';

const SortByMenuItemValue = {
  FAVORITE: 'favorite',
  ASC: 'asc',
  STATUS: 'status'
};
const sortByMenuItems = [
  {name: 'Favorite', value: SortByMenuItemValue.FAVORITE}, 
  {name: 'A-Z', value: SortByMenuItemValue.ASC}, 
  {name: 'Status', value: SortByMenuItemValue.STATUS}
];

export const ToolBar: React.FC = () => {
  const [enableAll, setEnableAll] = React.useState(false);
  const {state, dispatch} = useExtensionsContext();

  const handleEnableAllClick = () => {
    setEnableAll(!enableAll);
  };

  const handleEditClick = () => {
    dispatch({type: ActionType.EDIT_GRP_CLICK, payload: true});

    chrome.storage.local.get(StorageKey.GROUPS)
      .then((resp) => {
        const groupToEdit: GroupTab = resp.groups && resp.groups.find((grp: GroupTab) => grp.key === state.selectedGroupTabValue);
        groupToEdit && dispatch({type: ActionType.ADD_EXTENSIONS_TO_GRP, payload: groupToEdit.extensionIds});
      });
  };

  const handleDeleteClick = () => {
    const updatedGroupTabs = state.createdGroupTabs.filter(grp => grp.key !== state.selectedGroupTabValue);
    chrome.runtime.sendMessage({action: ChromeActions.SAVE_GROUP, payload: updatedGroupTabs})
      .then(resp => {
        if (resp === ChromeResponseMsg.SUCCESS) {
          dispatch({type: ActionType.STORAGE_UPDATED_WITH_GRP, payload: state.storageUpdatedWithGroup + 1});
          dispatch({type: ActionType.EDIT_GRP_CLICK, payload: false});
          dispatch({type: ActionType.UPDATE_GRP_TAB_VALUE, payload: TABS.ALL});
        }
      });
  };

  const handleSortMenuItemClick = (value: string) => {
    
  };

  const mainItems = !state.createNewGroup && (
    <>
      <Fab color='default' aria-label='Master switch' size='small' variant='extended' onClick={handleEnableAllClick}>
        <Switch checked={enableAll} size='small' />
        <Typography variant="caption">
          Enable All
        </Typography>
      </Fab>
      <CustomMenu menuItems={sortByMenuItems} onMenuItemClick={handleSortMenuItemClick} />
      {state.selectedGroupTabValue !== TABS.ALL && (
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