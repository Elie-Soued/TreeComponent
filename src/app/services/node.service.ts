import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTree } from '@angular/material/tree';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(private http: HttpClient) {}

  getInitialData(): Observable<data> {
    return this.http.get<data>('menu.json');
  }

  expandMatchingNodes(
    nodes: node[],
    searchTerm: string,
    ancestors: node[] = [],
    tree: MatTree<node>
  ) {
    for (const node of nodes) {
      const isMatch = node.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (isMatch) {
        ancestors.forEach((ancestor) => tree.expand(ancestor));
      }

      if (node.children?.length) {
        this.expandMatchingNodes(
          node.children,
          searchTerm,
          [...ancestors, node],
          tree
        );
      }
    }
  }

  isNodeMatch(node: node, searchValue: string | null): boolean {
    if (!searchValue) return false;

    return node.text.toLowerCase().includes(searchValue.toLowerCase());
  }
}
