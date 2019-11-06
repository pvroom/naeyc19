// Components, functions, plugins
import { Component, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';
import { Router } from '@angular/router';

// Pages
import { ConversationPage } from '../conversation/conversation.page';
import { AttendeesPage } from "../attendees/attendees.page";
import { MorePage } from '../more/more.page';

declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationsPage {
	
	public Conversations: any[] = [];

	constructor(public navCtrl: NavController, 
				private storage: Storage,
				private databaseprovider: DatabaseService,
				private alertCtrl: AlertController,
				private router: Router,
				private cd: ChangeDetectorRef,
				public loadingCtrl: LoadingController,
				private localstorage: LocalstorageService) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SpeakersPage');
	}

	NavToPage(PageID) {

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
	
		switch(PageID) {
			case "AttendeesPage":
				this.navCtrl.navigateForward('/attendees');
				break;
	
		}

	};

	async ngOnInit() {

		// Load initial data set here
		const loading = await this.loadingCtrl.create({
			spinner: 'crescent',
			message: 'Please wait...'
		});

//		loading.present();

		// Blank and show loading info
		this.Conversations = [];
		this.cd.markForCheck();
		
		// Temporary use variables
		var flags = "li|Time|";
        var DisplayName = "";
		var visDisplayCompany = "";
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		
		// Get the data
		this.databaseprovider.getMessagingData(flags, AttendeeID).then(data => {
			
			console.log("getMessagingData: " + JSON.stringify(data));

			if (data['length']>0) {
				
				for (var i = 0; i < data['length']; i++) {

                    DisplayName = "";

                    // Concatenate fields to build displayable name
                    DisplayName = DisplayName + data[i].LastName + ", " + data[i].FirstName;
					
					// Use Credentials field for Company/Association
					visDisplayCompany = "";
                    if (data[i].Company != "") {
                        visDisplayCompany = data[i].Company;
                    }

					var imageAvatar = "https://naeyc.convergence-us.com/AdminGateway/images/Attendees/" + data[i].ConversationAttendeeID + ".jpg";
					console.log('imageAvatar: ' + imageAvatar);
					

					// Add current record to the list
					this.Conversations.push({
						ConversationAttendeeID: data[i].ConversationAttendeeID,
						AttendeeName: DisplayName,
						AttendeeOrganization: visDisplayCompany,
						AttendeeAvatar: imageAvatar
					});
					

				}


			} else {
				
                // No records to show
				this.Conversations.push({
					ConversationAttendeeID: 0,
					AttendeeName: "No conversations available",
					AttendeeOrganization: "",
					AttendeeAvatar: ""
				});

			}

			this.cd.markForCheck();

//			loading.dismiss();
			
		}).catch(function () {
			console.log("Promise Rejected");
		});
					
		// Update LastSync date for next run
		//var ThisDirectChatCheck = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		var ThisDirectChatCheck2 = new Date().toUTCString();
		var ThisDirectChatCheck = dateFormat(ThisDirectChatCheck2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
		this.localstorage.setLocalValue('LastDirectChatCheck', ThisDirectChatCheck);
			
		
	}

    ContinueConversation(ConversationAttendeeName, ConversationAttendeeID) {
		
		console.log(ConversationAttendeeID);
			
		if (ConversationAttendeeID != 0) {
						
			// Navigate to Conversation Details page
			this.localstorage.setLocalValue('ConversationAttendeeName', ConversationAttendeeName);
			this.localstorage.setLocalValue('ConversationAttendeeID', ConversationAttendeeID);
			this.navCtrl.navigateForward('/conversation/' + ConversationAttendeeID);
			
		}
		
    }
	
}





