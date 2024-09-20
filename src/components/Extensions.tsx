import { Card, CardContent, Grid2, CardMedia, Switch, IconButton, Avatar, CardActions, List, ListItem, ListItemButton, ListItemAvatar, ListItemText, Checkbox, ListSubheader, Typography, Box } from "@mui/material";
import ExtensionIcon from "@mui/icons-material/Extension";
import React from "react";
import { ChromeActions, ChromeExtensionInfo, ChromeResponseMsg } from "../background/background";
import { getIconUrl } from "../utils/getData-helper";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { CustomMenu } from "./toolbar/CustomMenu";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useExtensionsContext } from "../providers/ExtensionsContextProvider";
import { ActionType } from "../providers/actions";
import { TABS } from "./tabs/Tabs";
import { SEARCH_TYPE } from "./forms/SearchForm";

const resultsFoundSingularMsg = 'Found 1 matching result.';
const CardMenuItemValue = {
  UNINSTALL: 'uninstall'
};

type Props = {
  data: ChromeExtensionInfo
};

type ListViewItemProps = Props & {
  checked: boolean;
  onCheckboxClick: (value: string) => void;
};

const ListViewItem: React.FC<ListViewItemProps> = ({ data, checked, onCheckboxClick }) => {
  const [isChecked, setChecked] = React.useState(checked);
  const { id, shortName } = data;
  const icon = getIconUrl(data.icons);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked);
    onCheckboxClick(event.target.value);
  };

  return (
    <ListItem
      key={id}
      secondaryAction={
        <Checkbox
          value={id}
          edge='end'
          onChange={handleToggle}
          checked={isChecked}
        />
      }
    >
      <ListItemButton>
        <ListItemAvatar>
        <Avatar
          alt={`extension icon`}
          src={icon}
          sx={{width: 20, height: 20}}
        />
      </ListItemAvatar>
      <ListItemText id={id} primary={shortName} />
      </ListItemButton>
    </ListItem>
  );
};

export const ExtensionCard: React.FC<Props> = ({ data }) => {
  const { state, dispatch } = useExtensionsContext();
  const [enabled, setEnabled] = React.useState<boolean>(data.enabled);
  const { id, shortName } = data;
  const icon = getIconUrl(data.icons);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
    const extId = event.target.value;
    setEnabled(isChecked);

    chrome.runtime.sendMessage({
      action: ChromeActions.EXTENSION_SWITCH_STATE_CHANGE, 
      payload: {id: extId, isChecked}
    }).then(resp => {
        if (resp === ChromeResponseMsg.SUCCESS) {
          console.log('response recieved')
          dispatch({type: ActionType.EXTENSION_UPDATED, payload: state.extensionUpdated + 1});
        }
      });
  };

  const handleFavClick = () => {

  };

  const moreInfoIconButtonClick = (value: string) => {
    if (value === CardMenuItemValue.UNINSTALL) {
      chrome.management.uninstall(id)
        .then(() => {
          const updatedGrps = state.createdGroupTabs.map(grp => {
            const updatedList = grp.extensionIds.filter(extId => extId !== id);
            return {...grp, extensionIds: updatedList};
          });

          chrome.runtime.sendMessage({action: ChromeActions.SAVE_GROUP, payload: updatedGrps})
            .then(resp => {
              if (resp === ChromeResponseMsg.SUCCESS) {
                dispatch({type: ActionType.STORAGE_UPDATED_WITH_GRP, payload: state.storageUpdatedWithGroup + 1});
              }
            });
        });
    }
  };

  return (
    <Card elevation={2}>
      <CardContent sx={{ mb: 0, pb: 0 }}>
        <Grid2 container>
          <Grid2
            display={"flex"}
            justifyContent={"left"}
            alignItems={"center"}
            size={6}
          >
            {icon ? (
              <CardMedia
                component={"img"}
                sx={{ width: 20, height: 20 }}
                image={icon}
                alt={shortName}
              />
            ) : (
              <ExtensionIcon fontSize="small" color="action" />
            )}
          </Grid2>
          <Grid2
            display={"flex"}
            justifyContent={"right"}
            alignItems={"center"}
            size={6}
          >
            <Switch checked={enabled} size="small" value={id} onChange={handleChange} />
          </Grid2>
        </Grid2>
      </CardContent>
      <CardActions sx={{ mt: 0, pt: 0 }}>
        <Grid2 display='flex' justifyContent='left' alignItems='center' size={6}>
          <IconButton aria-label="favorite" color='warning' onClick={handleFavClick}>
            <StarOutlineIcon fontSize="small" />
          </IconButton>
        </Grid2>
        <Grid2 display='flex' justifyContent='right' alignItems='center' size={6}>
          <CustomMenu 
            menuItems={[{name: 'Uninstall', value: CardMenuItemValue.UNINSTALL}]} 
            iconButton={{
              icon: <MoreHorizIcon fontSize="small" />
            }}
            onMenuItemClick={moreInfoIconButtonClick}
          />
        </Grid2>
      </CardActions>
    </Card>
  );
};

