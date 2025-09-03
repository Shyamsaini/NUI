import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPillarsComponent } from './other-pillars.component';

describe('OtherPillarsComponent', () => {
  let component: OtherPillarsComponent;
  let fixture: ComponentFixture<OtherPillarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtherPillarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtherPillarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
