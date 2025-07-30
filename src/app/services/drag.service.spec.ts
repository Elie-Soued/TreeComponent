import { TestBed } from '@angular/core/testing';
import { DragService } from './drag.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DragService', () => {
  let service: DragService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DragService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
