import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActsearchComponent } from './actsearch.component';

describe('ActsearchComponent', () => {
  let component: ActsearchComponent;
  let fixture: ComponentFixture<ActsearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActsearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
