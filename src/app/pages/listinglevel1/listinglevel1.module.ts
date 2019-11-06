import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ListingLevel1Page } from "./listinglevel1.page";

const routes: Routes = [
  {
    path: '',
    component: ListingLevel1Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListingLevel1Page]
})
export class ListingLevel1PageModule {}


