import { FavoriteExtensions } from "../providers/reducers";

export const StorageKey = {
  EXTENSIONS: 'extensions',
  ORIGINAL_EXTENSIONS_ORDER: 'originalExtensionsOrder',
  GROUPS: 'groups',
  FAVORITE_EXTENSIONS: 'favoriteExts'
};

export enum ChromeActions {
  SAVE_GROUP = 'SAVE_GROUP',
  EXTENSION_SWITCH_STATE_CHANGE = 'EXTENSION_SWITCH_STATE_CHANGE',
  ENABLE_DISABLE_ALL = 'ENABLE_DISABLE_ALL',
  MARK_FAVORITE_EXTENSIONS = 'MARK_FAVORITE_EXTENSIONS'
};

export enum ChromeResponseMsg {
  SUCCESS = 'SUCCESS'
};

type SaveGroupAction = {
  action: ChromeActions.SAVE_GROUP;
  payload: string;
};

type ExtensionSwitchAction = {
  action: ChromeActions.EXTENSION_SWITCH_STATE_CHANGE;
  payload: {
    id: string,
    isChecked: boolean
  };
};

type EnableDisableAll = {
  action: ChromeActions.ENABLE_DISABLE_ALL;
  payload: {
    ids: string[],
    isChecked: boolean
  };
};

type MarkFavoriteExtensions = {
  action: ChromeActions.MARK_FAVORITE_EXTENSIONS,
  payload: FavoriteExtensions
};

type Actions = SaveGroupAction | ExtensionSwitchAction | EnableDisableAll | MarkFavoriteExtensions;

export type ChromeExtensionInfo = chrome.management.ExtensionInfo;

export const extensionsToExclude = {
  'okldldeojendbhajegfgphmdhmfjlkka': true, // test
  'dnognfggomfnlohdpelnamgooacpaffi': true // prod
};

chrome.runtime.onMessage.addListener((msg: Actions, _, sendResponse) => {
  const { action, payload } = msg;

  if (action === ChromeActions.SAVE_GROUP) {
    chrome.storage.local.set({[StorageKey.GROUPS]: payload});
    sendResponse(ChromeResponseMsg.SUCCESS);

  } else if (action === ChromeActions.EXTENSION_SWITCH_STATE_CHANGE) {
    const { id, isChecked } = payload;
    chrome.management.setEnabled(id, isChecked);
    sendResponse(ChromeResponseMsg.SUCCESS);

  } else if (action === ChromeActions.ENABLE_DISABLE_ALL)  {
    const { ids, isChecked } = payload;
    ids.forEach(id => chrome.management.setEnabled(id, isChecked));
    sendResponse(ChromeResponseMsg.SUCCESS);

  } else if (action === ChromeActions.MARK_FAVORITE_EXTENSIONS) {
    chrome.storage.local.set({[StorageKey.FAVORITE_EXTENSIONS]: payload});
    sendResponse(ChromeResponseMsg.SUCCESS);
  }
});

export {};
