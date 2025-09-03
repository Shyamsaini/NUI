import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedleprComponent } from './medlepr.component';

describe('MedleprComponent', () => {
  let component: MedleprComponent;
  let fixture: ComponentFixture<MedleprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedleprComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedleprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
