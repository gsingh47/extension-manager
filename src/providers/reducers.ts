import { ChromeExtensionInfo } from "../background/background";
import { SEARCH_TYPE } from "../components/forms/SearchForm";
import { TABS } from "../components/tabs/Tabs";
import { SortByMenuItemValue } from "../components/toolbar/ToolBar";
import { ExtensionActions, ActionType } from "./actions";

export type ExtensionsDataType = {
  [key:string]: ChromeExtensionInfo
};

export type ExtensionIdWithFavType = {
  id: string;
  isFavorite: boolean;
};

export type GroupTab = {
  key: string;
  name: string;
  extensionIds: ExtensionIdWithFavType[];
};

export type State = {
  extensionsData?: ExtensionsDataType;
  createdGroupTabs: GroupTab[];
  selectedExtensions: string[];
  originalExtensionsOrder: ExtensionIdWithFavType[];
  createNewGroup: boolean;
  editGroup: boolean;
  processing: boolean;
  storageUpdatedWithGroup: number;
  extensionUpdated: number;
  selectedTab: string;
  searchTerm?: string;
  searchType: string;
  sortBy: string;
};

export const initState: State = {
  createdGroupTabs: [],
  selectedExtensions: [],
  originalExtensionsOrder: [],
  createNewGroup: false,
  editGroup: false,
  processing: false,
  storageUpdatedWithGroup: 0,
  extensionUpdated: 0,
  selectedTab: TABS.ALL,
  searchType: SEARCH_TYPE.EXTENSION,
  sortBy: SortByMenuItemValue.FAVORITE
};

export const extensionsReducer = (state: State, action: ExtensionActions) => {
  switch (action.type) {
    case ActionType.LOAD_EXTENSIONS_DATA: 
      return {
        ...state,
        extensionsData: action.payload
      };
    case ActionType.CREATE_GRP_CLICK:
      return {
        ...state,
        createNewGroup: action.payload
      };
    case ActionType.EDIT_GRP_CLICK:
      return {
        ...state,
        editGroup: action.payload
      };
    case ActionType.ADD_EXTENSION_TO_GRP:
      let extentions = state.selectedExtensions;
      const extensionId = action.payload;
      
      if (extentions.indexOf(extensionId) >= 0) {
        extentions = extentions.filter(extId => extId !== action.payload);
      } else {
        extentions = [...extentions, action.payload];
      }
      return {
        ...state,
        selectedExtensions: extentions
      };
    case ActionType.ADD_EXTENSIONS_TO_GRP:
      return {
        ...state,
        selectedExtensions: action.payload
      };
    case ActionType.SAVE:
      return {
        ...state,
        createdGroupTabs: action.payload,
        createNewGroup: false
      };
    case ActionType.PROCESSING: {
      return {
        ...state,
        processing: action.payload
      };
    }
    case ActionType.STORAGE_UPDATED_WITH_GRP:
      return {
        ...state,
        storageUpdatedWithGroup: action.payload
      };
    case ActionType.EXTENSION_UPDATED:
      return {
        ...state,
        extensionUpdated: action.payload
      };
    case ActionType.UPDATE_GRP_TAB_VALUE:
      return {
        ...state,
        selectedTab: action.payload
      };
    case ActionType.CLEAR_ADDED_EXTENSIONS:
      return {
        ...state,
        selectedExtensions: []
      };
    case ActionType.SEARCH:
      return {
        ...state,
        searchTerm: action.payload
      };
    case ActionType.CHANGE_SEARCH_TYPE:
      return {
        ...state,
        searchType: action.payload
      };
    case ActionType.ADD_NEW_EXTS_TO_ORIGINAL_ORDER:
      return {
        ...state,
        originalExtensionsOrder: action.payload
      };
    case ActionType.SORT_BY:
      return {
        ...state,
        sortBy: action.payload
      };
    default: 
      return state;
  }
};