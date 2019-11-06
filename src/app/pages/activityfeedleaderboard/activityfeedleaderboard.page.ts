// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-activityfeedleaderboard',
  templateUrl: './activityfeedleaderboard.page.html',
  styleUrls: ['./activityfeedleaderboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityFeedleaderboardPage {

	public LeaderboardListing: any[] = [];
	view: any;
	
	constructor(
				private storage: Storage,
				private databaseprovider: DatabaseService,
				private modal: ModalController,
				private cd: ChangeDetectorRef,
				public navCtrl: NavController,
				private localstorage: LocalstorageService) {
						
	}

	ionViewDidEnter() {

		var flags = "lb|";
		
		this.LeaderboardListing = [];
		this.cd.markForCheck();
		
		this.databaseprovider.getDatabaseStats(flags, "0").then(data => {

			console.log('Leaderboard data: ' + JSON.stringify(data));
			
			if (data['length']>0) {
				
				var AttendeeName = "";
				var visCompanyName = "";
				var MaxBarDisplay = data[0].PostingsComments;
				var BarDisplay = 0;
				
				for (var i = 0; i < data['length']; i++) {
					
					AttendeeName = data[i].FirstName + " " + data[i].LastName;
					
					// Use blank if no company name available
					if (data[i].Company == null || data[i].Company == undefined) {
						visCompanyName = "";
					} else {
						visCompanyName = data[i].Company;
					}
					
					// Determine if avatar is available or to use the default
					var imageAvatar = "";
					if (data[i].avatarFilename != 'undefined' && data[i].avatarFilename != undefined && data[i].avatarFilename != '' && data[i].avatarFilename.length > 0) {
						imageAvatar = "https://naeyc.convergence-us.com/AdminGateway/images/Attendees/" + data[i].avatarFilename;
					} else {
						imageAvatar = "assets/img/personIcon.png";
					}
					
					// Determine percentage amount for bar length
					if (parseInt(data[i].PostingsComments) == MaxBarDisplay) {
						BarDisplay = 100;
					} else {
						BarDisplay = (parseInt(data[i].PostingsComments) / MaxBarDisplay) * 100;
					}
					
					var Counter = parseInt(data[i].PostingsComments);
					
					console.log('Attendee: ' + AttendeeName + ', Counter: ' + Counter + ', BarDisplay: ' + BarDisplay);
					
					this.LeaderboardListing.push({
						lbDisplayName: AttendeeName,
						lbCompany: visCompanyName,
						lbBarDisplay: BarDisplay,
						lbCounter: Counter,
						lbAvatar: imageAvatar
					});
					
				}
				
				this.cd.markForCheck();

			}
			
		});
		
	}
	
	async closeModal() {
		//const onClosedData: string = "Wrapped Up!";
		//await this.modal.dismiss(onClosedData);
		console.log('Modal close button clicked');
		await this.modal.dismiss();
	}
  
}


