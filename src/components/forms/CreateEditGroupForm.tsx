import React from 'react';
import Grid2 from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useExtensionsContext } from '../../providers/ExtensionsContextProvider';
import { ChromeActions, ChromeResponseMsg } from '../../background/background';
import { GroupTab } from '../../providers/reducers';
import { ActionType } from '../../providers/actions';
import { TABS } from '../tabs/Tabs';
import { v4 as uuidv4 } from 'uuid';

export const CreateGroupForm: React.FC = () => {
  const { state, dispatch } = useExtensionsContext();
  const newGroupTabNumber = state.createdGroupTabs.length + 1;
  const [groupName, setGroupName] = React.useState<string>(`Group ${newGroupTabNumber}`);

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
  };

  const handleSaveClick = () => {
    const newGroupKey = uuidv4();
    const newGroup: GroupTab = {key: newGroupKey, name: groupName, extensionIds: state.selectedExtensions};
    const newGroupsList = [...state.createdGroupTabs, newGroup];
    
    chrome.runtime.sendMessage({action: ChromeActions.SAVE_GROUP, payload: newGroupsList})
      .then(resp => {
        if (resp === ChromeResponseMsg.SUCCESS) {
          dispatch({type: ActionType.STORAGE_UPDATED_WITH_GRP});
          dispatch({type: ActionType.UPDATE_GRP_TAB_VALUE, payload: newGroupKey});
          dispatch({type: ActionType.CLEAR_ADDED_EXTENSIONS});
          dispatch({type: ActionType.PROCESSING, payload: true});
        }
      });
  };

  const handleCancelClick = () => {
    dispatch({type: ActionType.CLEAR_ADDED_EXTENSIONS});
    dispatch({type: ActionType.CREATE_GRP_CLICK, payload: false});
    dispatch({type: ActionType.UPDATE_GRP_TAB_VALUE, payload: TABS.ALL})
  };

  return (
    <Grid2 container spacing={1}>
      <Grid2 size={6}>
        <TextField
          id="create-group-form" 
          value={groupName}
          label="Group name"
          variant="outlined" 
          size='small'
          focused={state?.createNewGroup}
          onChange={handleFieldChange}
          fullWidth
        />
      </Grid2>
      <Grid2 size={3}>
        <Button fullWidth variant='contained' sx={{ height: 40 }} onClick={handleSaveClick}>Save</Button> 
      </Grid2>
      <Grid2 size={3}>
        <Button fullWidth variant='outlined' sx={{ height: 40 }} onClick={handleCancelClick}>Cancel</Button> 
      </Grid2>
    </Grid2>
  );
};

export const EditGroupForm: React.FC = () => {
  const {state, dispatch} = useExtensionsContext();
  const editIndex = state.createdGroupTabs.findIndex(grp => grp.key === state.selectedTab);

  if (editIndex < 0) {
    return null;
  }

  const groupToEdit = state.createdGroupTabs[editIndex];
  const [groupName, setGroupName] = React.useState(groupToEdit.name);

  if (!groupToEdit) {
    return null;
  }

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
  };

  const handleSaveClick = () => {
    const updatedGroupsList = state.createdGroupTabs;
    groupToEdit.extensionIds = state.selectedExtensions;
    groupToEdit.name = groupName;
    updatedGroupsList[editIndex] = groupToEdit;

    chrome.runtime.sendMessage({action: ChromeActions.SAVE_GROUP, payload: updatedGroupsList})
      .then(resp => {
        if (resp === ChromeResponseMsg.SUCCESS) {
          dispatch({type: ActionType.STORAGE_UPDATED_WITH_GRP});
          dispatch({type: ActionType.EDIT_GRP_CLICK, payload: false});
          dispatch({type: ActionType.CLEAR_ADDED_EXTENSIONS});
        }
      });
  };

  const handleCancelClick = () => {
    dispatch({type: ActionType.EDIT_GRP_CLICK, payload: false});
    dispatch({type: ActionType.CLEAR_ADDED_EXTENSIONS});
  };

  return (
    <Grid2 container spacing={1}>
      <Grid2 size={6}>
        <TextField
          id="edit-group-form" 
          value={groupName}
          label="Group name"
          variant="outlined" 
          size='small'
          onChange={handleFieldChange}
          fullWidth
        />
      </Grid2>
      <Grid2 size={3}>
        <Button fullWidth variant='contained' sx={{ height: 40 }} onClick={handleSaveClick}>Save</Button> 
      </Grid2>
      <Grid2 size={3}>
        <Button fullWidth variant='outlined' sx={{ height: 40 }} onClick={handleCancelClick}>Cancel</Button> 
      </Grid2>
    </Grid2>
  );
};

export const CreateEditGroupForm: React.FC = () => {
  const {state} = useExtensionsContext();

  return state.editGroup ? (
    <EditGroupForm />
  ) : (
    <CreateGroupForm />
  );
};