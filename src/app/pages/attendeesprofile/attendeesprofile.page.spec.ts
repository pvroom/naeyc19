import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesprofilePage } from './attendeesprofile.page';

describe('AttendeesprofilePage', () => {
  let component: AttendeesprofilePage;
  let fixture: ComponentFixture<AttendeesprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeesprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeesprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
