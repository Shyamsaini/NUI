import { TestBed } from '@angular/core/testing';

import { FslReportServiceService } from './fsl-report-service.service';

describe('FslReportServiceService', () => {
  let service: FslReportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FslReportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
