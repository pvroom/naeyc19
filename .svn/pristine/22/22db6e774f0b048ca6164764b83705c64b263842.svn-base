import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';

import { ConversationPage } from './conversation.page';

const routes: Routes = [
  {
    path: '',
    component: ConversationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
	ConversationPage,
	RelativeTimePipe
  ],
  exports: [
	RelativeTimePipe
  ]
})
export class ConversationPageModule {}
