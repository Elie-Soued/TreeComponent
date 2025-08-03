/* eslint-disable @tseslint/class-methods-use-this */
/* eslint-disable @tseslint/prefer-readonly-parameter-types */

import { Injectable } from '@angular/core';
import { MatTree } from '@angular/material/tree';
import { type TreeNode } from '../types';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  expandMatchingNodes(
    nodes: TreeNode[],
    searchTerm: string,
    tree: MatTree<TreeNode>,
    ancestors: TreeNode[] | [] = [],
  ): void {
    for (const node of nodes) {
      // Expand match with ancestors
      if (this.isNodeMatch(node, searchTerm) && ancestors.length) {
        ancestors.forEach((ancestor: TreeNode) => {
          tree.expand(ancestor);
        });
      }

      // As long as a node has children, collect its ancestors
      if (node.children?.length) {
        this.expandMatchingNodes(node.children, searchTerm, tree, [...ancestors, node]);
      }
    }
  }

  filterNonMatchingLeafs(nodes: TreeNode[], searchTerm: string): TreeNode[] {
    return nodes
      .map((node: TreeNode): TreeNode | null => {
        const children: TreeNode[] = node.children
          ? this.filterNonMatchingLeafs(node.children, searchTerm)
          : [];

        if (this.isNodeMatch(node, searchTerm) || children.length) {
          return {
            ...node,
            children: children.length ? children : [],
          };
        }

        return null;
      })
      .filter((node: TreeNode | null): node is TreeNode => node !== null);
  }

  isNodeMatch(node: TreeNode, searchValue: string | null): boolean {
    if (!searchValue) return false;

    return node.text.toLowerCase().includes(searchValue.toLowerCase());
  }
}
