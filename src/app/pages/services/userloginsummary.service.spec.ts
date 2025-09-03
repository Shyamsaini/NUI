import { TestBed } from '@angular/core/testing';

import { UserloginsummaryService } from './userloginsummary.service';

describe('UserloginsummaryService', () => {
  let service: UserloginsummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserloginsummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
