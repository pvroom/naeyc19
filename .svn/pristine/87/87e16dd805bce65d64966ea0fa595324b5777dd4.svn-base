// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';

@Component({
  selector: 'app-profilesocialmediaentry',
  templateUrl: './profilesocialmediaentry.page.html',
  styleUrls: ['./profilesocialmediaentry.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileSocialMediaEntryPage {

	public SocialMediaURLEntry: string;
	public typeOfSocialMedia: string;
	public typeOfSampleSocialMedia: string;
	
	constructor(private storage: Storage,
				private cd: ChangeDetectorRef,
				private modal: ModalController,
				private databaseprovider: DatabaseService,
				private localstorage: LocalstorageService) {
					
	}

	clearInput() {
		
		this.SocialMediaURLEntry = "";
		this.cd.markForCheck();
		
	}

	ngOnInit() {

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var SocialMediaType = this.localstorage.getLocalValue('SocialMediaType');
		console.log('SocialMediaType: ' + SocialMediaType);
		
		switch(SocialMediaType) {
			case "statusTwitter":
				this.typeOfSocialMedia = "Twitter";
				this.typeOfSampleSocialMedia = "https://twitter.com/johnsmith";
				break;
			case "statusLinkedIn":
				this.typeOfSocialMedia = "LinkedIn";
				this.typeOfSampleSocialMedia = "https://www.linkedin.com/inJohnSmith";
				break;
			case "statusFacebook":
				this.typeOfSocialMedia = "Facebook";
				this.typeOfSampleSocialMedia = "https://www.facebook.com/JohnSmith";
				break;
			case "statusInstagram":
				this.typeOfSocialMedia = "Instagram";
				this.typeOfSampleSocialMedia = "https://instagram.com/johnsmith";
				break;
			case "statusPinterest":
				this.typeOfSocialMedia = "Pinterest";
				this.typeOfSampleSocialMedia = "https://www.pinterest.com/johnsmith";
				break;
		}
		
		var flags = 'pg|' + SocialMediaType;
		
		this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
			
			console.log("getDatabaseStats: " + JSON.stringify(data));

			if (data['length']>0) {

				this.SocialMediaURLEntry = data[0].smURL;
				this.cd.markForCheck();
				
			}
		
		}).catch(function () {
			console.log("ProfileSocialMediaEntryPage Promise Rejected");
		});
		

	}
	
	closeScreen(UserAction) {
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var SocialMediaType = this.localstorage.getLocalValue('SocialMediaType');
		var SocialMediaURLEntry = this.SocialMediaURLEntry;

		var ReturnValue = UserAction + "|" + SocialMediaType + "|" + SocialMediaURLEntry;
		
		if (UserAction == "Save") {

			var flags = 'pu|' + SocialMediaType + '|' + SocialMediaURLEntry;
			
			this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
				
				console.log("getDatabaseStats, closeModal: " + JSON.stringify(data));

				if (data['length']>0) {

					ReturnValue = ReturnValue + "|" + data[0].SocialMediaSetting;
                    console.log("getDatabaseStats, closeModal, Return status: " + data[0].Status);
					if (data[0].Status == 'Saved') {
						this.closeModal(ReturnValue);
					} else {
						// Show alert about failed save
						
					}
					
				}
			
			}).catch(function (e) {
				console.log("Profile Social Media Entry Update Error: " + e);
			});
						
		}
		
		if (UserAction == "Cancel") {
			this.closeModal(ReturnValue);
		}
		
	}

	async closeModal(ReturnValue) {
		//const onClosedData: string = "Wrapped Up!";
		//await this.modal.dismiss(onClosedData);
		console.log('Modal close button clicked');
		await this.modal.dismiss(ReturnValue);
	}

}
