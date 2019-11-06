// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { LocalstorageService } from './../../services/localstorage.service';
import { DatabaseService } from './../../services/database.service';
//import { normalizeURL } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
//import {WebView} from '@ionic-native/ionic-webview/ngx';
import { Router } from '@angular/router';

// Preload Pages
//import { LoginPage } from '../../pages/login/login.page';
//import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage {

	// Attendee Avatar
	public visualImageURL: string;
	public avatarDevice: boolean;
	public avatarBrowser: boolean;
	
	// Attendee ProfilePage
	public prAttendeeName: string;
	public prAttendeeTitle: string;
	public prAttendeeOrganization: string;
	
	// Social Media icons
	public statusTwitter: string;
	public statusFacebook: string;
	public statusLinkedIn: string;
	public statusInstagram: string;
	public statusPinterest: string;
	//modalController: any;
	//modal: any;
	
	constructor(public navCtrl: NavController, 
				private databaseprovider: DatabaseService,
				public loadingCtrl: LoadingController,
				private alertCtrl: AlertController,
				private modalCtrl: ModalController,
				//private modalpage: ModalPage,
				private router: Router,
				public _DomSanitizer: DomSanitizer,
				private cd: ChangeDetectorRef,
				private localstorage: LocalstorageService) {
	}


	ionViewDidEnter() {
		console.log('ionViewDidEnter ProfilePage');
		this.cd.markForCheck();
	}
  

	//async presentModal() {
	//	const modal = await this.modalCtrl.create({
	//		component: ModalPage
	//	});
	//	return await modal.present();
	//}


	ngOnInit() {

		console.log('ProfilePage: ngOnInit');
		// Get AttendeeID
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
		
		if (DevicePlatform!='Browser') {
			console.log('Set avatar to device');
			this.avatarDevice = true;
			this.avatarBrowser = false;
		} else {
			console.log('Set avatar to browser');
			this.avatarDevice = false;
			this.avatarBrowser = true;
		}
				
		// Get profile image if available
		let rand = Math.floor(Math.random()*20)+1;		// Prevents server caching of the image
		this.visualImageURL = "https://naeyc.convergence-us.com/AdminGateway/images/Attendees/" + AttendeeID + '.jpg?rnd=' + rand;
		console.log(this.visualImageURL);
		
		this.cd.markForCheck();

		// Get profile data
		var flags = "pr|";
		this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {

			if (data['length'] > 0) {

				console.log('SocialMedia: ' + JSON.stringify(data));
				
				// Display attendee information
				this.prAttendeeName = data[0].FirstName + " " + data[0].LastName;
				this.prAttendeeTitle = data[0].Title;
				this.prAttendeeOrganization = data[0].Company;
				
				// Save current values to determine if a change was made
				this.localstorage.setLocalValue('prAttendeeTitle', data[0].Title);
				this.localstorage.setLocalValue('prAttendeeOrganization', data[0].Company);
				
				// Set color indications for social media icons
				if(data[0].showTwitter == "Y") {
					this.statusTwitter = "white";
				} else {
					this.statusTwitter = "white";
				}
				if(data[0].showFacebook == "Y") {
					this.statusFacebook = "white";
				} else {
					this.statusFacebook = "gray";
				}
				if(data[0].showLinkedIn == "Y") {
					this.statusLinkedIn = "green";
				} else {
					this.statusLinkedIn = "gray";
				}
				if(data[0].showInstagram == "Y") {
					this.statusInstagram = "green";
				} else {
					this.statusInstagram = "gray";
				}
				if(data[0].showPinterest == "Y") {
					this.statusPinterest = "green";
				} else {
					this.statusPinterest = "gray";
				}
				
			}

			this.cd.markForCheck();
			
		}).catch(function () {
			console.log("Promise Rejected");
		});
		
	}

	UploadImage() {
				
		this.router.navigateByUrl('./pages/ProfileImagePage',);
				
	}

	ChangePassword() {
/*		
		const ChangePasswordModalOptions: ModalOptions = {
			enableBackdropDismiss: false
		};


		const ChangePasswordModal: Modal = this.modal.create('ProfilePasswordChangePage', {}, ChangePasswordModalOptions);

		ChangePasswordModal.present();
*/		
	}
	
	SignOut() {
	
		this.localstorage.setLocalValue('LoginWarning', '0');
		this.localstorage.setLocalValue('ForwardingPage', '');
		this.navCtrl.navigateForward('/login');

	}
	
	SaveProfileChanges() {
		
		// Saving progress
		let saving = this.loadingCtrl.create({
			spinner: 'crescent',
			message: 'Saving...'
		});

		// Alert for successful save
		let savealert = this.alertCtrl.create({
			header: 'Profile Changes',
			subHeader: 'The changes to your Title and Organziation have been saved.',
			buttons: ['Ok']
		});

		// Alert for failed save
		let failalert = this.alertCtrl.create({
			header: 'Profile Changes',
			subHeader: 'Unable to save your changes at this time - please try again in a little bit.',
			buttons: ['Ok']
		});

		// Alert for no changes
		let nochangealert = this.alertCtrl.create({
			header: 'Profile Changes',
			subHeader: 'No changes have been made so there is nothing to save.',
			buttons: ['Ok']
		});

		// Get originally stored values
		var originalTitle = this.localstorage.getLocalValue('prAttendeeTitle');
		var originalCompany = this.localstorage.getLocalValue('prAttendeeOrganization');

		if (originalTitle == null || originalTitle === null || originalTitle == 'null') {
			originalTitle = '';
		}
		if (originalCompany == null || originalCompany === null || originalCompany == 'null') {
			originalCompany = '';
		}
		
		// Get currently entered values
		var prTitle = this.prAttendeeTitle;
		var prOrg = this.prAttendeeOrganization;
		if (prTitle == null || prTitle === null || prTitle == 'null') {
			prTitle = '';
		}
		if (prOrg == null || prOrg === null || prOrg == 'null') {
			prOrg = '';
		}
		
		console.log('originalTitle: ' + originalTitle);
		console.log('originalCompany: ' + originalCompany);
		console.log('prTitle: ' + prTitle);
		console.log('prOrg: ' + prOrg);
		
		if (originalTitle == prTitle && originalCompany == prOrg) {
			
//			saving.dismiss();
//			nochangealert.present();

		} else {

			// Send data to update database with disable
			var flags = 'ps|0|0|' + prTitle + '|' + prOrg;
			var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
			
			this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
				
				console.log("getDatabaseStats: " + JSON.stringify(data));

				if (data['length']>0) {
	 
					if (data[0].Status == "Success") {
						
//						saving.dismiss();
//						savealert.present();

					} else {
						
//						saving.dismiss();
//						failalert.present();

					}
					
				}
			
			}).catch(function () {
				console.log("ProfileSocialMediaEntryPage Promise Rejected");
//				saving.dismiss();
			});
		
		}
		
	}
	
	EditSocialMediaLinks(smSocialMediaType) {
		
		this.localstorage.setLocalValue('SocialMediaType', smSocialMediaType);
/*
		const AddProfileSocialMediaModalOptions: ModalOptions = {
			enableBackdropDismiss: false
		};

		const AddProfileSocialMediaModal: Modal = this.modal.create('ProfileSocialMediaEntryPage', {}, AddProfileSocialMediaModalOptions);

		AddProfileSocialMediaModal.present();

		AddProfileSocialMediaModal.onDidDismiss((data) => {
			console.log('Post-closeModal, Returned status: ' + data);
			var ReturnedValues = data.split("|");
			if (ReturnedValues[0] == "Save") {
				var smButtonName = ReturnedValues[1];
				console.log('Post-closeModal, Button Name: ' + ReturnedValues[1]);
				console.log('Post-closeModal, Button Status: ' + ReturnedValues[3]);
				if (ReturnedValues[3] == 'Y') {
					this[smButtonName] = "green";
					this.cd.markForCheck();
				} else {
					this[smButtonName] = "gray";
					this.cd.markForCheck();
				}
				
			}
			
		});
*/		
		
	}
	
	toggleSocialMedia(smSocialMediaType) {
/*				
		if (this[smSocialMediaType] == "green") {
			
			// Disable onscreen button
			this[smSocialMediaType] = "gray";
			
			// Send data to update database with disable
			var flags = 'pd|' + smSocialMediaType + '|';
			var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
			
			this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
				
				console.log("getDatabaseStats: " + JSON.stringify(data));

				if (data['length']>0) {

                    console.log("Return status: " + data[0].Status);
					
				}
			
			}).catch(function () {
				console.log("ProfileSocialMediaEntryPage Promise Rejected");
			});
			
		} else {
			
			// Set indicator to green and request link
			this[smSocialMediaType] = "green";
			this.localstorage.setLocalValue('SocialMediaType', smSocialMediaType);

			const AddProfileSocialMediaModalOptions: ModalOptions = {
				enableBackdropDismiss: false
			};

			const AddProfileSocialMediaModal: Modal = this.modal.create('ProfileSocialMediaEntryPage', {}, AddProfileSocialMediaModalOptions);

			AddProfileSocialMediaModal.present();

			AddProfileSocialMediaModal.onDidDismiss((data) => {
				console.log('Returned status: ' + data);
				// If saved, then re-run ngOnInit to refresh the listing
				if (data == "Save") {
					this.ngOnInit();
				}
				if (data == "NoEntry") {
					console.log('Updating: ' + smSocialMediaType);
					this[smSocialMediaType] = "gray";
					this.cd.markForCheck();
				}
				
			});
		
		}
*/		
	}

}

