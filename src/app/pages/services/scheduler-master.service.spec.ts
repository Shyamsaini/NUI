import { TestBed } from '@angular/core/testing';

import { SchedulerMasterService } from './scheduler-master.service';

describe('SchedulerMasterService', () => {
  let service: SchedulerMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedulerMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
