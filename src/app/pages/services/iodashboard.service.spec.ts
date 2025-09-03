import { TestBed } from '@angular/core/testing';

import { IodashboardService } from './iodashboard.service';

describe('IodashboardService', () => {
  let service: IodashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IodashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
