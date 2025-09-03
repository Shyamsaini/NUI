import { TestBed } from '@angular/core/testing';

import { MedleprService } from './medlepr.service';

describe('MedleprService', () => {
  let service: MedleprService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedleprService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
