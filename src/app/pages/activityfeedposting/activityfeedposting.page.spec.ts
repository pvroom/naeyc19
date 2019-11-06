import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityfeedpostingPage } from './activityfeedposting.page';

describe('ActivityfeedpostingPage', () => {
  let component: ActivityfeedpostingPage;
  let fixture: ComponentFixture<ActivityfeedpostingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityfeedpostingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityfeedpostingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
