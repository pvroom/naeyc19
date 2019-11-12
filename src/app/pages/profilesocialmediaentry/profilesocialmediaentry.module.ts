import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ProfileSocialMediaEntryPage } from './profilesocialmediaentry.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileSocialMediaEntryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileSocialMediaEntryPage],
     entryComponents: [
       ProfileSocialMediaEntryPage
     ]
})
export class ProfileSocialMediaEntryPageModule {}
