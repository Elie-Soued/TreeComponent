/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type favorite_payload } from '../types';

@Injectable({
  providedIn: 'root',
})
// eslint-disable-next-line @tseslint/no-extraneous-class
export class UtilsService {
  static buildRequestBody(payload: favorite_payload): HttpParams {
    return new HttpParams().set('ajax_req', JSON.stringify(payload));
  }

  static getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    });
  }

  static getTimeStamp(): string {
    const now: Date = new Date();

    return now
      .toISOString()
      .replaceAll(/[-:T.Z]/g, '')
      .slice(2, 14);
  }
}
