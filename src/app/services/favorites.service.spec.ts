/* eslint-disable @tseslint/prefer-readonly-parameter-types */
/* eslint-disable @tseslint/typedef */
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { FavoritesService } from './favorites.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type node, type popup_state, type position } from '../types';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const mockNode: node = {
    text: 'Stammdatenverwaltung',
    iconCls: 'stamm.ico',
    children: [
      {
        text: 'Kundenstamm',
        call: 'R10ST00001',
        iconCls: 'prosoz_16.ico',
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FavoritesService);
  });
  it('showFavoritePopup', (done) => {
    const position: position = { x: 100, y: 200 };

    service.showFavoritePopup(mockNode, position);
    service.FavoritePopup$.subscribe((state: popup_state) => {
      expect(state.visible).toBe(true);
      expect(state.position).toBe(position);
      expect(state.node).toBe(mockNode);
      done();
    });
  });
  it('closeFavoritePopup', (done) => {
    service.closeFavoritePopup();
    service.FavoritePopup$.subscribe((state: popup_state) => {
      expect(state.visible).toBe(false);
      expect(state.position).toEqual({ x: 0, y: 0 });
      expect(state.node).toBe(null);
      done();
    });
  });
});
