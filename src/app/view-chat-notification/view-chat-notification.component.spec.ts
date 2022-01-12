import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChatNotificationComponent } from './view-chat-notification.component';

describe('ViewChatNotificationComponent', () => {
  let component: ViewChatNotificationComponent;
  let fixture: ComponentFixture<ViewChatNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChatNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChatNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
