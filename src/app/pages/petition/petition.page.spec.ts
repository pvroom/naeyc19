import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetitionPage } from './petition.page';

describe('PetitionPage', () => {
  let component: PetitionPage;
  let fixture: ComponentFixture<PetitionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetitionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetitionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
