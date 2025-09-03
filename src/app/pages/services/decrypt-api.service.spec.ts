import { TestBed } from '@angular/core/testing';

import { DecryptApiService } from './decrypt-api.service';

describe('DecryptApiService', () => {
  let service: DecryptApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecryptApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
