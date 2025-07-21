import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { FavoritesService } from './favorites.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FavoritesService', () => {
  let service: FavoritesService;
  const mockNode = {
    text: 'Stammdatenverwaltung',
    iconCls: 'stamm.ico',
    children: [
      {
        text: 'Kundenstamm',
        call: 'R10ST00001',
        iconCls: 'prosoz_16.ico',
        leaf: true,
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
    const position = { x: 100, y: 200 };

    service.showFavoritePopup(mockNode, position);

    service.FavoritePopup$.subscribe((state) => {
      expect(state.visible).toBe(true);
      expect(state.position).toBe(position);
      expect(state.node).toBe(mockNode);
      done();
    });
  });

  it('closeFavoritePopup', (done) => {
    service.closeFavoritePopup();

    service.FavoritePopup$.subscribe((state) => {
      expect(state.visible).toBe(false);
      expect(state.position).toEqual({ x: 0, y: 0 });
      expect(state.node).toBe(null);
      done();
    });
  });
});
