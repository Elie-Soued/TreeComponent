import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { type node } from '../types';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor() {}

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
}
