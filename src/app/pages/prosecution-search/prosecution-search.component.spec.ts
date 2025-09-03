import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsecutionSearchComponent } from './prosecution-search.component';

describe('ProsecutionSearchComponent', () => {
  let component: ProsecutionSearchComponent;
  let fixture: ComponentFixture<ProsecutionSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProsecutionSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProsecutionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
