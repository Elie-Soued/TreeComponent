import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { type node, type favorite_payload } from '../types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { type data } from '../types';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private FavoritePopup = new BehaviorSubject<{
    visible: boolean;
    node: node | null;
    position: { x: number; y: number };
  }>({
    visible: false,
    node: null,
    position: { x: 0, y: 0 },
  });

  private updateTree = new BehaviorSubject<node>({
    text: '',
    iconCls: '',
    children: [],
  });

  FavoritePopup$ = this.FavoritePopup.asObservable();
  reloadTree$ = this.updateTree.asObservable();

  FAVORITE_URL: string = environment.FAVORITE_URL;
  BASE_URL: string = environment.BASE_URL;
  payload: favorite_payload = environment.favorite_payload;

  constructor(private http: HttpClient, private utils: UtilsService) {}

  addToFavorites(node: node): void {
    this.getFavorites().subscribe((favorites) => {
      this.payload.favorites.children = [...favorites, node];

      this.http
        .post(this.FAVORITE_URL, this.utils.buildRequestBody(this.payload), {
          headers: this.utils.getHeaders(),
        })
        .subscribe({
          next: (response) => console.log(response),
          error: (error) => console.error(error),
        });
    });
  }

  showFavoritePopup(node: node, position: { x: number; y: number }) {
    this.FavoritePopup.next({
      visible: true,
      node,
      position,
    });
  }

  closeFavoritePopup() {
    this.FavoritePopup.next({
      visible: false,
      node: null,
      position: { x: 0, y: 0 },
    });
  }

  getFavorites(): Observable<node[]> {
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

  addNodeToTree(node: node) {
    this.updateTree.next(node);
  }
}
