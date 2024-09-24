import { Box, Tab, Tabs } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import React from 'react';
import { useExtensionsContext } from '../../providers/ExtensionsContextProvider';
import { ActionType } from '../../providers/actions';
import { StorageKey } from '../../background/background';
import { SEARCH_TYPE } from '../forms/SearchForm';

export const TABS = {
  ALL: 'ALL',
  CREATE_NEW_GROUP: 'CREATE_NEW_GROUP'
};

export const GroupingTabs: React.FC = () => {
  const {state, dispatch} = useExtensionsContext();
  const { createdGroupTabs, selectedTab, searchTerm } = state;

  const isGroupSearch = state.searchType === SEARCH_TYPE.GROUP && searchTerm;
  const sudoTab = {key: TABS.ALL, name: TABS.ALL, extensionIds: []};
  const searchedGroupTab = isGroupSearch && createdGroupTabs.concat([sudoTab]).find(grp => 
    grp.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  const handleChange = (_: React.SyntheticEvent, value: any) => {
    if (value === TABS.CREATE_NEW_GROUP) {
      dispatch({type: ActionType.CREATE_GRP_CLICK, payload: true});
    } else {
      if (state.createNewGroup) {
        dispatch({type: ActionType.CREATE_GRP_CLICK, payload: false});
      }
      if(state.editGroup) {
        dispatch({type: ActionType.EDIT_GRP_CLICK, payload: false});
      }
    }
    dispatch({type: ActionType.UPDATE_GRP_TAB_VALUE, payload: value});
  };

  React.useEffect(() => {
    if (searchedGroupTab) {
      dispatch({type: ActionType.UPDATE_GRP_TAB_VALUE, payload: searchedGroupTab.key});
    }
  }, [searchedGroupTab]);

  React.useEffect(() => {
    chrome.storage.local.get(StorageKey.GROUPS)
      .then((resp) => {
        resp.groups && dispatch({type: ActionType.SAVE, payload: resp.groups});
        state.processing && dispatch({type: ActionType.PROCESSING, payload: false});
      });
  }, [state.storageUpdatedWithGroup]);

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, maxWidth: 382, bgcolor: 'background.paper' }}>
      <Tabs 
        value={!state.processing ? selectedTab : TABS.ALL} 
        onChange={handleChange} 
        aria-label="Scrollable tabs"
        variant="scrollable"
        scrollButtons
      >
        <Tab value={TABS.ALL} label="All" />
        {createdGroupTabs.map((tab) => (
          <Tab value={tab.key} key={tab.key} label={tab.name} />
        ))}
        <Tab value={TABS.CREATE_NEW_GROUP} icon={<CreateNewFolderIcon fontSize='small' />} />
      </Tabs>
    </Box>
  )
};