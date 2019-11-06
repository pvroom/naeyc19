import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyagendapersonalPage } from './myagendapersonal.page';

const routes: Routes = [
  {
    path: '',
    component: MyagendapersonalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyagendapersonalPage]
})
export class MyagendapersonalPageModule {}
