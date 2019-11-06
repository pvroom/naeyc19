import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyagendaPage } from './myagenda.page';

describe('MyagendaPage', () => {
  let component: MyagendaPage;
  let fixture: ComponentFixture<MyagendaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyagendaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyagendaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
