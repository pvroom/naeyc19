// Components, functions, plugins
import { Component, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';

// Pages
//import { HomePage } from '../home/home.page';
//import { ActivityPage } from '../activity/activity.page';

@Component({
  selector: 'app-activityfeedposting',
  templateUrl: './activityfeedposting.page.html',
  styleUrls: ['./activityfeedposting.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityFeedPostingPage {

	public CommentEntry: string;
	public ActivityFeedAttachment: string;
	public deviceButtons: boolean;
	public browserButtons: boolean;
	
	constructor(public navCtrl: NavController,
				private storage: Storage,
				private databaseprovider: DatabaseService,
				private cd: ChangeDetectorRef,
				private alertCtrl: AlertController, 
				private modal: ModalController,
				public http: HttpClient,
				public loadingCtrl: LoadingController,
				private camera: Camera,
				public _DomSanitizer: DomSanitizer,
				private localstorage: LocalstorageService) {
				
	}

	addCameraImage() {
		
		const options: CameraOptions = {
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			correctOrientation:true,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64:
			console.log('Camera image');
			/*
			if (this.platform.is('ios')) {
				this.base64Image = normalizeURL(imageData);
				// IF problem only occur in ios and normalizeURL 
				//not work for you then you can also use 
				//this.base64Image= imageData.replace(/^file:\/\//, '');
			} else {
				this.base64Image= "data:image/jpeg;base64," + imageData;
			}, error => {
				console.log('ERROR -> ' + JSON.stringify(error));
			});
			*/
			this.ActivityFeedAttachment = 'data:image/jpeg;base64,' + imageData;
			//this.ActivityFeedAttachment = base64Image;
			this.localstorage.setLocalValue('ActivityFeedPostedImage', 'Y');
		
			this.cd.markForCheck();
			
		}, (err) => {
			// Handle error
			console.log('Camera error');
			console.log('Camera error: ' + JSON.stringify(err));
		});

	}
	
	addGalleryImage() {
		
		const options: CameraOptions = {
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			correctOrientation:true,
			allowEdit: true,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
		}

		this.camera.getPicture(options).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64:
			console.log('Camera image');
			//if (this.platform.is('ios')) {
			//	imageData = _DomSanitizer.bypassSecurityTrustUrl(imageData);
			//}
			this.ActivityFeedAttachment = 'data:image/jpeg;base64,' + imageData;
			//this.ActivityFeedAttachment = base64Image;
			this.localstorage.setLocalValue('ActivityFeedPostedImage', 'Y');
		
			this.cd.markForCheck();
			
		}, (err) => {
			// Handle error
			console.log('Camera error');
			console.log('Camera error: ' + JSON.stringify(err));
		});

	}
	
	ionViewDidEnter() {

		this.ActivityFeedAttachment = '';
		this.localstorage.setLocalValue('ActivityFeedPostedImage', 'N');
	
		var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '').replace(/-/g,'').replace(' ', '');
		console.log('CurrentDateTime: ' + CurrentDateTime);
		var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
		
		// Disable access to camera and gallery buttons when running in a browser
		// until the ability to pull an image via the browser can be implemented
		if (DevicePlatform == 'Browser') {
			console.log('Browser button settings');
			this.deviceButtons = false;
			this.browserButtons = true;
		} else {
			console.log('Device button settings');
			this.deviceButtons = true;
			this.browserButtons = false;
		}
		
		this.cd.markForCheck();

	}  

	async closeModal(UserAction) {
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		if (UserAction == "Save") {
   
			var UserComment = this.CommentEntry || '';
												 			
			if (UserComment != '') {
   
				var afpImage = this.localstorage.getLocalValue('ActivityFeedPostedImage');

				// Load initial data set here
				const loading = await this.loadingCtrl.create({
					spinner: 'crescent',
					message: 'Saving your posting and image...'
				});

				await loading.present();

				var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
				var PostedDateTime = CurrentDateTime;
				CurrentDateTime = CurrentDateTime.replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '').replace(/-/g,'').replace(' ', '');
				
				var NewFilename = AttendeeID + '-' + CurrentDateTime;
				console.log('New filename: ' + NewFilename);
				
				//console.log('CommentEntry: ' + UserComment);
				//console.log('Image: ' + this.ActivityFeedAttachment);
				
				let url = 'https://naeyc.convergence-us.com/AdminGateway/image_uploader.php';
				let postData = new FormData();
				postData.append('file', this.ActivityFeedAttachment);
				postData.append('location', 'ActivityFeedAttachments');
				postData.append('filename', NewFilename);
				postData.append('Comment', UserComment);
				postData.append('afpImage', afpImage);
				postData.append('AttendeeID', AttendeeID);
				
				let data:Observable<any> = this.http.post(url, postData);
				
				data.subscribe((Postingresult) => {
					
					console.log("Image uploaded: " + JSON.stringify(Postingresult));
					console.log('afID: ' + Postingresult[0].afID);
					loading.dismiss();
					
					this.modal.dismiss(UserAction);
					
					//await this.modal.dismiss(UserAction);
							
					//var flags = 'ad|' + result.afID + '|' + UserComment + '|0|' + NewFilename + '.jpg|' + PostedDateTime;
					//this.localstorage.setLocalValue('ActivityFeedFlags', flags);
					
					//this.databaseprovider.getActivityFeedData(flags, AttendeeID).then(data3 => {
						
					//	console.log("getActivityFeedData: " + JSON.stringify(data3));

					//	if (data3['length']>0) {

					//		console.log("Return status: " + data3[0].Status);
					//		loading.dismiss();
					//		await this.modal.dismiss(UserAction);
							
					//	}
					
					//}).catch(function () {
					//	console.log("Activity Feed Promise Rejected");
					//	loading.dismiss();
					//});

				});
			
			} else {
				
				const alert = await this.alertCtrl.create({
					header: 'Posting Error',
					subHeader: 'You cannot submit a posting with a blank comment.',
					buttons: ['OK']
				});
				alert.present();

			}
							
		}
		
		if (UserAction == "Cancel") {
			await this.modal.dismiss(UserAction);
		}
		
	}

}
