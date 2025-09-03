import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalFirComponent } from './total-fir.component';

describe('TotalFirComponent', () => {
  let component: TotalFirComponent;
  let fixture: ComponentFixture<TotalFirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalFirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalFirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
