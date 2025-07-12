import { Injectable } from '@angular/core';

export interface node {
  text: string;
  iconCls: string;
  children?: node[];
}

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor() {}

  expandMatchingNodes(
    nodes: node[],
    searchTerm: string,
    ancestors: node[] = [],
    tree: any
  ) {
    for (const node of nodes) {
      const isMatch = node.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (isMatch) {
        // Expand all ancestors of the matching node
        ancestors.forEach((ancestor) => tree.expand(ancestor));
      }

      if (node.children?.length) {
        // Recurse with updated ancestors
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
