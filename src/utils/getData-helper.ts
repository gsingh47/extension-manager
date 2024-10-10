import { Dispatch } from "react";
import { ChromeActions, ChromeResponseMsg } from "../background/background";
import { ExtensionsDataType, FavoriteExtensions, GroupTab } from "../providers/reducers";
import { ActionType, ExtensionActions } from "../providers/actions";

export const getIconUrl = (icons: chrome.management.IconInfo[] | undefined): string | undefined => {
  return (icons && icons.length) ? icons[icons.length - 1].url : undefined;
};

export const getSortedExtsByName = (extensions: ExtensionsDataType | chrome.management.ExtensionInfo[]): string[] => {
  const extsToSort = Array.isArray(extensions) ? extensions : Object.values(extensions);
  return extsToSort.sort((a, b) => a.shortName.localeCompare(b.shortName))
    .map(ext => ext.id);
};

export const getSortedExts = (
  extsData: ExtensionsDataType | chrome.management.ExtensionInfo[],
  favorites?: FavoriteExtensions,
): string[] => {
  const extsSortedByName = getSortedExtsByName(extsData);

  if (!favorites) {
    return extsSortedByName;
  }

  const favExts = extsSortedByName.filter(extId => extId in favorites);
  const exts = extsSortedByName.filter(extId => !(extId in favorites)); 
  return [...favExts, ...exts];
};

export const getSortedGrpExts = (
  extsData: ExtensionsDataType,
  favorites: FavoriteExtensions,
  grps: GroupTab[],
  selectedGrp: string,
  dispatch: Dispatch<ExtensionActions>
): string[] | undefined => {
  if (grps.length && extsData) {
    const index = grps.findIndex(grp => grp.key === selectedGrp);

    if (~index) {
      const grp = grps[index];
      const selectGrpFilteredExts = grp.extensionIds.filter(id => id in extsData);
      const selectGrpExtsData = selectGrpFilteredExts.map(id => extsData[id]);
      const favExtsByGrp = favorites[grp.key];

      // remove unmatched extensions from grp
      if (grp.extensionIds.length !== selectGrpFilteredExts.length) {
        grp.extensionIds = selectGrpFilteredExts;
        grps[index] = grp;

        chrome.runtime.sendMessage({action: ChromeActions.SAVE_GROUP, payload: grps})
          .then(resp => resp === ChromeResponseMsg.SUCCESS && dispatch({type: ActionType.STORAGE_UPDATED_WITH_GRP}));
      }
      
      return getSortedExts(selectGrpExtsData, (typeof favExtsByGrp === 'object' ? favExtsByGrp : undefined));
    }
  }
};

export const getUpdatedListWithFavExtensions = (
  favoriteExts: FavoriteExtensions,
  extId: string, 
  isFavorite: boolean,
  grpId?: string
): FavoriteExtensions => {
  if (isFavorite) {
    if (grpId) {
      const favExts = favoriteExts[grpId];

      if (!favExts) {
        favoriteExts[grpId] = {[extId]: extId};

      } else if (typeof favExts === 'object') {
        favExts[extId] = extId;
        favoriteExts[grpId] = favExts;
      } 
    } else {
      favoriteExts[extId] = extId;
    }
  } else {
    if (grpId in favoriteExts) {
      const grpLevelFavExts = favoriteExts[grpId];
      
      if (typeof grpLevelFavExts === 'object' && (extId in grpLevelFavExts)) {
        delete grpLevelFavExts[extId];
        favoriteExts[grpId] = grpLevelFavExts;
      }
    } else if (extId in favoriteExts) {
      delete favoriteExts[extId];
    }
  }
  return favoriteExts;
};

export const isFavorite = (groupId: string, extId: string, favorites: FavoriteExtensions): boolean => {
  if (groupId in favorites) {
    const favExts = favorites[groupId];
    return typeof favExts === 'object' && extId in favExts;
  }
  return false;
};