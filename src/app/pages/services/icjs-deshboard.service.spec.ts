import { TestBed } from '@angular/core/testing';

import { IcjsDeshboardService } from './icjs-deshboard.service';

describe('IcjsDeshboardService', () => {
  let service: IcjsDeshboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IcjsDeshboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
