import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProvideProfileComponent } from './edit-provide-profile.component';

describe('EditProvideProfileComponent', () => {
  let component: EditProvideProfileComponent;
  let fixture: ComponentFixture<EditProvideProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProvideProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProvideProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
