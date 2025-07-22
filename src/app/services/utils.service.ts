import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type favorite_payload } from '../types';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  buildRequestBody(payload: favorite_payload): HttpParams {
    return new HttpParams().set('ajax_req', JSON.stringify(payload));
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    });
  }
}
