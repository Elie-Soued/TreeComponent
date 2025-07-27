/* eslint-disable @tseslint/no-unnecessary-condition */
/* eslint-disable @unicorn/no-useless-undefined */
/* eslint-disable no-console */
/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, switchMap, tap, catchError } from 'rxjs';
import { type node, type favorite_payload, type data, type popup_state } from '../types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private FAVORITE_URL: string = environment.FAVORITE_URL;

  private BASE_URL: string = environment.BASE_URL;

  private payload: favorite_payload = environment.favorite_payload;

  private FavoritePopup: BehaviorSubject<popup_state> = new BehaviorSubject<popup_state>({
    visible: false,
    node: null,
    position: { x: 0, y: 0 },
  });

  private updateTreeUI: BehaviorSubject<node[] | []> = new BehaviorSubject<node[] | []>([]);

  private enableFavoriteNode: Subject<node> = new Subject<node>();

  FavoritePopup$: Observable<popup_state> = this.FavoritePopup.asObservable();

  updateTree$: Observable<node[] | []> = this.updateTreeUI.asObservable();

  enableFavoriteNode$: Observable<node> = this.enableFavoriteNode.asObservable();

  constructor(private http: HttpClient) {}

  addNodeToFavorites(node: node): Observable<void> {
    return this.getFavorites().pipe(
      switchMap((favorites: node[]) => {
        this.payload.favorites.children = [...favorites, node];

        return this.updateTree();
      }),
    );
  }

  renameNodeInFavorites(nodeString: string, newValue: string): Observable<void> {
    const node: node = JSON.parse(nodeString) as node;

    return this.getFavorites().pipe(
      switchMap((favorites: node[]) => {
        // In case we would like to rename nested file/folders
        const nodeToChange: node | undefined = this.searchNodeRecursively(node, favorites, 'text');

        if (nodeToChange) {
          nodeToChange.text = newValue;
          this.payload.favorites.children = favorites;
        }

        return this.updateTree();
      }),
    );
  }

  removeNodeFromFavorites(node: node): Observable<void> {
    return this.getFavorites().pipe(
      switchMap((favorites: node[]) => {
        const filteredFavorites: node[] = node.call
          ? this.removeNodeRecursively(node, favorites, 'call')
          : this.removeNodeRecursively(node, favorites, 'text');

        this.payload.favorites.children = filteredFavorites;

        return this.updateTree();
      }),
    );
  }

  createNewFolder(parentNode: node, isRoot: boolean): Observable<void> {
    const childNode: node = {
      text: 'neuer Ordner',
      iconCls: 'no-icon',
      children: [],
    };

    return this.getFavorites().pipe(
      switchMap((favorites: node[]) => {
        if (isRoot) {
          this.payload.favorites.children = [...favorites, childNode];
        } else {
          const nodeInFavorite: node | undefined =
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

  enableNodeText(node: node): void {
    this.enableFavoriteNode.next(node);
  }

  showFavoritePopup(node: node, position: { x: number; y: number }): void {
    this.FavoritePopup.next({
      visible: true,
      node,
      position,
    });
  }

  closeFavoritePopup(): void {
    this.FavoritePopup.next({
      visible: false,
      node: null,
      position: { x: 0, y: 0 },
    });
  }

  private getFavorites(): Observable<node[]> {
    return this.http
      .get<data>(this.BASE_URL)
      .pipe(
        map(
          (response: data) =>
            response.children.find((el: node) => el.text === 'Favoriten')?.children ?? [],
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
            tap((favorites: node[]) => {
              this.updateTreeUI.next(favorites);
            }),
            map(() => undefined),
          );
        }),
      );
  }

  private searchNodeRecursively(
    targetNode: node,
    favorites: node[],
    searchBy: keyof node,
  ): node | undefined {
    const foundNode: node | undefined = favorites.find(
      (fav: node) => fav[searchBy] === targetNode[searchBy],
    );

    if (foundNode) {
      return foundNode;
    }

    for (const fav of favorites) {
      if (fav.children && fav.children.length > 0) {
        const nestedResult: node | undefined = this.searchNodeRecursively(
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

  private removeNodeRecursively(targetNode: node, favorites: node[], searchBy: keyof node): node[] {
    const filteredFavorites: node[] = favorites.filter(
      (fav: node) => fav[searchBy] !== targetNode[searchBy],
    );

    return filteredFavorites.map((fav: node) => {
      if (fav.children && fav.children.length > 0) {
        return {
          ...fav,
          children: this.removeNodeRecursively(targetNode, fav.children, searchBy),
        };
      }

      return fav;
    });
  }
}
