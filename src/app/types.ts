export interface node {
  text: string;
  iconCls: string;
  children?: node[];
  favorite?: boolean;
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
