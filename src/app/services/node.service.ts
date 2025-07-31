/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTree } from '@angular/material/tree';
import { type TreeNode } from '../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private URL: string = environment.BASE_URL;

  constructor(private http: HttpClient) {}

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
    return (
      nodes
        .map((node: TreeNode) => {
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

        // eslint-disable-next-line @tseslint/typedef
        .filter((node) => node !== null)
    );
  }

  // eslint-disable-next-line @tseslint/class-methods-use-this
  isNodeMatch(node: TreeNode, searchValue: string | null): boolean {
    if (!searchValue) return false;

    return node.text.toLowerCase().includes(searchValue.toLowerCase());
  }
}
