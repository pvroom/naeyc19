// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, AlertController } from '@ionic/angular';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet/dist';
import * as L from "leaflet";
import { Storage } from '@ionic/storage';
import { DatabaseService } from "../../services/database.service";
import { LocalstorageService } from '../../services/localstorage.service';
import { SynchronizationService } from "../../services/synchronization.service";
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

// Pages
import { HomePage } from '../../pages/home/home.page';

declare var formatTime: any;
declare var dateFormat: any;


@Component({
  selector: 'app-help',
  templateUrl: 'help.page.html',
  styleUrls: ['./help.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HelpPage {

	public hcfSenderName: string;
	public hcfSenderEmail: string;
	public hcfSenderPhone: string;
	public hcfSenderComments: string;
	
	// Diagnostics
	public DeviceType: string;
	public AttendeeID: string;
	public flID: string;
	public FlyinBanner: string;
	public LSync: string;
	public PushID: string;

	// Leaflet mapping variables
	myMap: any;

	constructor(public navCtrl: NavController, 
				public loadingCtrl: LoadingController,
				public alertCtrl: AlertController,
				private storage: Storage,
				private databaseprovider: DatabaseService,
				private cd: ChangeDetectorRef,
				private localstorage: LocalstorageService) {
				
	}

	ngOnInit() {
	
		// Load diagnostic values
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var DevPlatform = this.localstorage.getLocalValue('DevicePlatform');
		var LastSync = this.localstorage.getLocalValue('LastSync');		
		var PlayerID = this.localstorage.getLocalValue("PlayerID");

		if (DevPlatform == 'Browser') {
			PlayerID = 'n/a';
			LastSync = 'n/a';
		}
		if (AttendeeID == '' || AttendeeID === null) {
			AttendeeID = 'Not logged in';
		}
		
		// Support footer
		this.DeviceType = DevPlatform;
		this.AttendeeID = AttendeeID;
		this.LSync = LastSync;
		this.PushID = PlayerID;
		
		// Help Desk location
		var y = 580;
		var x = 1670;
		var RoomName = "NAEYC Homeroom";
		
		// Simple coordinate system mapping
		console.log('Simple coordinate system mapping');
		this.myMap = L.map('maplevel2', {
			crs: L.CRS.Simple,
			minZoom: -2,
			maxZoom: 0,
			zoomControl: true
		});

		var bounds = L.latLngBounds([0, 0], [1300, 2000]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017

		var image = L.imageOverlay('assets/img/lbcc.concourse.png', bounds, {
			attribution: 'Convergence'
		}).addTo(this.myMap);
		
		this.myMap.fitBounds(bounds);
		this.myMap.setMaxBounds(bounds);

		var SessionName = L.latLng([y, x]);

		L.marker(SessionName).addTo(this.myMap)
			.bindPopup(RoomName)
			.openPopup();

		this.myMap.setView([y, x], 1);
		
		this.cd.markForCheck();
		
	}

	async presentSaveAlert() {
		const savealert = await this.alertCtrl.create({
			header: 'Help Screen',
			message: 'Your help note has been sent successfully',
			buttons: ['OK']
		});

		await savealert.present();
	}

	async presentFailAlert() {
		const failalert = await this.alertCtrl.create({
			header: 'Help Screen',
			message: 'Unable to send your note at this time - please try again in a little bit.',
			buttons: ['OK']
		});

		await failalert.present();
	}

	async presentRequiredAlert() {
		const requiredalert = await this.alertCtrl.create({
			header: 'Help Screen',
			message: 'All fields except Phone are required to be completed before sending.',
			buttons: ['OK']
		});

		await requiredalert.present();
	}


	async sendEmail() {
		
		// Saving progress
		const saving = await this.loadingCtrl.create({
			spinner: 'crescent',
			message: 'Sending...'
		});

		// Show saving progress
		await saving.present();

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var LoginName = this.localstorage.getLocalValue('LoginFullName');
		var DevPlatform = this.localstorage.getLocalValue('DevicePlatform');
		
		var flags = "";
		
        // Validation checks
        var ValidationPass = true;

		// Diagnostics
		console.log('hcfSenderName :' + this.hcfSenderName);
		console.log('hcfSenderEmail :' + this.hcfSenderEmail);
		console.log('hcfSenderPhone :' + this.hcfSenderPhone);
		console.log('hcfSenderComments :' + this.hcfSenderComments);
		
        if (this.hcfSenderName == null || this.hcfSenderName == "" || this.hcfSenderName == undefined) {
            ValidationPass = false;
        }
        if (this.hcfSenderEmail == null || this.hcfSenderEmail == "" || this.hcfSenderEmail == undefined) {
            ValidationPass = false;
        }
        //if (this.hcfSenderPhone == null || this.hcfSenderPhone == "" || this.hcfSenderPhone == undefined) {
        //    ValidationPass = false;
        //}
        if (this.hcfSenderComments == null || this.hcfSenderComments == "" || this.hcfSenderComments == undefined) {
            ValidationPass = false;
        }

        if (ValidationPass == false) {
			
			saving.dismiss();
			this.presentRequiredAlert();

        } else {
			
			if (this.hcfSenderPhone == undefined) {
				this.hcfSenderPhone = "";
			}
			
			flags = "cf|" + this.hcfSenderName;
			flags = flags + "|" + this.hcfSenderEmail;
			flags = flags + "|" + this.hcfSenderPhone;
			flags = flags + "|" + this.hcfSenderComments;
			
			this.databaseprovider.sendHelpData(flags, AttendeeID).then(data => {
				if (data['length']>0) {
					
					if (data[0].hcfStatus == "Success") {
						// Saved
						saving.dismiss();
						this.presentSaveAlert();
						this.navCtrl.navigateRoot('/home');
					} else {
						// Not saved
						saving.dismiss();
						this.presentFailAlert();
					}
					
				} else {
					
					// Not saved
					saving.dismiss();
					this.presentFailAlert();
					
				}
			}).catch(function () {
				console.log("Help: Promise Rejected");
			});
			
		}
		
	}

    navToEmail(EmailAddress) {
        if (EmailAddress === undefined) {
            // Do nothing
        } else {
            // Initiate mail program
			window.open('mailto:' + EmailAddress + '?subject=NAEYC 2019 Help Desk', '_system', 'location=yes');
        }

    };
	
	callPhone3(phoneNumber) {
        console.log("Dialer version 3");
		
		var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
		
		if (DevicePlatform!='Browser') {
			if ((phoneNumber === undefined) || (phoneNumber == '')) {
				console.log('No phone number defined');
				// Do nothing
			} else {

				// Remove characters from phone number string and format accordingly
				phoneNumber = phoneNumber.replace('(', '');
				phoneNumber = phoneNumber.replace(')', '');
				phoneNumber = phoneNumber.replace(' ', '-');
				
				console.log('Help, Dialer: corrected tel:' + phoneNumber);
				
				window.open(`tel:${phoneNumber}`, '_system');
  
			}

		}
    }

}

