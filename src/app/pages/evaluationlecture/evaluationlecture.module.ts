import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EvaluationlecturePage } from './evaluationlecture.page';

const routes: Routes = [
  {
    path: '',
    component: EvaluationlecturePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EvaluationlecturePage]
})
export class EvaluationlecturePageModule {}
