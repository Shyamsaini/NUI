import { TestBed } from '@angular/core/testing';

import { SearchcaseService } from './searchcase.service';

describe('SearchcaseService', () => {
  let service: SearchcaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchcaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
