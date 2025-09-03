import { TestBed } from '@angular/core/testing';

import { UpdateCaseStatusService } from './update-case-status.service';

describe('UpdateCaseStatusService', () => {
  let service: UpdateCaseStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateCaseStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
