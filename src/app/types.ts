export interface TreeNode {
  text: string;
  iconCls: string;
  children?: TreeNode[];
  favorite?: boolean;
  call?: string;
}
export interface Data {
  Interface: string;
  NodeToLoad: string;
  Result: boolean;
  children: TreeNode[];
}
export interface FavoritePayload {
  language: string;
  MenuUsername: string;
  menu: string;
  DataBase: string;
  DataLib: string;
  favorites: {
    text: string;
    iconCls: string;
    children: TreeNode[];
  };
}
export type ActionTypes = 'addToFavorites' | 'removeFromFavorites' | 'createFolder' | 'enableInput';
export interface ContextMenuAction {
  type: ActionTypes;
  node: TreeNode;
  isRoot?: boolean;
}
export interface Position {
  x: number;
  y: number;
}
export interface EnvironmentType {
  production: boolean;
  BASE_URL: string;
  FAVORITE_URL: string;
  favorite_payload: FavoritePayload;
}
export interface PopupState {
  visible: boolean;
  node: TreeNode | null;
  position: Position;
  isLeftClick: boolean;
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
