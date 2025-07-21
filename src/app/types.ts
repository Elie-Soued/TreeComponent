export interface node {
  text: string;
  iconCls: string;
  children?: node[];
}

export interface data {
  Interface: string;
  NodeToLoad: string;
  Result: boolean;
  children: node[];
}

export interface payload {
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
