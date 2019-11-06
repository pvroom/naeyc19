import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { LoginSamplePage } from './loginsample.page';

const routes: Routes = [
  {
    path: '',
    component: LoginSamplePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginSamplePage],
     entryComponents: [
       LoginSamplePage
     ]
})
export class LoginSamplePageModule {}

