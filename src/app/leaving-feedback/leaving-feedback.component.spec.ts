import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavingFeedbackComponent } from './leaving-feedback.component';

describe('LeavingFeedbackComponent', () => {
  let component: LeavingFeedbackComponent;
  let fixture: ComponentFixture<LeavingFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavingFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavingFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
