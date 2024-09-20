import Grid2 from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useExtensionsContext } from '../../providers/ExtensionsContextProvider';
import { ActionType } from '../../providers/actions';
import { TABS } from '../tabs/Tabs';

export const SEARCH_TYPE = {
  EXTENSION: 'extension',
  GROUP: 'group'
};

const debounceTime = 300;

export const SearchForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const {state, dispatch} = useExtensionsContext();

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch({type: ActionType.SEARCH, payload: event.target.value});

      if (state.searchType == SEARCH_TYPE.EXTENSION && state.selectedGroupTabValue !== TABS.ALL) {
        dispatch({type: ActionType.UPDATE_GRP_TAB_VALUE, payload: TABS.ALL});
      }
    }, debounceTime);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    dispatch({type: ActionType.CHANGE_SEARCH_TYPE, payload: event.target.value});
  };

  return (
    <Grid2 container spacing={1}>
      <Grid2 size={8}>
        <TextField 
          id="search-form" 
          label="Search" 
          variant="outlined" 
          size='small'
          value={searchTerm}
          fullWidth
          slotProps={{
            input: {
              endAdornment: <SearchIcon />
            }
          }}
          onChange={handleInputChange}
        />
      </Grid2>
      <Grid2 size={4}>
        <Select value={state.searchType} fullWidth sx={{ height: 40}} onChange={handleSelectChange}>
          <MenuItem value={SEARCH_TYPE.EXTENSION}>Extension</MenuItem>
          <MenuItem value={SEARCH_TYPE.GROUP}>Group</MenuItem>
        </Select>
      </Grid2>
    </Grid2>
  )
};