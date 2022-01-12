import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceUserProfileComponent } from './service-user-profile.component';

describe('ServiceUserProfileComponent', () => {
  let component: ServiceUserProfileComponent;
  let fixture: ComponentFixture<ServiceUserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceUserProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
