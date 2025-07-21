import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { FavoritesService } from './favorites.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
