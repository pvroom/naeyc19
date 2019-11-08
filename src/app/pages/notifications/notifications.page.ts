// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { LocalstorageService } from '../../services/localstorage.service';
import { DatabaseService } from './../../services/database.service';
import { Router } from '@angular/router';

declare var dateFormat: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsPage {

	public NotificationListing: any[] = [];

	constructor(public navCtrl: NavController, 
				private databaseprovider: DatabaseService,
				public loadingCtrl: LoadingController,
				private cd: ChangeDetectorRef,
				private localstorage: LocalstorageService) {
					
	}

    ngOnInit() {

		// Load initial data set here
		//let loading = this.loadingCtrl.create({
		//	spinner: 'crescent',
		//	content: 'Loading...'
		//});

		//loading.present();

		// Blank info
		this.NotificationListing = [];
		this.cd.markForCheck();

		// Temporary use variables
		var flags;
		var visReceivedDate;
		var visReceivedTime;
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		flags = "pn|0";
		
		this.databaseprovider.getMessagingData(flags, AttendeeID).then(data => {
			
			console.log("getMessagingData: " + JSON.stringify(data));

			if (data['length']>0) {
				
				for (var i = 0; i < data['length']; i++) {
					
					var dbEventDateTime = data[i].localDateTime;
					dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
					dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
					var SQLDate = new Date(dbEventDateTime);
					var DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");

					var notificationHeader = "<h2 style='font-weight:500'><b>" + data[i].pushTitle + "</b></h2><h4>" + DisplayDateTime + "</h4><p>" + data[i].pushMessage + "</p>";
					
					this.NotificationListing.push({
						pushTitle: data[i].pushTitle,
						pushDateTime: DisplayDateTime,
						pushMessage: data[i].pushMessage,
						pushNotification: notificationHeader
					});

				}

			} else {
				
				this.NotificationListing.push({
					pushTitle: "No push notifications received on this device",
					pushDateTime: "",
					pushMessage: "",
					pushNotification: "<h2 style='font-weight:500'><b>No push notifications received on this device</b></h2>"
				});

			}

			this.cd.markForCheck();
			//loading.dismiss();
			
		}).catch(function () {
			console.log("Promise Rejected");
			//loading.dismiss();
		});
		
	}

}

