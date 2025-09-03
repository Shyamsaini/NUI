import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHierarchyComponent } from './create-hierarchy.component';

describe('CreateHierarchyComponent', () => {
  let component: CreateHierarchyComponent;
  let fixture: ComponentFixture<CreateHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateHierarchyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
