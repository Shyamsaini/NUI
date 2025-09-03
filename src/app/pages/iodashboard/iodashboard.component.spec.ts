import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IOdashboardComponent } from './iodashboard.component';

describe('IOdashboardComponent', () => {
  let component: IOdashboardComponent;
  let fixture: ComponentFixture<IOdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IOdashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IOdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
