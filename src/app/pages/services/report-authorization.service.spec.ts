import { TestBed } from '@angular/core/testing';

import { ReportAuthorizationService } from './report-authorization.service';

describe('ReportAuthorizationService', () => {
  let service: ReportAuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportAuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
