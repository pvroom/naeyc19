import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationConferencePage } from './evaluationconference.page';

describe('EvaluationconferencePage', () => {
  let component: EvaluationConferencePage;
  let fixture: ComponentFixture<EvaluationConferencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationConferencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationConferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
