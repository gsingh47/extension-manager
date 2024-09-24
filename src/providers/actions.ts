import { ExtensionIdWithFavType, ExtensionsDataType, GroupTab } from "./reducers";

export enum ActionType {
  LOAD_EXTENSIONS_DATA = 'LOAD_EXTENSIONS_DATA',
  CREATE_GRP_CLICK = 'CREATE_GRP',
  EDIT_GRP_CLICK = 'EDIT_GRP_CLICK',
  ADD_EXTENSION_TO_GRP = 'ADD_EXTENSION_TO_GRP',
  ADD_EXTENSIONS_TO_GRP = 'ADD_EXTENSIONS_TO_GRP',
  REMOVE_EXTENSION_FROM_GRP = 'REMOVE_EXTENSION_FROM_GRP',
  PROCESSING = 'PROCESSING',
  SAVE = 'SAVE',
  SEARCH = 'SEARCH',
  CHANGE_SEARCH_TYPE = 'CHANGE_SEARCH_TYPE',
  STORAGE_UPDATED_WITH_GRP = 'STORAGE_UPDATED_WITH_GRP',
  EXTENSION_UPDATED = 'EXTENSION_UPDATED',
  UPDATE_GRP_TAB_VALUE = 'UPDATE_GRP_TAB_VALUE',
  CLEAR_ADDED_EXTENSIONS = 'CLEAR_ADDED_EXTENSIONS',
  ADD_NEW_EXTS_TO_ORIGINAL_ORDER = 'ADD_NEW_EXTS_TO_ORIGINAL_ORDER'
};

export type LoadExtensionsData = {
  type: ActionType.LOAD_EXTENSIONS_DATA;
  payload: ExtensionsDataType;
};

export type CreateGroupClickAction = {
  type: ActionType.CREATE_GRP_CLICK;
  payload: boolean;
};

export type AddExtensionToGrpAction = {
  type: ActionType.ADD_EXTENSION_TO_GRP;
  payload: string;
};

export type AddExtensionsToGrpAction = {
  type: ActionType.ADD_EXTENSIONS_TO_GRP;
  payload: string[];
};

export type RemoveExtensionFromGrpAction = {
  type: ActionType.REMOVE_EXTENSION_FROM_GRP;
  payload: string[];
};

export type SaveGroup = {
  type: ActionType.SAVE;
  payload: GroupTab[];
};

export type EditGroup = {
  type: ActionType.EDIT_GRP_CLICK;
  payload: boolean;
};

export type Processing = {
  type: ActionType.PROCESSING;
  payload: boolean;
};

export type Search = {
  type: ActionType.SEARCH;
  payload?: string;
};

export type ChangeSearchType = {
  type: ActionType.CHANGE_SEARCH_TYPE;
  payload: string;
};

export type StorageUpdatedWithGroupAction = {
  type: ActionType.STORAGE_UPDATED_WITH_GRP;
  payload: number;
};

export type ExtenionUpdatedAction = {
  type: ActionType.EXTENSION_UPDATED;
  payload: number;
};

export type UpdateGroupTabValue = {
  type: ActionType.UPDATE_GRP_TAB_VALUE;
  payload: string;
};

export type ClearAddedExtensions = {
  type: ActionType.CLEAR_ADDED_EXTENSIONS;
};

export type AddNewExtensionsToOriginalOrder = {
  type: ActionType.ADD_NEW_EXTS_TO_ORIGINAL_ORDER;
  payload: ExtensionIdWithFavType[];
};

export type ExtensionActions = CreateGroupClickAction | AddExtensionToGrpAction | AddExtensionsToGrpAction | RemoveExtensionFromGrpAction | 
  SaveGroup | StorageUpdatedWithGroupAction | LoadExtensionsData | UpdateGroupTabValue | ClearAddedExtensions | Processing |
  EditGroup | Search | ChangeSearchType | ExtenionUpdatedAction | AddNewExtensionsToOriginalOrder;