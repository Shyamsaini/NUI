import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrationforReportAuthencationComponent } from './user-registrationfor-report-authencation.component';

describe('UserRegistrationforReportAuthencationComponent', () => {
  let component: UserRegistrationforReportAuthencationComponent;
  let fixture: ComponentFixture<UserRegistrationforReportAuthencationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRegistrationforReportAuthencationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRegistrationforReportAuthencationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
