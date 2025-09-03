import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiLogsDashboardComponent } from './api-logs-dashboard.component';

describe('ApiLogsDashboardComponent', () => {
  let component: ApiLogsDashboardComponent;
  let fixture: ComponentFixture<ApiLogsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiLogsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApiLogsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
