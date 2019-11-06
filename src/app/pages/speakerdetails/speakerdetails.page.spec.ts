import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerdetailsPage } from './speakerdetails.page';

describe('SpeakerdetailsPage', () => {
  let component: SpeakerdetailsPage;
  let fixture: ComponentFixture<SpeakerdetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerdetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerdetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
