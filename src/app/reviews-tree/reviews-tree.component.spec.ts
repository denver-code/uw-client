import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsTreeComponent } from './reviews-tree.component';

describe('ReviewsTreeComponent', () => {
  let component: ReviewsTreeComponent;
  let fixture: ComponentFixture<ReviewsTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewsTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
