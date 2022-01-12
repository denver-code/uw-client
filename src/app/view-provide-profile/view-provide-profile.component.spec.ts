import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProvideProfileComponent } from './view-provide-profile.component';

describe('ViewProvideProfileComponent', () => {
  let component: ViewProvideProfileComponent;
  let fixture: ComponentFixture<ViewProvideProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProvideProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProvideProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
