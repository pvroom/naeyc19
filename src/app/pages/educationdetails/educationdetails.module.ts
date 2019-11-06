import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicRatingModule } from 'ionic4-rating';
import { IonicModule } from '@ionic/angular';

import { EducationDetailsPage } from './educationdetails.page';



const routes: Routes = [
  {
    path: '',
    component: EducationDetailsPage
  }
];



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EducationDetailsPage]
})
export class EducationDetailsPageModule {}
