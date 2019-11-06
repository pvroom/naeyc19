// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { LocalstorageService } from '../../services/localstorage.service';
import { DatabaseService } from './../../services/database.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-networking',
  templateUrl: './networking.page.html',
  styleUrls: ['./networking.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NetworkingPage {

	public NewMessagesCounter: string;
	public NewMessagesIndicator = false;
	
	constructor(public navCtrl: NavController, 
				private nav: NavController,
				private databaseprovider: DatabaseService,
				private router: Router,
				private alertCtrl: AlertController, 
				private cd: ChangeDetectorRef,
				private localstorage: LocalstorageService) {

	}

	ionViewDidEnter() {
		console.log('ionViewDidEnter: NetworkingPage');
		var DCArrayString = this.localstorage.getLocalValue('DirectChatMonitoringString');

		console.log('DCArrayString: ' + DCArrayString);
		if (DCArrayString !== null) {
			var data2 = JSON.parse(DCArrayString);
			if (data2['length'] > 0) {
				console.log('data2, NewMessages: ' + data2[0].NewMessages);
				this.NewMessagesCounter = data2[0].NewMessages;
				if (data2[0].NewMessages == "0") {
					this.NewMessagesIndicator = false;
				} else {
					this.NewMessagesIndicator = true;
				}
			} else {
				this.NewMessagesIndicator = false;
			}
		} else {
			this.NewMessagesIndicator = true;
		}
		this.cd.markForCheck();
	}
  
	// Alert definitions
	async internetRequiredAlert() {
		const alert = await this.alertCtrl.create({
			header: 'Internet Error',
			message: 'You need to have Internet access in order to use that feature.',
			buttons: ['OK']
		});

		await alert.present();
	}
  
    NavigateTo(page) {

		console.log('Networking, page selected: ' + page);

		if (page == 'Conversations' || page =='ActivityFeed') {
			
			console.log('Networking, check Internet connection');
			var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
			var flags = "cn";

			this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
			
				console.log('Networking, connection status: ' + data[0].Status);
				
				if (data[0].Status == "Connected") {
					
					switch(page) {
						case "Conversations":
							// Navigate to Conversations page
							this.navCtrl.navigateForward('/conversations');
							break;
						case "ActivityFeed":
							// Navigate to Activity Feed page
							this.localstorage.setLocalValue('ActivityFeedID', '0');
							this.navCtrl.navigateForward('/activity');
							break;
						case "Attendees":
							// Navigate to Activity Feed page
							this.navCtrl.navigateForward('/attendees');
							break;
						case "MyProfile":
							// Navigate to Activity Feed page
							this.navCtrl.navigateForward('/profile');
							break;
					}
				
				} else {

					this.internetRequiredAlert();
				
				}
				
			});
			
		} else {
			
			switch(page) {
				case "Attendees":
					// Navigate to Attendees page
					this.navCtrl.navigateForward('/attendees');
					break;
				case "Conversations":
					// Navigate to Conversations page
					this.navCtrl.navigateForward('/conversations');
					break;
				case "MyProfile":
					// Navigate to Profile page
					this.navCtrl.navigateForward('/profile');
					break;
				case "Notifications":
					// Navigate to Notifications page
					this.navCtrl.navigateForward('/notifications');
					break;
				case "SocialMedia":
					// Navigate to Social Media page
					this.navCtrl.navigateForward('/social');
					break;
				case "ActivityFeed":
					// Navigate to Activity Feed page
					this.localstorage.setLocalValue('ActivityFeedID', '0');
					this.navCtrl.navigateForward('/activity');
					break;
			}
			
		}
    }

}
