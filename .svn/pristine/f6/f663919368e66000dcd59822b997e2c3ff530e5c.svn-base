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

@Component({
  selector: 'app-profileimage',
  templateUrl: './profileimage.page.html',
  styleUrls: ['./profileimage.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileImagePage {

	public ProfileImageAttachment: string;
	public deviceButtons: boolean;
	public browserButtons: boolean;
	
	constructor(public navCtrl: NavController,
				private storage: Storage,
				private databaseprovider: DatabaseService,
				private cd: ChangeDetectorRef,
				private alertCtrl: AlertController,				
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
			//let base64Image = 'data:image/jpeg;base64,' + imageData;
			//this.ProfileImageAttachment = base64Image;
			this.ProfileImageAttachment = 'data:image/jpeg;base64,' + imageData;
		
			this.cd.markForCheck();
			
		}, (err) => {
			// Handle error
			console.log('Camera error');
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
			this.ProfileImageAttachment = 'data:image/jpeg;base64,' + imageData;
		
			this.cd.markForCheck();
			
		}, (err) => {
			// Handle error
			console.log('Camera error');
		});

	}
	
	ionViewDidEnter() {

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
	
	async imageUploadAlert() {
		const alert = await this.alertCtrl.create({
			header: 'Image Upload Error',
			message: 'Problem receiving feedback from server - check log.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async closePage(UserAction) {
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		if (UserAction == "Save") {

			// Load initial data set here
			const loading = await this.loadingCtrl.create({
				message: 'Loading'
			});
			await loading.present();

			var NewFilename = AttendeeID;
			console.log('New filename: ' + NewFilename);
						
			let url = 'https://naeyc.convergence-us.com/AdminGateway/image_uploader.php';
			let postData = new FormData();
			postData.append('file', this.ProfileImageAttachment);
			postData.append('location', 'Attendees');
			postData.append('filename', NewFilename);
			postData.append('AttendeeID', AttendeeID);
			
			let data:Observable<any> = this.http.post(url, postData);
						
			data.subscribe((result) => {
				
				console.log("Image uploaded: " + JSON.stringify(result));
				loading.dismiss();
				
				this.navCtrl.navigateBack('/profile');
						
			},
			err => {
				loading.dismiss();
				this.imageUploadAlert();
				console.log(err.status);
				console.log("Image uploader error: ", JSON.stringify(err));
			});
							
		}
		
		if (UserAction == "Cancel") {
			this.navCtrl.navigateBack('/profile');
		}
		
	}

}