const NoResultsFound: React.FC<{text: string}> = ({ text }) => {
  return (
    <Typography
      width={'100%'} 
      variant='subtitle1' 
      color='textDisabled' 
      textAlign='center'
    >
      {text}
    </Typography>
  )
};

export const Extensions: React.FC = () => {
  const { state, dispatch } = useExtensionsContext();
  const { extensionsData, searchTerm } = state;
  const preSelectedExtIds = state.createdGroupTabs.find(
    grp => grp.key === state.selectedGroupTabValue
  )?.extensionIds;

  const hanldeListViewItemClick = (value: string) => {
    dispatch({type: ActionType.ADD_EXTENSION_TO_GRP, payload: value});
  };

  if (!extensionsData) {
    return null;
  }

  const isExtensionSearch = searchTerm && state.searchType === SEARCH_TYPE.EXTENSION;
  const allExtensions = isExtensionSearch ? Object.values(extensionsData) : [];
  const filteredResults = isExtensionSearch && allExtensions.filter(ext => (
    ext.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  ));
  const searchedResultsCount = filteredResults ? filteredResults.length : 0;

  const card = (key: string, data: ChromeExtensionInfo) => data && (
    <Grid2 size={4} key={key}>
      {<ExtensionCard data={data} />}
    </Grid2>
  );

  const filteredExtensionCards = (
    filteredResults && filteredResults.map(ext => (
      card(ext.id, ext)
    ))
  );

  const allExtensionCards = (
    state.selectedGroupTabValue === TABS.ALL ? (
      state.originalExtensionsOrder.map(key => (
        card(key, extensionsData[key])
      ))
    ) : (
      state.createdGroupTabs.find((tab) => tab.key === state.selectedGroupTabValue)
        ?.extensionIds.map(extId => (
          card(extId, extensionsData[extId])
        ))
    )
  );
  
  return (state.createNewGroup || state.editGroup) ? (
    <List 
      dense
      subheader={
        <ListSubheader>
          Add extensions to the group
        </ListSubheader>
      }
      sx={{ width: '100%', maxWidth: 360 }}
    >
      {Object.keys(extensionsData).map((key, index) => (
        <ListViewItem
          checked={preSelectedExtIds?.includes(key) ?? false}
          data={extensionsData[key]}
          key={index}
          onCheckboxClick={hanldeListViewItemClick} 
        />
      ))}
    </List>
  ): (
    <Grid2 container spacing={2}>
      {filteredExtensionCards && 
        <NoResultsFound 
          text={searchedResultsCount === 1 ? resultsFoundSingularMsg: `Found ${searchedResultsCount} matching results.`} 
        />
      }
      {filteredExtensionCards ? filteredExtensionCards : allExtensionCards}
    </Grid2>
  );
};
