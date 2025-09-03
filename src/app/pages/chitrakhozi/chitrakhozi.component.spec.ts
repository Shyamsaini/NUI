import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitrakhoziComponent } from './chitrakhozi.component';

describe('ChitrakhoziComponent', () => {
  let component: ChitrakhoziComponent;
  let fixture: ComponentFixture<ChitrakhoziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChitrakhoziComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChitrakhoziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
