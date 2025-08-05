/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { type TreeNode, ContextMenuClickDetails } from '../types';
import { DataService } from './data.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  popUp: WritableSignal<ContextMenuClickDetails> = signal({
    visible: false,
    node: null,
    position: {
      x: 0,
      y: 0
    },
    isLeftClick: null
  });

  private dataService: DataService = inject(DataService);

  private httpService: HttpService = inject(HttpService);

  addNode (node: TreeNode): void {
    const currentFavorites: TreeNode[] = this.dataService.getCurrentFavorites();
    const favoriteCopy: TreeNode = this.createFavoriteCopy(node);

    favoriteCopy.favorite = true;
    favoriteCopy.id = crypto.randomUUID();

    const updatedFavorites: TreeNode[] = [ ...currentFavorites, favoriteCopy ];

    this.dataService.updateFavoritesInUI(updatedFavorites);
    this.updateFavoritesInBackend(updatedFavorites);
  }

  renameNode (): void {
    const currentFavorites: TreeNode[] = [ ...this.dataService.getCurrentFavorites() ];

    this.dataService.updateFavoritesInUI(currentFavorites);
    this.updateFavoritesInBackend(currentFavorites);
  }

  removeNode (node: TreeNode): void {
    const currentFavorites: TreeNode[] = this.dataService.getCurrentFavorites();
    const filteredFavorites: TreeNode[] = this.removeNodeRecursively(node, currentFavorites);

    this.dataService.updateFavoritesInUI(filteredFavorites);
    this.updateFavoritesInBackend(filteredFavorites);
  }

  createNewFolder (parentNode: TreeNode, isRoot: boolean): void {
    const childNode: TreeNode = {
      text: 'neuer Ordner',
      iconCls: 'no-icon',
      children: [ {
        text: "",
        iconCls: "no-icon"
      } ],
      favorite: true,
      id: crypto.randomUUID()
    };
    const currentFavorites: TreeNode[] = [ ...this.dataService.getCurrentFavorites() ];

    if (isRoot)
      currentFavorites.push(childNode);
    else {
      const nodeInFavorite: TreeNode | undefined = this.searchNodeRecursively(
        parentNode,
        currentFavorites,
        'id'
      );

      if (nodeInFavorite) {
        nodeInFavorite.children ??= [];
        nodeInFavorite.children = nodeInFavorite.children.filter((node: TreeNode) => node.text !== "");
        nodeInFavorite.children.push(childNode);
      }
    }

    this.dataService.updateFavoritesInUI(currentFavorites);
    this.updateFavoritesInBackend(currentFavorites);
  }

  dropNode (sourceNode: TreeNode | null, targetNodeText: string | null): void {
    if (!sourceNode || !targetNodeText)
      return;


    let targetNode: TreeNode | undefined = undefined;

    const currentFavorites: TreeNode[] = [ ...this.dataService.getCurrentFavorites() ];
    // Remove the sourceNode from its current location
    const updatedFavorites: TreeNode[] = this.removeNodeRecursively(
      sourceNode,
      currentFavorites
    );

    // Add it to the target location
    if (targetNodeText === 'Favoriten')
      updatedFavorites.push(sourceNode);
    else {
      targetNode = this.searchNodeRecursively(
        { text: targetNodeText } as TreeNode,
        updatedFavorites,
        'text'
      );

      if (targetNode) {
        targetNode.children ??= [];
        targetNode.children = targetNode.children.filter((node: TreeNode) => node.text !== "");
        targetNode.children.push(sourceNode);
      }
    }

    if (targetNode && targetNode.id !== sourceNode.id || targetNodeText === 'Favoriten') {
      this.dataService.updateFavoritesInUI(updatedFavorites);
      this.updateFavoritesInBackend(updatedFavorites);
    }
  }


  private updateFavoritesInBackend (favorites: TreeNode[]): void {
    this.httpService.updateFavoritesInBackend(favorites).subscribe({
      error: () => {
        this.dataService.loadInitialData().subscribe();
      }
    });
  }

  private searchNodeRecursively (
    targetNode: TreeNode,
    favorites: TreeNode[],
    searchBy: keyof TreeNode
  ): TreeNode | undefined {
    const foundNode: TreeNode | undefined = favorites.find(
      (fav: TreeNode) => fav[ searchBy ] === targetNode[ searchBy ]
    );

    if (foundNode)
      return foundNode;


    for (const fav of favorites) {
      if (fav.children && fav.children.length > 0) {
        const nestedResult: TreeNode | undefined = this.searchNodeRecursively(
          targetNode,
          fav.children,
          searchBy
        );

        if (nestedResult)
          return nestedResult;
      }
    }

    return undefined;
  }

  private removeNodeRecursively (
    targetNode: TreeNode,
    favorites: TreeNode[]
  ): TreeNode[] {
    const filteredFavorites: TreeNode[] = favorites.filter(
      (fav: TreeNode) => fav.id !== targetNode.id
    );

    return filteredFavorites.map((fav: TreeNode) => {
      if (fav.children && fav.children.length > 0) {
        const updatedChildren: TreeNode[] = this.removeNodeRecursively(targetNode, fav.children);

        // If children array becomes empty after removal, add placeholder
        if (updatedChildren.length === 0) {
          return {
            ...fav,
            children: [ {
              text: "",
              iconCls: "no-icon"
            } ]
          };
        }

        return {
          ...fav,
          children: updatedChildren
        };
      }

      return fav;
    });
  }

  private createFavoriteCopy (node: TreeNode): TreeNode {
    const copy: TreeNode = {
      ...node,
      favorite: true,
      children: node.children
        ? node.children.map((child: TreeNode) => this.createFavoriteCopy(child))
        : undefined
    };

    return copy;
  }
}
