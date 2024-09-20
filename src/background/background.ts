export const StorageKey = {
  EXTENSIONS: 'extensions',
  ORIGINAL_EXTENSIONS_ORDER: 'originalExtensionsOrder',
  GROUPS: 'groups'
};

export enum ChromeActions {
  SAVE_GROUP = 'SAVE_GROUP',
  EXTENSION_SWITCH_STATE_CHANGE = 'EXTENSION_SWITCH_STATE_CHANGE',
  ADD_EXTS_TO_ORIGINAL_ORDER = 'ADD_EXTS_TO_ORIGINAL_ORDER'
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

type AddExtsToOriginalOrder = {
  action: ChromeActions.ADD_EXTS_TO_ORIGINAL_ORDER;
  payload: string[];
};

type Actions = SaveGroupAction | ExtensionSwitchAction | AddExtsToOriginalOrder;

export type ChromeExtensionInfo = chrome.management.ExtensionInfo;

chrome.runtime.onInstalled.addListener((details) => {
  chrome.management.getAll().then(extensions => {
    const originalExtensionsOrder = extensions.map(ext => (ext.id));
    console.log(originalExtensionsOrder)
    chrome.storage.local.set({[StorageKey.ORIGINAL_EXTENSIONS_ORDER]: originalExtensionsOrder});
  });
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

  } else if (action === ChromeActions.ADD_EXTS_TO_ORIGINAL_ORDER) {
    chrome.storage.local.set({[StorageKey.ORIGINAL_EXTENSIONS_ORDER]: payload});
    sendResponse(ChromeResponseMsg.SUCCESS);
  }
});

export {};
