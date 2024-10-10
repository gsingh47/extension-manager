import { ExtensionsDataType, FavoriteExtensions, GroupTab } from "../providers/reducers";

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
  grp?: GroupTab
): string[] | undefined => {
  if (grp && extsData) {
    const selectGrpExtsData = grp.extensionIds.map(id => extsData[id]).filter(ext => ext);
    const favExtsByGrp = favorites[grp.key];
    
    return getSortedExts(selectGrpExtsData, (typeof favExtsByGrp === 'object' ? favExtsByGrp : undefined));
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