import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { type node, type payload } from '../types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HttpParams, HttpHeaders } from '@angular/common/http';

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

  FavoritePopup$ = this.FavoritePopup.asObservable();
  URL: string = environment.URL;
  payload: payload = environment.ajax_req;

  constructor(private http: HttpClient) {}

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

  addToFavorites(node: node) {
    this.payload.favorites.children.push(node);

    const body = new HttpParams().set('ajax_req', JSON.stringify(this.payload));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    });

    this.http.post(this.URL, body.toString(), { headers }).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error),
    });
  }
}
