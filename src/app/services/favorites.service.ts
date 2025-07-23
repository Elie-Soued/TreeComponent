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
      const filteredFavorites = favorites.filter(
        (fav) => fav.text !== node.text
      );
      this.payload.favorites.children = filteredFavorites;
      this.updateTree();
    });
  }

  enableNodeText(node: node) {
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
}
