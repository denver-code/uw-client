import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteUsProviderComponent } from './write-us-provider.component';

describe('WriteUsProviderComponent', () => {
  let component: WriteUsProviderComponent;
  let fixture: ComponentFixture<WriteUsProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteUsProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteUsProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
