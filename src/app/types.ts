export interface TreeNode {
  text: string;
  iconCls: string;
  children?: TreeNode[];
  favorite?: boolean;
  call?: string;
  id?: string;
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
export type ContextMenuActionTypes =
  | 'addToFavorites'
  | 'removeFromFavorites'
  | 'createFolder'
  | 'enableInput';
export interface ContextMenuAction {
  type: ContextMenuActionTypes;
  node: TreeNode;
  isRoot?: boolean;
}
export interface ContextMenuClickDetails {
  visible: boolean;
  node: TreeNode | null;
  position: Position;
  isLeftClick: boolean | null;
}
export interface Position {
  x: number;
  y: number;
}
export interface SavedFavoritesResponse {
  Interface: string;
  NodeToSave: string;
  Result: boolean;
}
