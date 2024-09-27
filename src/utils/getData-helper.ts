import React from 'react';
import { ExtensionIdWithFavType } from "../providers/reducers";

export const getIconUrl = (icons: chrome.management.IconInfo[] | undefined): string | undefined => {
  return (icons && icons.length) ? icons[icons.length - 1].url : undefined;
};

export const getUpdatedListWithFavExtensions = (
  extsWithFavs: ExtensionIdWithFavType[], 
  extId: string, 
  isFavorite: boolean
): ExtensionIdWithFavType[] => {
  const indexToRemove = extsWithFavs.findIndex(ext => ext.id === extId);

  if (~indexToRemove) {
    extsWithFavs.splice(indexToRemove, 1);
    const nextAvailIndex = extsWithFavs.findIndex(ext => !ext.isFavorite);

    if (~nextAvailIndex) {
      extsWithFavs.splice(nextAvailIndex, 0, {id: extId, isFavorite});
    } else {
      extsWithFavs.push({id: extId, isFavorite});
    }
  }

  return extsWithFavs;
};

export const getFavExtsMap = (exts: ExtensionIdWithFavType[]) => {
  return new Map(exts.map(ext => [ext.id, ext.isFavorite]));
};