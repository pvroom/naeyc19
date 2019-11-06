import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavController} from '@ionic/angular';
import { Router } from '@angular/router';

import { EducationDetailsPage } from '../educationdetails/educationdetails.page';
/**
 * Generated class for the ReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewPage {

  constructor(
    public navCtrl: NavController, 
    public router: Router,
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
  }

}
