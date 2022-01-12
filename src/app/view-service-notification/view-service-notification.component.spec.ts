import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiceNotificationComponent } from './view-service-notification.component';

describe('ViewServiceNotificationComponent', () => {
  let component: ViewServiceNotificationComponent;
  let fixture: ComponentFixture<ViewServiceNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewServiceNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewServiceNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
