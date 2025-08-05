/* eslint-disable @tseslint/prefer-readonly-parameter-types */
/* eslint-disable @tseslint/class-methods-use-this */
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type FavoritePayload, type Data, type SavedFavoritesResponse, type TreeNode } from '../types';
import { Observable } from 'rxjs';
import { HTTP_ENVIRONMENT_URL } from "../core/configs/http";


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http: HttpClient = inject(HttpClient);

  private BASE_URL: string = `${ HTTP_ENVIRONMENT_URL }/ogs_php/ogs_menu_webclient/index.php`;


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
    const queryParams: URLSearchParams = new URLSearchParams({
      nav: 'menu.load',
      ajax_req: JSON.stringify({
        language: "0",
        MenuUsername: "SOUEID",
        menu: "R10ALL00",
        DataBase: "OGSTCPDB",
        DataLib: "OGS01R10"
      }),
      node: 'root'
    });


    return this.http.get<Data>(`${ this.BASE_URL }?${ queryParams.toString() }`);
  }

  updateFavoritesInBackend (favorites: TreeNode[]): Observable<SavedFavoritesResponse> {
    const queryParams: URLSearchParams = new URLSearchParams({
      nav: 'menu.save'
    });

    this.payload.favorites.children = favorites;


    return this.http.post<SavedFavoritesResponse>(`${ this.BASE_URL }?${ queryParams.toString() }`, this.buildRequestBody(this.payload), {
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
