/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
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

  constructor(
    private http: HttpClient,
    private utils: UtilsService,
  ) {}

  addNodeToFavorites(node: node): void {
    this.getFavorites().subscribe((favorites: node[]) => {
      this.payload.favorites.children = [...favorites, node];
      this.updateTree();
    });
  }

  renameNodeInFavorites(nodeString: string, newValue: string): void {
    const node: node = JSON.parse(nodeString) as node;

    this.getFavorites().subscribe((favorites: node[]) => {
      const nodeToChange: node = favorites.filter((fav: node) => fav.text === node.text)[0];

      nodeToChange.text = newValue;
      this.payload.favorites.children = favorites;
      this.updateTree();
    });
  }

  removeNodeFromFavorites(node: node): void {
    this.getFavorites().subscribe((favorites: node[]) => {
      const filteredFavorites: node[] = node.call
        ? this.removeNodeRecursively(node, favorites, 'call')
        : this.removeNodeRecursively(node, favorites, 'text');

      this.payload.favorites.children = filteredFavorites;
      this.updateTree();
    });
  }

  createNewFolder(node: node, timeStamp: string, isRoot: boolean): void {
    this.getFavorites().subscribe((favorites: node[]) => {
      const newFolder: node = {
        text: 'neuer Ordner',
        iconCls: 'no-icon',
        call: timeStamp,
        children: [],
      };

      if (isRoot) {
        this.payload.favorites.children = [...favorites, newFolder];
      } else {
        const nodeInFavorite: node | undefined = this.searchNodeRecursively(node, favorites);

        if (nodeInFavorite) {
          nodeInFavorite.children?.push(newFolder);
          this.payload.favorites.children = favorites;
        }
      }

      this.updateTree();
    });
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

  private updateTree(): void {
    this.updateTreeUI.next(this.payload.favorites.children);
    this.http
      .post(this.FAVORITE_URL, UtilsService.buildRequestBody(this.payload), {
        headers: UtilsService.getHeaders(),
      })
      .subscribe();
  }

  private searchNodeRecursively(targetNode: node, favorites: node[]): node | undefined {
    const foundNode: node | undefined = favorites.find((fav: node) => fav.text === targetNode.text);

    if (foundNode) {
      return foundNode;
    }

    for (const fav of favorites) {
      if (fav.children && fav.children.length > 0) {
        const nestedResult: node | undefined = this.searchNodeRecursively(targetNode, fav.children);

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
