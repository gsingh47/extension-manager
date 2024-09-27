import { ExtensionIdWithFavType } from "../providers/reducers";

export const StorageKey = {
  EXTENSIONS: 'extensions',
  ORIGINAL_EXTENSIONS_ORDER: 'originalExtensionsOrder',
  GROUPS: 'groups'
};

export enum ChromeActions {
  SAVE_GROUP = 'SAVE_GROUP',
  EXTENSION_SWITCH_STATE_CHANGE = 'EXTENSION_SWITCH_STATE_CHANGE',
  ADD_EXTS_TO_ORIGINAL_ORDER = 'ADD_EXTS_TO_ORIGINAL_ORDER',
  ENABLE_DISABLE_ALL = 'ENABLE_DISABLE_ALL'
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

type AddExtsToOriginalOrder = {
  action: ChromeActions.ADD_EXTS_TO_ORIGINAL_ORDER;
  payload: ExtensionIdWithFavType[];
};

type Actions = SaveGroupAction | ExtensionSwitchAction | AddExtsToOriginalOrder | EnableDisableAll;

export type ChromeExtensionInfo = chrome.management.ExtensionInfo;

export const extensionToExclude = 'okldldeojendbhajegfgphmdhmfjlkka';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.management.getAll().then(extensions => {
      const originalExtensionsOrder: ExtensionIdWithFavType[] = extensions.filter(
        ext => ext.id !== extensionToExclude
      ).map(ext => ({id: ext.id, isFavorite: false}));
      chrome.storage.local.set({[StorageKey.ORIGINAL_EXTENSIONS_ORDER]: originalExtensionsOrder});
    });
  }
});

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

  } else if (action === ChromeActions.ADD_EXTS_TO_ORIGINAL_ORDER) {
    chrome.storage.local.set({[StorageKey.ORIGINAL_EXTENSIONS_ORDER]: payload});
    sendResponse(ChromeResponseMsg.SUCCESS);
  }
});

export {};
