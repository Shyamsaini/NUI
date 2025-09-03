import { TestBed } from '@angular/core/testing';

import { CreatehierarchyService } from './createhierarchy.service';

describe('CreatehierarchyService', () => {
  let service: CreatehierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatehierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
