import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFeedCommentPage } from './activityfeedcomment.page';

describe('ActivityfeedcommentPage', () => {
  let component: ActivityFeedCommentPage;
  let fixture: ComponentFixture<ActivityFeedCommentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityFeedCommentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFeedCommentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
