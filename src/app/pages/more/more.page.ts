// Components, functions, plugins
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LocalstorageService } from './../../services/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-more',
  templateUrl: 'more.page.html',
  styleUrls: ['./more.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MorePage {

	constructor(public navCtrl: NavController, 
				private storage: Storage,
				private router: Router,
				private localstorage: LocalstorageService) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MorePage');
	}

  	NavToPage(PageID) {

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		switch(PageID) {
			case "Login":
				this.navCtrl.navigateForward('/login');
			case "Help":
				this.navCtrl.navigateForward('/help');
			case "Database":
				this.navCtrl.navigateForward('/database');
				break;
			case "Notes":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "Notes");
					this.navCtrl.navigateForward('/login');
				} else {
					// Otherwise just go to the page they want
					this.navCtrl.navigateForward('/notes');
				}
				break;
			case "Profile":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "Profile");
					this.navCtrl.navigateForward('/login');
				} else {
					// Otherwise just go to the page they want
					this.navCtrl.navigateForward('/profile');
				}
				break;
			case "Bookmarks":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "Bookmarks");
					this.navCtrl.navigateForward('/login');
				} else {
					// Otherwise just go to the page they want
					this.navCtrl.navigateForward('/attendeesbookmarks');
				}
				break;
			case "My Agenda":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "MyAgenda");
					this.navCtrl.navigateForward('/login');
				} else {
					// Otherwise just go to the page they want
					this.navCtrl.navigateForward('/myagenda');
				}
				break;
			case "Full Agenda":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "MyAgendaFull");
					this.navCtrl.navigateForward('/login');
				} else {
					// Otherwise just go to the page they want
					this.navCtrl.navigateForward('/myagendafull');
				}
				break;
        }

	};
	
}


