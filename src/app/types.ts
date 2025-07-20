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
