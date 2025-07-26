export interface node {
  text: string;
  iconCls: string;
  children?: node[];
  favorite?: boolean;
  call?: string;
}
export interface data {
  Interface: string;
  NodeToLoad: string;
  Result: boolean;
  children: node[];
}
export interface favorite_payload {
  language: string;
  MenuUsername: string;
  menu: string;
  DataBase: string;
  DataLib: string;
  favorites: {
    text: string;
    iconCls: string;
    children: node[];
  };
}
export type actionTypes = 'addToFavorites' | 'removeFromFavorites' | 'createFolder' | 'enableInput';
export interface ContextMenuAction {
  type: actionTypes;
  node: node;
  isRoot?: boolean;
}
export interface position {
  x: number;
  y: number;
}
export interface environment_type {
  production: boolean;
  BASE_URL: string;
  FAVORITE_URL: string;
  favorite_payload: favorite_payload;
}
export interface popup_state {
  visible: boolean;
  node: node | null;
  position: position;
}
export type Change<T> = {
  currentValue: T;
  previousValue: T;
  firstChange: boolean;
  isFirstChange: () => boolean;
};
export type Changes = {
  searchValue: Change<string>;
};
