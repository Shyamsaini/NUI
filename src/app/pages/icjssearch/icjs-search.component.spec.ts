import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcjsSearchComponent } from './icjs-search.component';

describe('IcjsSearchComponent', () => {
  let component: IcjsSearchComponent;
  let fixture: ComponentFixture<IcjsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IcjsSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IcjsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
