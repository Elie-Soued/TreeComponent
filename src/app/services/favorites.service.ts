/* eslint-disable @tseslint/no-unnecessary-condition */
/* eslint-disable @unicorn/no-useless-undefined */
/* eslint-disable no-console */
/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, switchMap, tap, catchError } from 'rxjs';
import { type TreeNode, type FavoritePayload, type Data, type PopupState } from '../types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private FAVORITE_URL: string = environment.FAVORITE_URL;

  private BASE_URL: string = environment.BASE_URL;

  private payload: FavoritePayload = environment.favorite_payload;

  private FavoritePopup: BehaviorSubject<PopupState> = new BehaviorSubject<PopupState>({
    visible: false,
    node: null,
    position: { x: 0, y: 0 },
    isLeftClick: false,
  });

  private updateTreeUI: BehaviorSubject<TreeNode[] | []> = new BehaviorSubject<TreeNode[] | []>([]);

  private enableFavoriteNode: Subject<TreeNode> = new Subject<TreeNode>();

  FavoritePopup$: Observable<PopupState> = this.FavoritePopup.asObservable();

  updateTree$: Observable<TreeNode[] | []> = this.updateTreeUI.asObservable();

  enableFavoriteNode$: Observable<TreeNode> = this.enableFavoriteNode.asObservable();

  constructor(private http: HttpClient) {}

  addNodeToFavorites(node: TreeNode): Observable<void> {
    return this.getFavorites().pipe(
      switchMap((favorites: TreeNode[]) => {
        const favoriteCopy: TreeNode = this.createFavoriteCopy(node);

        this.payload.favorites.children = [...favorites, favoriteCopy];

        return this.updateTree();
      }),
    );
  }

  renameNodeInFavorites(nodeString: string, newValue: string): Observable<void> {
    const node: TreeNode = JSON.parse(nodeString) as TreeNode;

    return this.getFavorites().pipe(
      switchMap((favorites: TreeNode[]) => {
        // In case we would like to rename nested file/folders
        const nodeToChange: TreeNode | undefined = this.searchNodeRecursively(
          node,
          favorites,
          'text',
        );

        if (nodeToChange) {
          nodeToChange.text = newValue;
          this.payload.favorites.children = favorites;
        }

        return this.updateTree();
      }),
    );
  }

  removeNodeFromFavorites(node: TreeNode): Observable<void> {
    return this.getFavorites().pipe(
      switchMap((favorites: TreeNode[]) => {
        const filteredFavorites: TreeNode[] = node.call
          ? this.removeNodeRecursively(node, favorites, 'call')
          : this.removeNodeRecursively(node, favorites, 'text');

        this.payload.favorites.children = filteredFavorites;

        return this.updateTree();
      }),
    );
  }

  createNewFolder(parentNode: TreeNode, isRoot: boolean): Observable<void> {
    const childNode: TreeNode = {
      text: 'neuer Ordner',
      iconCls: 'no-icon',
      children: [],
      favorite: true,
    };

    return this.getFavorites().pipe(
      switchMap((favorites: TreeNode[]) => {
        if (isRoot) {
          this.payload.favorites.children = [...favorites, childNode];
        } else {
          const nodeInFavorite: TreeNode | undefined =
            parentNode.text === 'neuer Ordner' && parentNode.call
              ? this.searchNodeRecursively(parentNode, favorites, 'call')
              : this.searchNodeRecursively(parentNode, favorites, 'text');

          if (nodeInFavorite) {
            nodeInFavorite.children ??= [];
            nodeInFavorite.children.push(childNode);
            this.payload.favorites.children = favorites;
          }
        }

        return this.updateTree();
      }),
    );
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

  dropNode(sourceNode: TreeNode | null, targetNodeText: string | null): Observable<void> {
    if (!sourceNode || !targetNodeText) {
      return this.updateTree();
    }

    return this.getFavorites().pipe(
      switchMap((favorites: TreeNode[]) => {
        const searchBy: keyof TreeNode = sourceNode.call ? 'call' : 'text';
        const updatedFavorites: TreeNode[] = this.removeNodeRecursively(
          sourceNode,
          favorites,
          searchBy,
        );

        if (targetNodeText === 'Favoriten') {
          this.payload.favorites.children = [...favorites, sourceNode];

          return this.updateTree();
        }

        const targetNode: TreeNode | undefined = this.searchNodeRecursively(
          { text: targetNodeText } as TreeNode,
          updatedFavorites,
          'text',
        );

        if (targetNode) {
          targetNode.children ??= [];
          targetNode.children.push(sourceNode);
        } else {
          console.warn(`Target node "${targetNodeText}" not found.`);
        }

        this.payload.favorites.children = updatedFavorites;

        return this.updateTree();
      }),
    );
  }

  private getFavorites(): Observable<TreeNode[]> {
    return this.http
      .get<Data>(this.BASE_URL)
      .pipe(
        map(
          (response: Data) =>
            response.children.find((el: TreeNode) => el.text === 'Favoriten')?.children ?? [],
        ),
      );
  }

  private updateTree(): Observable<void> {
    this.updateTreeUI.next(this.payload.favorites.children);

    return this.http
      .post(this.FAVORITE_URL, UtilsService.buildRequestBody(this.payload), {
        headers: UtilsService.getHeaders(),
      })
      .pipe(
        tap(() => {
          console.log('Successfully saved to backend');
        }),
        map(() => undefined),
        catchError((error: Error) => {
          console.error('Error saving to backend:', error);

          return this.getFavorites().pipe(
            tap((favorites: TreeNode[]) => {
              this.updateTreeUI.next(favorites);
            }),
            map(() => undefined),
          );
        }),
      );
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
