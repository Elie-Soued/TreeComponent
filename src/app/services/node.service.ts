/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTree } from '@angular/material/tree';
import { Observable } from 'rxjs';
import { type data, type node } from '../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private URL: string = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  getInitialData(): Observable<data> {
    return this.http.get<data>(this.URL);
  }

  expandMatchingNodes(
    nodes: node[],
    searchTerm: string,
    tree: MatTree<node>,
    ancestors: node[] | [] = [],
  ): void {
    for (const node of nodes) {
      // Expand match with ancestors
      if (this.isNodeMatch(node, searchTerm) && ancestors.length) {
        ancestors.forEach((ancestor: node) => {
          tree.expand(ancestor);
        });
      }

      // As long as a node has children, collect its ancestors
      if (node.children?.length) {
        this.expandMatchingNodes(node.children, searchTerm, tree, [...ancestors, node]);
      }
    }
  }

  filterNonMatchingLeafs(nodes: node[], searchTerm: string): node[] {
    return (
      nodes
        .map((node: node) => {
          const children: node[] = node.children
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
  isNodeMatch(node: node, searchValue: string | null): boolean {
    if (!searchValue) return false;

    return node.text.toLowerCase().includes(searchValue.toLowerCase());
  }

  setFavoriteFlag(nodes: node[]): node[] {
    return nodes.map((node: node) => {
      node.favorite = true;

      if (node.children && node.children.length > 0) {
        this.setFavoriteFlag(node.children);
      }

      return node;
    });
  }
}
