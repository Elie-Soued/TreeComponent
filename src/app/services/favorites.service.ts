/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { type TreeNode, type FavoritePayload, type PopupState } from '../types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UtilsService } from './utils.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private FAVORITE_URL: string = environment.FAVORITE_URL;

  private payload: FavoritePayload = environment.favorite_payload;

  private FavoritePopup: BehaviorSubject<PopupState> = new BehaviorSubject<PopupState>({
    visible: false,
    node: null,
    position: { x: 0, y: 0 },
    isLeftClick: false,
  });

  private enableFavoriteNode: Subject<TreeNode> = new Subject<TreeNode>();

  FavoritePopup$: Observable<PopupState> = this.FavoritePopup.asObservable();

  enableFavoriteNode$: Observable<TreeNode> = this.enableFavoriteNode.asObservable();

  constructor(
    private http: HttpClient,
    private dataService: DataService,
  ) {}

  addNodeToFavorites(node: TreeNode): void {
    const currentFavorites: TreeNode[] = this.dataService.getCurrentFavorites();
    const favoriteCopy: TreeNode = this.createFavoriteCopy(node);

    favoriteCopy.favorite = true;
    favoriteCopy.id = crypto.randomUUID();

    const updatedFavorites: TreeNode[] = [...currentFavorites, favoriteCopy];

    this.dataService.updateFavoritesInUI(updatedFavorites);
    this.updateFavoritesInBackend(updatedFavorites);
  }

  renameNodeInFavorites(): void {
    const currentFavorites: TreeNode[] = [...this.dataService.getCurrentFavorites()];

    this.dataService.updateFavoritesInUI(currentFavorites);
    this.updateFavoritesInBackend(currentFavorites);
  }

  removeNodeFromFavorites(node: TreeNode): void {
    const currentFavorites: TreeNode[] = this.dataService.getCurrentFavorites();
    const filteredFavorites: TreeNode[] = this.removeNodeRecursively(node, currentFavorites, 'id');

    this.dataService.updateFavoritesInUI(filteredFavorites);
    this.updateFavoritesInBackend(filteredFavorites);
  }

  createNewFolder(parentNode: TreeNode, isRoot: boolean): void {
    const childNode: TreeNode = {
      text: 'neuer Ordner',
      iconCls: 'no-icon',
      children: [],
      favorite: true,
      id: crypto.randomUUID(),
    };
    const currentFavorites: TreeNode[] = [...this.dataService.getCurrentFavorites()];

    if (isRoot) {
      currentFavorites.push(childNode);
    } else {
      const nodeInFavorite: TreeNode | undefined = this.searchNodeRecursively(
        parentNode,
        currentFavorites,
        'id',
      );

      if (nodeInFavorite) {
        nodeInFavorite.children ??= [];
        nodeInFavorite.children.push(childNode);
      }
    }

    this.dataService.updateFavoritesInUI(currentFavorites);
    this.updateFavoritesInBackend(currentFavorites);
  }

  dropNode(sourceNode: TreeNode | null, targetNodeText: string | null): void {
    if (!sourceNode || !targetNodeText) {
      return;
    }

    const currentFavorites: TreeNode[] = [...this.dataService.getCurrentFavorites()];
    // Remove the sourceNode from its current location
    const updatedFavorites: TreeNode[] = this.removeNodeRecursively(
      sourceNode,
      currentFavorites,
      'id',
    );

    // Add it to the target location
    if (targetNodeText === 'Favoriten') {
      updatedFavorites.push(sourceNode);
    } else {
      const targetNode: TreeNode | undefined = this.searchNodeRecursively(
        { text: targetNodeText } as TreeNode,
        updatedFavorites,
        'text',
      );

      if (targetNode) {
        targetNode.children ??= [];
        targetNode.children.push(sourceNode);
      }
    }

    this.dataService.updateFavoritesInUI(updatedFavorites);
    this.updateFavoritesInBackend(updatedFavorites);
  }

  enableNodeText(node: TreeNode): void {
    this.enableFavoriteNode.next(node);
  }

  showFavoritePopup(
    node: TreeNode,
    position: { x: number; y: number },
    isLeftClick: boolean,
  ): void {
    this.FavoritePopup.next({
      visible: true,
      node,
      position,
      isLeftClick,
    });
  }

  closeFavoritePopup(): void {
    this.FavoritePopup.next({
      visible: false,
      node: null,
      position: { x: 0, y: 0 },
      isLeftClick: false,
    });
  }

  private updateFavoritesInBackend(favorites: TreeNode[]): void {
    this.payload.favorites.children = favorites;
    this.http
      .post(this.FAVORITE_URL, UtilsService.buildRequestBody(this.payload), {
        headers: UtilsService.getHeaders(),
      })
      .subscribe({
        error: () => {
          this.dataService.loadInitialData().subscribe();
        },
      });
  }

  private searchNodeRecursively(
    targetNode: TreeNode,
    favorites: TreeNode[],
    searchBy: keyof TreeNode,
  ): TreeNode | undefined {
    const foundNode: TreeNode | undefined = favorites.find(
      (fav: TreeNode) => fav[searchBy] === targetNode[searchBy],
    );

    if (foundNode) {
      return foundNode;
    }

    for (const fav of favorites) {
      if (fav.children && fav.children.length > 0) {
        const nestedResult: TreeNode | undefined = this.searchNodeRecursively(
          targetNode,
          fav.children,
          searchBy,
        );

        if (nestedResult) {
          return nestedResult;
        }
      }
    }

    return undefined;
  }

  private removeNodeRecursively(
    targetNode: TreeNode,
    favorites: TreeNode[],
    searchBy: keyof TreeNode,
  ): TreeNode[] {
    const filteredFavorites: TreeNode[] = favorites.filter(
      (fav: TreeNode) => fav[searchBy] !== targetNode[searchBy],
    );

    return filteredFavorites.map((fav: TreeNode) => {
      if (fav.children && fav.children.length > 0) {
        return {
          ...fav,
          children: this.removeNodeRecursively(targetNode, fav.children, searchBy),
        };
      }

      return fav;
    });
  }

  private createFavoriteCopy(node: TreeNode): TreeNode {
    const copy: TreeNode = {
      ...node,
      favorite: true,
      children: node.children
        ? node.children.map((child: TreeNode) => this.createFavoriteCopy(child))
        : undefined,
    };

    return copy;
  }
}
