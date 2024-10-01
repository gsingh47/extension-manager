import { FavoriteExtensions } from "../providers/reducers";

export const getIconUrl = (icons: chrome.management.IconInfo[] | undefined): string | undefined => {
  return (icons && icons.length) ? icons[icons.length - 1].url : undefined;
};

export const getUpdatedListWithFavExtensionsV2 = (
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
    if (extId in favoriteExts) {
      delete favoriteExts[extId];

    } else if (grpId in favoriteExts) {
      const favExts = favoriteExts[grpId];
      
      if (typeof favExts === 'object' && (extId in favExts)) {
        delete favExts[extId];
        favoriteExts[grpId] = favExts;
      }
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