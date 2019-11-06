import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MorePage } from './more.page';
//import { ExpandableComponent } from 'src/app/components/expandable/expandable.component';

const routes: Routes = [
  {
    path: '',
    component: MorePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    //ExpandableComponent,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MorePage]
})
export class MorePageModule {}
