/* eslint-disable @tseslint/prefer-readonly-parameter-types */
/* eslint-disable @tseslint/class-methods-use-this */
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type FavoritePayload, type Data, type SavedFavoritesResponse, type TreeNode, configType } from '../types';
import { Observable } from 'rxjs';
import { HTTP_ENVIRONMENT_URL } from "../core/configs/http";
import { config } from '../core/configs/config';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http: HttpClient = inject(HttpClient);

  private BASE_URL: string = `${ HTTP_ENVIRONMENT_URL }/ogs_php/ogs_menu_webclient/index.php`;


  getInitialData (): Observable<Data> {
    const { language, menu, DataBase, DataLib, node }: configType = config;
    const queryParams: URLSearchParams = new URLSearchParams({
      nav: 'menu.load',
      ajax_req: JSON.stringify({
        language,
        MenuUsername: "SOUEID",
        menu,
        DataBase,
        DataLib
      }),
      node
    });


    return this.http.get<Data>(`${ this.BASE_URL }?${ queryParams.toString() }`);
  }

  updateFavoritesInBackend (favorites: TreeNode[]): Observable<SavedFavoritesResponse> {
    const { language, menu, DataBase, DataLib }: configType = config;
    const queryParams: URLSearchParams = new URLSearchParams({
      nav: 'menu.save'
    });
    const payload: FavoritePayload = {
      language,
      MenuUsername: 'SOUEID',
      menu,
      DataBase,
      DataLib,
      favorites: {
        text: 'Favoriten',
        iconCls: 'no-icon',
        children: []
      }
    };

    payload.favorites.children = favorites;


    return this.http.post<SavedFavoritesResponse>(`${ this.BASE_URL }?${ queryParams.toString() }`, this.buildRequestBody(payload), {
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
