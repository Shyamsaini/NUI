import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedleparComponent } from './medlepar.component';

describe('MedleparComponent', () => {
  let component: MedleparComponent;
  let fixture: ComponentFixture<MedleparComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedleparComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedleparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
