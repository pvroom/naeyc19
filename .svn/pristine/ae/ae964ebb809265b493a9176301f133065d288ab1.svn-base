import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar';
import { IonicModule } from '@ionic/angular';
import { ActivityFeedleaderboardPage } from './activityfeedleaderboard.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityFeedleaderboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ProgressBarComponent],
  declarations: [
	ActivityFeedleaderboardPage,
	ProgressBarComponent
  ],
  schemas: [
	CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ActivityfeedleaderboardPageModule {}
