/* eslint-disable @tseslint/prefer-readonly-parameter-types */
/* eslint-disable @tseslint/class-methods-use-this */
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type FavoritePayload, type Data, type SavedFavoritesResponse, type TreeNode } from '../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http: HttpClient = inject(HttpClient);

  private BASE_URL: string
    = 'http://192.168.1.254/ogs_php/ogs_menu_webclient/index.php?nav=menu.load&_dc=1753169807332&ajax_req=%7B%22language%22%3A%220%22%2C%22MenuUsername%22%3A%22SOUEID%22%2C%22menu%22%3A%22R10ALL00%22%2C%22DataBase%22%3A%22OGSTCPDB%22%2C%22DataLib%22%3A%22OGS01R10%22%7D&node=root';

  private FAVORITE_URL: string
    = 'http://192.168.1.254/ogs_php/ogs_menu_webclient/index.php?nav=menu.save';

  private payload: FavoritePayload = {
    language: '0',
    MenuUsername: 'SOUEID',
    menu: 'R10ALL00',
    DataBase: 'OGSTCPDB',
    DataLib: 'OGS01R10',
    favorites: {
      text: 'Favoriten',
      iconCls: 'no-icon',
      children: []
    }
  };

  getInitialData (): Observable<Data> {
    return this.http.get<Data>(this.BASE_URL);
  }

  updateFavoritesInBackend (favorites: TreeNode[]): Observable<SavedFavoritesResponse> {
    this.payload.favorites.children = favorites;

    return this.http.post<SavedFavoritesResponse>(this.FAVORITE_URL, this.buildRequestBody(this.payload), {
      headers: this.getHeaders()
    });
  }

  private buildRequestBody (payload: FavoritePayload): HttpParams {
    return new HttpParams().set('ajax_req', JSON.stringify(payload));
  }

  private getHeaders (): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    });
  }
}
