import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
//import { ExpandableComponent } from 'src/app/components/expandable/expandable.component';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { TextAvatarModule } from 'src/app/components/text-avatar/text-avatar.module';

const routes: Routes = [
  { path: '', component: HomePage }
];

@NgModule({
  imports: [
    CommonModule,
    TextAvatarModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage]
})
export class HomePageModule {}


