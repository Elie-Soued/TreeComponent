/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { type TreeNode, type Data } from '../types';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private treeData: BehaviorSubject<TreeNode[]> = new BehaviorSubject<TreeNode[]>([]);

  treeData$: Observable<TreeNode[]> = this.treeData.asObservable();

  private httpService: HttpService = inject(HttpService);

  loadInitialData(): Observable<TreeNode[]> {
    return this.httpService.getInitialData().pipe(
      map((response: Data) => {
        const favoriteDirectory: TreeNode | undefined = response.children.find(
          (n: TreeNode) => n.text === 'Favoriten',
        );

        if (favoriteDirectory) {
          favoriteDirectory.favorite = true;

          if (favoriteDirectory.children) {
            this.setFavoriteFlags(favoriteDirectory.children);
            this.setUniqueIDs(favoriteDirectory.children);
          }
        }

        return response.children;
      }),
      tap((data: TreeNode[]) => {
        this.treeData.next(data);
      }),
      catchError(() => of([])),
    );
  }

  getCurrentTreeData(): TreeNode[] {
    return this.treeData.value;
  }

  // Used mainly in FavoriteService
  getCurrentFavorites(): TreeNode[] {
    const data: TreeNode[] = this.getCurrentTreeData();
    const favoritesNode: TreeNode | undefined = data.find(
      (node: TreeNode) => node.text === 'Favoriten',
    );

    return favoritesNode?.children ?? [];
  }

  updateTreeData(newData: TreeNode[]): void {
    this.treeData.next(newData);
  }

  updateFavoritesInUI(newFavorites: TreeNode[]): void {
    const currentData: TreeNode[] = [...this.getCurrentTreeData()];
    const favoriteIndex: number = currentData.findIndex(
      (node: TreeNode) => node.text === 'Favoriten',
    );

    if (favoriteIndex === -1) {
      // Create new favorites directory
      currentData.push({
        text: 'Favoriten',
        children: newFavorites,
        iconCls: '',
        favorite: true,
      });
    } else {
      // Update existing favorites directory
      currentData[favoriteIndex] = {
        ...currentData[favoriteIndex],
        children: newFavorites,
      };
    }

    this.updateTreeData(currentData);
  }

  private setFavoriteFlags(nodes: TreeNode[]): void {
    nodes.forEach((node: TreeNode) => {
      node.favorite = true;

      if (node.children) {
        this.setFavoriteFlags(node.children);
      }
    });
  }

  private setUniqueIDs(nodes: TreeNode[]): void {
    nodes.forEach((node: TreeNode) => {
      node.id = crypto.randomUUID();

      if (node.children) {
        this.setUniqueIDs(node.children);
      }
    });
  }
}
