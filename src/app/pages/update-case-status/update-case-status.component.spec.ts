import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCaseStatusComponent } from './update-case-status.component';

describe('UpdateCaseStatusComponent', () => {
  let component: UpdateCaseStatusComponent;
  let fixture: ComponentFixture<UpdateCaseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCaseStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateCaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
