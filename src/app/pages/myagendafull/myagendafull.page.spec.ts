import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyagendafullPage } from './myagendafull.page';

describe('MyagendafullPage', () => {
  let component: MyagendafullPage;
  let fixture: ComponentFixture<MyagendafullPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyagendafullPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyagendafullPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
