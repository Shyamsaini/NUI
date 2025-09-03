import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcjsDashboardComponent } from './icjs-dashboard.component';

describe('IcjsDashboardComponent', () => {
  let component: IcjsDashboardComponent;
  let fixture: ComponentFixture<IcjsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IcjsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IcjsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
