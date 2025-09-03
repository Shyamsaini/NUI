import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirViewDashboardUpdateComponent } from './fir-view-dashboard-update.component';

describe('FirViewDashboardUpdateComponent', () => {
  let component: FirViewDashboardUpdateComponent;
  let fixture: ComponentFixture<FirViewDashboardUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirViewDashboardUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirViewDashboardUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
