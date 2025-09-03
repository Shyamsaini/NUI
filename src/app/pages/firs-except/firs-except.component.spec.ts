import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirsExceptComponent } from './firs-except.component';

describe('FirsExceptComponent', () => {
  let component: FirsExceptComponent;
  let fixture: ComponentFixture<FirsExceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirsExceptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirsExceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
