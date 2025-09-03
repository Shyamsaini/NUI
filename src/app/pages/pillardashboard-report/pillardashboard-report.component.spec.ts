import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillardashboardReportComponent } from './pillardashboard-report.component';

describe('PillardashboardReportComponent', () => {
  let component: PillardashboardReportComponent;
  let fixture: ComponentFixture<PillardashboardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PillardashboardReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PillardashboardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
