import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesbookmarksPage } from './attendeesbookmarks.page';

describe('AttendeesbookmarksPage', () => {
  let component: AttendeesbookmarksPage;
  let fixture: ComponentFixture<AttendeesbookmarksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeesbookmarksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeesbookmarksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
