import React from "react";
import { ChromeActions, ChromeExtensionInfo, ChromeResponseMsg } from "../background/background";
import { getIconUrl, getSortedExts, getSortedGrpExts, getUpdatedListWithFavExtensions, isFavorite } from "../utils/getData-helper";
import { CustomMenu } from "./toolbar/CustomMenu";
import { useExtensionsContext } from "../providers/ExtensionsContextProvider";
import { ActionType } from "../providers/actions";
import { TABS } from "./tabs/Tabs";
import { SEARCH_TYPE } from "./forms/SearchForm";
import { FavoriteExtensions } from "../providers/reducers";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ExtensionIcon from "@mui/icons-material/Extension";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid2 from "@mui/material/Grid2";
import CardMedia from "@mui/material/CardMedia";
import Switch from "@mui/material/Switch";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";

const resultsFoundSingularMsg = 'Found 1 matching result';
const CardMenuItemValue = {
  UNINSTALL: 'UNINSTALL',
  VIEW_IN_WEB_STORE: 'VIEW_IN_WEB_STORE'
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

export const ExtensionCard: React.FC<Props & {isFav?: boolean}> = ({ data, isFav }) => {
  const { id, shortName } = data;
  const { state, dispatch } = useExtensionsContext();
  const [enabled, setEnabled] = React.useState<boolean>(data.enabled);
  const [isFavorite, setFavorite] = React.useState<boolean>(isFav)  
  const icon = getIconUrl(data.icons);

  React.useEffect(() => {
    setEnabled(data.enabled);
  }, [data.enabled])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
    const extId = event.target.value;
    setEnabled(isChecked);

    chrome.runtime.sendMessage({
      action: ChromeActions.EXTENSION_SWITCH_STATE_CHANGE, 
      payload: {id: extId, isChecked}
    }).then(resp => resp === ChromeResponseMsg.SUCCESS && dispatch({type: ActionType.EXTENSION_UPDATED}));
  };

  const handleFavClick = () => {
    let updatedFavs: FavoriteExtensions;

    if (state.selectedTab === TABS.ALL) {
      updatedFavs = getUpdatedListWithFavExtensions(state.favoriteExts, data.id, !isFavorite);
    } else {
      updatedFavs = getUpdatedListWithFavExtensions(state.favoriteExts, data.id, !isFavorite, state.selectedTab);
    }

    if (updatedFavs) {
      chrome.runtime.sendMessage({action: ChromeActions.MARK_FAVORITE_EXTENSIONS, payload: updatedFavs})
        .then(resp => resp === ChromeResponseMsg.SUCCESS && dispatch({type: ActionType.STORAGE_UPDATED_WITH_FAV}));
    }
    setFavorite(!isFavorite);
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
                dispatch({type: ActionType.STORAGE_UPDATED_WITH_GRP});
              }
            });
        });
    } else if (value === CardMenuItemValue.VIEW_IN_WEB_STORE) {
      chrome.tabs.create({url: data.homepageUrl});
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
            {isFavorite ? <StarIcon fontSize="small" /> : <StarOutlineIcon fontSize="small" />}
          </IconButton>
        </Grid2>
        <Grid2 display='flex' justifyContent='right' alignItems='center' size={6}>
          <CustomMenu 
            menuItems={[
              {name: 'View in Chrome Web Store', value: CardMenuItemValue.VIEW_IN_WEB_STORE},
              {name: 'Uninstall', value: CardMenuItemValue.UNINSTALL}
            ]}
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

const Messaging: React.FC<{text: string}> = ({ text }) => {
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
  const { extensionsData, searchTerm, favoriteExts } = state;
  const preSelectedExtIds = state.createdGroupTabs.find(
    grp => grp.key === state.selectedTab
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

  const card = (key: string, data: ChromeExtensionInfo, isFav?: boolean) => data && (
    <Grid2 size={4} key={`${key}-${isFav}`}>
      {<ExtensionCard data={data} isFav={isFav} key={key} />}
    </Grid2>
  );

  const filteredExtensionCards = (
    filteredResults && filteredResults.map(ext => (
      card(ext.id, extensionsData[ext.id], (ext.id in favoriteExts))
    ))
  );

  const allExtensionCards = (
    state.selectedTab === TABS.ALL ? (
      getSortedExts(state.extensionsData, state.favoriteExts).map(extId => (
        card(extId, extensionsData[extId], (extId in favoriteExts))
      ))
    ) : (
      getSortedGrpExts(
        state.extensionsData,
        state.favoriteExts,
        state.createdGroupTabs,
        state.selectedTab,
        dispatch
      )?.map(extId => (
        card(extId, extensionsData[extId], isFavorite(state.selectedTab, extId, favoriteExts))
      ))
    )
  );

  const finalResults = (
    allExtensionCards?.length ? (
      allExtensionCards
    ) : (
      <Messaging text="Empty" />
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
      {getSortedExts(extensionsData).map((key, index) => (
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
        <Messaging 
          text={searchedResultsCount === 1 ? resultsFoundSingularMsg: `Found ${searchedResultsCount} matching results`} 
        />
      }
      {filteredExtensionCards ? filteredExtensionCards : finalResults}
    </Grid2>
  );
};
