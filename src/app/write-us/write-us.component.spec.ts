import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteUsComponent } from './write-us.component';

describe('WriteUsComponent', () => {
  let component: WriteUsComponent;
  let fixture: ComponentFixture<WriteUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
