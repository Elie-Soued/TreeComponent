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
  URL: string = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  getInitialData(): Observable<data> {
    return this.http.get<data>(this.URL);
  }

  expandMatchingNodes(
    nodes: node[],
    searchTerm: string,
    ancestors: node[] = [],
    tree: MatTree<node>
  ): void {
    for (const node of nodes) {
      // Expand match with ancestors
      if (this.isNodeMatch(node, searchTerm) && ancestors.length) {
        ancestors.forEach((ancestor) => tree.expand(ancestor));
      }

      // As long as a node has children, collect its ancestors
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

  filterNonMatchingLeafs(nodes: node[], searchTerm: string): node[] {
    return nodes
      .map((node) => {
        const children = node.children
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
      .filter((node) => node !== null);
  }

  isNodeMatch(node: node, searchValue: string | null): boolean {
    if (!searchValue) return false;
    return node.text.toLowerCase().includes(searchValue.toLowerCase());
  }
}
