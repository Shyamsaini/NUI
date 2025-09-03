import { TestBed } from '@angular/core/testing';

import { ParentChildService } from './parent-child.service';

describe('ParentChildService', () => {
  let service: ParentChildService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentChildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
