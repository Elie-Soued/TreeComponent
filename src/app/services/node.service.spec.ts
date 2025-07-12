import { TestBed } from '@angular/core/testing';

import { NodeService } from './node.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NodeService', () => {
  let service: NodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NodeService);
  });

  it('getInitialData is working correctly', () => {
    // write test
  });

  it('expandMatchingNodes is working correctly', () => {
    // write test
  });

  it('isNodeMatch is working correctly', () => {
    // write test
  });
});
