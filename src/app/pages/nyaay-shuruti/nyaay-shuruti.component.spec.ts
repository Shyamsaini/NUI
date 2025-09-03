import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NyaayShurutiComponent } from './nyaay-shuruti.component';

describe('NyaayShurutiComponent', () => {
  let component: NyaayShurutiComponent;
  let fixture: ComponentFixture<NyaayShurutiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NyaayShurutiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NyaayShurutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
