import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorplanmappingPage } from './floorplanmapping.page';

describe('FloorplanmappingPage', () => {
  let component: FloorplanmappingPage;
  let fixture: ComponentFixture<FloorplanmappingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorplanmappingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorplanmappingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
