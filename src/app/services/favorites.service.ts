import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { type node, type favorite_payload } from '../types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { type data } from '../types';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private FAVORITE_URL: string = environment.FAVORITE_URL;
  private BASE_URL: string = environment.BASE_URL;
  private payload: favorite_payload = environment.favorite_payload;

  private FavoritePopup = new BehaviorSubject<{
    visible: boolean;
    node: node | null;
    position: { x: number; y: number };
  }>({
    visible: false,
    node: null,
    position: { x: 0, y: 0 },
  });
  private updateTreeUI = new BehaviorSubject<node[] | []>([]);
  private enableFavoriteNode = new Subject<node>();

  FavoritePopup$ = this.FavoritePopup.asObservable();
  updateTree$ = this.updateTreeUI.asObservable();
  enableFavoriteNode$ = this.enableFavoriteNode.asObservable();

  constructor(private http: HttpClient, private utils: UtilsService) {}

  addNodeToFavorites(node: node): void {
    this.getFavorites().subscribe((favorites) => {
      this.payload.favorites.children = [...favorites, node];
      this.updateTree();
    });
  }

  renameNodeInFavorites(nodeString: string, newValue: string): void {
    const node = JSON.parse(nodeString);
    this.getFavorites().subscribe((favorites) => {
      const nodeToChange = favorites.filter((fav) => fav.text === node.text)[0];
      nodeToChange.text = newValue;
      this.payload.favorites.children = favorites;
      this.updateTree();
    });
  }

  removeNodeFromFavorites(node: node): void {
    this.getFavorites().subscribe((favorites) => {
      let filteredFavorites;

      if (node.call) {
        filteredFavorites = this.removeNodeRecursively(node, favorites, 'call');
      } else {
        filteredFavorites = this.removeNodeRecursively(node, favorites, 'text');
      }

      this.payload.favorites.children = filteredFavorites;
      this.updateTree();
    });
  }

  createNewFolder(node: node, timeStamp: string, isRoot: boolean): void {
    this.getFavorites().subscribe((favorites) => {
      const newFolder = {
        text: 'neuer Ordner',
        iconCls: 'no-icon',
        call: timeStamp,
        children: [],
      };

      if (isRoot) {
        this.payload.favorites.children = [...favorites, newFolder];
      } else {
        const nodeInFavorite = this.searchNodeRecursively(node, favorites);

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
            response.children.find((el) => el.text === 'Favoriten')?.children ??
            []
        )
      );
  }

  private updateTree(): void {
    this.updateTreeUI.next(this.payload.favorites.children);

    this.http
      .post(this.FAVORITE_URL, this.utils.buildRequestBody(this.payload), {
        headers: this.utils.getHeaders(),
      })
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => console.error(error),
      });
  }

  private searchNodeRecursively(
    targetNode: node,
    favorites: node[]
  ): node | undefined {
    const foundNode = favorites.find((fav) => fav.text === targetNode.text);

    if (foundNode) {
      return foundNode;
    }

    for (const fav of favorites) {
      if (fav.children && fav.children.length > 0) {
        const nestedResult = this.searchNodeRecursively(
          targetNode,
          fav.children
        );
        if (nestedResult) {
          return nestedResult;
        }
      }
    }

    return undefined;
  }

  private removeNodeRecursively(
    targetNode: node,
    favorites: node[],
    searchBy: keyof node
  ): node[] {
    const filteredFavorites = favorites.filter(
      (fav) => fav[searchBy] !== targetNode[searchBy]
    );

    return filteredFavorites.map((fav) => {
      if (fav.children && fav.children.length > 0) {
        return {
          ...fav,
          children: this.removeNodeRecursively(
            targetNode,
            fav.children,
            searchBy
          ),
        };
      }
      return fav;
    });
  }
}
