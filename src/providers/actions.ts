import { ExtensionsDataType, FavoriteExtensions, GroupTab } from "./reducers";

export enum ActionType {
  LOAD_EXTENSIONS_DATA = 'LOAD_EXTENSIONS_DATA',
  CREATE_GRP_CLICK = 'CREATE_GRP',
  EDIT_GRP_CLICK = 'EDIT_GRP_CLICK',
  ADD_EXTENSION_TO_GRP = 'ADD_EXTENSION_TO_GRP',
  ADD_EXTENSIONS_TO_GRP = 'ADD_EXTENSIONS_TO_GRP',
  PROCESSING = 'PROCESSING',
  SAVE = 'SAVE',
  SEARCH = 'SEARCH',
  CHANGE_SEARCH_TYPE = 'CHANGE_SEARCH_TYPE',
  STORAGE_UPDATED_WITH_GRP = 'STORAGE_UPDATED_WITH_GRP',
  STORAGE_UPDATED_WITH_FAV = 'STORAGE_UPDATED_WITH_FAV',
  EXTENSION_UPDATED = 'EXTENSION_UPDATED',
  UPDATE_GRP_TAB_VALUE = 'UPDATE_GRP_TAB_VALUE',
  CLEAR_ADDED_EXTENSIONS = 'CLEAR_ADDED_EXTENSIONS',
  MARK_FAVORITE_EXTENSIONS = 'FAVORITE_EXTENSIONS',
  EXTENSIONS_ORIGINAL_ORDER = 'EXTENSIONS_ORIGINAL_ORDER',
  SORT_BY = 'SORT_BY'
};

export type LoadExtensionsData = {
  type: ActionType.LOAD_EXTENSIONS_DATA;
  payload: ExtensionsDataType;
};

export type CreateGroupClickAction = {
  type: ActionType.CREATE_GRP_CLICK;
  payload: boolean;
};

export type ExtensionsOriginalOrder = {
  type: ActionType.EXTENSIONS_ORIGINAL_ORDER;
  payload: string[];
};

export type MarkFavoriteExtensions = {
  type: ActionType.MARK_FAVORITE_EXTENSIONS;
  payload: FavoriteExtensions;
};

export type AddExtensionToGrpAction = {
  type: ActionType.ADD_EXTENSION_TO_GRP;
  payload: string;
};

export type AddExtensionsToGrpAction = {
  type: ActionType.ADD_EXTENSIONS_TO_GRP;
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
};

export type StorageUpdatedWithFavorite = {
  type: ActionType.STORAGE_UPDATED_WITH_FAV;
};

export type ExtenionUpdatedAction = {
  type: ActionType.EXTENSION_UPDATED;
};

export type UpdateGroupTabValue = {
  type: ActionType.UPDATE_GRP_TAB_VALUE;
  payload: string;
};

export type ClearAddedExtensions = {
  type: ActionType.CLEAR_ADDED_EXTENSIONS;
};

export type SortBy = {
  type: ActionType.SORT_BY,
  payload: string
};

export type ExtensionActions = CreateGroupClickAction | AddExtensionToGrpAction | AddExtensionsToGrpAction | ExtensionsOriginalOrder |
  SaveGroup | StorageUpdatedWithGroupAction | LoadExtensionsData | UpdateGroupTabValue | ClearAddedExtensions | Processing |
  EditGroup | Search | ChangeSearchType | ExtenionUpdatedAction | SortBy | MarkFavoriteExtensions |
  StorageUpdatedWithFavorite;