import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyagendapersonalPage } from './myagendapersonal.page';

describe('MyagendapersonalPage', () => {
  let component: MyagendapersonalPage;
  let fixture: ComponentFixture<MyagendapersonalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyagendapersonalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyagendapersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
