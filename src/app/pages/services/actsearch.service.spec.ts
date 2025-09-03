import { TestBed } from '@angular/core/testing';

import { ActsearchService } from './actsearch.service';

describe('ActsearchService', () => {
  let service: ActsearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActsearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
