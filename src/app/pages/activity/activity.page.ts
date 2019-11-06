// Components, functions, plugins
import { Component, ViewChild, ElementRef, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { ModalController, NavController, LoadingController, IonVirtualScroll,  IonicModule, /*Content, FabContainer, Modal */  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { LocalstorageService } from '../../services/localstorage.service';

import * as moment from 'moment';

// Modals
import { ActivityFeedPostingPage } from '../activityfeedposting/activityfeedposting.page';
import { ActivityFeedleaderboardPage } from '../activityfeedleaderboard/activityfeedleaderboard.page';

declare var dateFormat: any;

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ActivityPage {

//  @ViewChild(Content) content: Content;

	
	public activityFeedListing: any[] = [];
	public date: any;

	constructor(public navCtrl: NavController, 
				private storage: Storage,
				private router: Router,
				private databaseprovider: DatabaseService,
				private modal: ModalController,
				private cd: ChangeDetectorRef,
				public loadingCtrl: LoadingController,
				private localstorage: LocalstorageService) {
	}

	ionViewWillEnter() {
		
		console.log('ionViewWillEnter ActivityPage');	
		
		// Update Comment count here when coming back from a posting
		//var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
		//var ActivityFeedIDCCount = this.localstorage.getLocalValue('ActivityFeedIDCCount');
		//var ActivityFeedArrayString = this.localstorage.getLocalValue('ActivityFeedObject');
		
		//this.LoadData();
		
	}

	ionViewDidEnter() {
		
		console.log('ionViewDidEnter ActivityPage');
		// Update Comment count here when coming back from a posting
		var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
		var ActivityFeedIDCCount = this.localstorage.getLocalValue('ActivityFeedIDCCount');
		var ActivityFeedArrayString = this.localstorage.getLocalValue('ActivityFeedObject');
		
		//this.LoadData();

	}

	timeDifference(laterdate, earlierdate) {
		
		//console.log('Moment timeDifference input, laterdate: ' + laterdate + ', earlierdate: ' + earlierdate);
		//console.log('Moment timeDifference output: ' + moment(earlierdate).fromNow());
		return moment(earlierdate).fromNow();
				
	}

	ngOnInit() {
		
		this.LoadData();
		
	}

	LoadData() {

		// Load initial data set here
		//let loading = this.loadingCtrl.create({
		//	spinner: 'crescent',
		//	content: 'Please wait...'
		//});

		//loading.present();

		// Blank and show loading info
		this.activityFeedListing = [];
		this.cd.markForCheck();
		
		// Temporary use variables
		var flags = "li|Alpha|0";
        var DisplayName = "";
        var SQLDate;
        var DisplayDateTime;
        var dbEventDateTime;
		var afWebLink;
		var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
			
		
		// Get the data
		this.databaseprovider.getActivityFeedData(flags, "0").then(data => {
			
			console.log("getActivityFeedData: " + JSON.stringify(data));
			
			if (data['length']>0) {
				
				for (var i = 0; i < data['length']; i++) {
					
					console.log('Processing afID: ' + data[i].afID);
					
					var imageAvatar = "https://naeyc.convergence-us.com/AdminGateway/images/Attendees/" + data[i].AttendeeID + ".jpg";
					console.log(imageAvatar);
					
					var imageAttachment = data[i].afImageAttachment;
					var imageAttached = false;
					if (imageAttachment != "") {
						imageAttachment = "https://naeyc.convergence-us.com/AdminGateway/images/ActivityFeedAttachments/" + imageAttachment;
						imageAttached = true;
					}
					console.log('Activity Feed, imageAttached: ' + imageAttached);
					console.log('Activity Feed, imageAttachment: ' + imageAttachment);
					
					DisplayName = data[i].PosterFirst + " " + data[i].PosterLast;
					console.log('Activity Feed, DisplayName: ' + DisplayName);

					afWebLink = false;
					if (data[i].LinkedURL != "" && data[i].LinkedURL !== null) {
						afWebLink = true;
					}
					console.log('Activity Feed, Linked URL available: ' + afWebLink);
					console.log('Activity Feed, Linked URL: ' + data[i].LinkedURL);

					dbEventDateTime = data[i].Posted.substring(0, 19);
					dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
					dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
					SQLDate = new Date(dbEventDateTime);
					DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
					console.log('Activity Feed, DisplayDateTime: ' + DisplayDateTime);
				
					
					var CurrentDateTime2 = new Date().toUTCString();
					console.log('Activity Feed, CurrentDateTime2: ' + CurrentDateTime2);
					var CurrentDateTime = dateFormat(CurrentDateTime2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
					console.log('Activity Feed, CurrentDateTime: ' + CurrentDateTime);
					
					//console.log('Activity Feed, afDateTime: ' + data[i].afDateTime);
					dbEventDateTime = data[i].afDateTime.substring(0, 19);
					dbEventDateTime = dbEventDateTime.replace(' ', 'T');
					dbEventDateTime = dbEventDateTime + 'Z';
					console.log('Activity Feed, dbEventDateTime: ' + dbEventDateTime);
					var PostedDate2 = new Date(dbEventDateTime);
					console.log('Activity Feed, PostedDate2: ' + PostedDate2);
					var PostedDate = dateFormat(PostedDate2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
					console.log('Activity Feed, PostedDate: ' + PostedDate);
					var TimeDifference = this.timeDifference(CurrentDateTime, PostedDate);					
					console.log('Activity Feed, TimeDifference: ' + TimeDifference);

					// Show the current record
					this.activityFeedListing.push({
						afID: data[i].afID,
						ActivityFeedCommentAvatar: imageAvatar,
						AttendeeID: data[i].AttendeeID,
						ActivityFeedCommentBy: DisplayName,
						ActivityFeedCommentPosted: DisplayDateTime,
						ActivityFeedAttachment: imageAttachment,
						ActivityFeedComment: data[i].afMessage,
						ActivityFeedLikesCounter: data[i].afLikesCounter,
						ActivityFeedCommentsCounter: data[i].CommentsCount,
						ActivityFeedCommentPostedDuration: TimeDifference,
						ActivityFeedAttached: imageAttached,
						ActivityFeedLinkedURL: data[i].LinkedURL,
						showActivityFeedLinkedURL: afWebLink
					});

				}

				this.cd.markForCheck();

				// Scroll back to last viewed entry when 
				// coming back from a posting
				//if (parseInt(ActivityFeedID) > 0 ) {
				//	setTimeout(() => {
				//		this.scrollTo("afID" + ActivityFeedID);
				//	}, );
				//}
		
			} else {
				
                // No records to show
				this.activityFeedListing.push({
						afID: 0,
						ActivityFeedCommentAvatar: "No records found",
						AttendeeID: 0,
						ActivityFeedCommentBy: "",
						ActivityFeedCommentPosted: "",
						ActivityFeedAttachment: "",
						ActivityFeedComment: "",
						ActivityFeedLikesCounter: "",
						ActivityFeedCommentsCounter: "",
						ActivityFeedCommentPostedDuration: "",
						ActivityFeedAttached: false,
						ActivityFeedLinkedURL: data[i].LinkedURL,
						showActivityFeedLinkedURL: false
				});

				this.cd.markForCheck();

			}

			//loading.dismiss();
			

		}).catch(function () {
			console.log("Activity Feed Promise Rejected");
			//loading.dismiss();
		});
					
	}

	scrollTo(element:string) {
		let elem = document.getElementById(element);
		var box = elem.getBoundingClientRect();

		var body = document.body;
		var docEl = document.documentElement;

		var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		var clientTop = docEl.clientTop || body.clientTop || 0;
		var top  = box.top +  scrollTop - clientTop;
	//	var cDim = this.content.getContentDimensions();

	//	var scrollOffset = Math.round(top) + cDim.scrollTop - cDim.contentTop;

	//	this.content.scrollTo(0, scrollOffset, 500);
	}
  
	UpdateLikes(activityFeedItem, activityfeedID) {

		console.log('Likes button tapped');
		
		this.localstorage.setLocalValue('ActivityFeedLikesButton', '1');
		
		var flags = "lu|" + activityfeedID;

		// Get the data
		this.databaseprovider.getActivityFeedData(flags, "0").then(data => {
			
			console.log(JSON.stringify(data));
			
			if (data['length']>0) {
				
				if (data[0].Status = "Saved") {
					activityFeedItem.ActivityFeedLikesCounter = data[0].NewLikes;
					this.cd.markForCheck();
				}
				
			}
			
		}).catch(function () {
			console.log("UpdateLikes Promise Rejected");
		});

	}




	//goActivityfeeddetails() {
		//this.navCtrl.navigateForward('/activityfeeddetails/' + SpeakerID);
		// this.navCtrl.push(ActivityfeeddetailsPage);
	//}



    ActivityFeedDetails(activityFeedItem, activityfeedID) {

		this.localstorage.setLocalValue('ActivityFeedObject', JSON.stringify(activityFeedItem));
					
		console.log('Activity details requested');
		
		if (activityfeedID != 0) {
			
			var LikesButton = "";
			LikesButton = this.localstorage.getLocalValue('ActivityFeedLikesButton');
			console.log('Likes button check: ' + LikesButton);
			if (LikesButton == '1') {
				this.localstorage.setLocalValue('ActivityFeedLikesButton', '0');
			} else {
				console.log('Going to activity feed: ' + activityfeedID);
				// Navigate to Activity Feed Details page
				this.localstorage.setLocalValue('ActivityFeedID', activityfeedID);
				this.navCtrl.navigateForward('/activityfeeddetails/' + activityfeedID);
			}
		}
		
    };


	AttendeeDetails(oAttendeeID) {
		
		console.log('oAttendeeID: ' + oAttendeeID);
		
		this.localstorage.setLocalValue("oAttendeeID", oAttendeeID);
		this.navCtrl.navigateForward('/attendeesprofile/' + oAttendeeID);

	}
	
	async openAddPostingModal() {

		const modal = await this.modal.create({
			  component: ActivityFeedPostingPage,
			  componentProps: {
				 enableBackdropDismiss: false
			  }
		});
		 
		modal.onDidDismiss().then((data) => {
		   this.localstorage.setLocalValue('afFABClicked', '0');
			// If saved, then re-run ngOnInit to refresh the listing
			if (data.data == "Save") {
				this.LoadData();
			}
		});
		
		await modal.present();

	}

	AddPosting() {
		
		// Disable other click event
		this.localstorage.setLocalValue('afFABClicked', '1');
		
		console.log('Set FAB Override, AddPosting');
		
		this.openAddPostingModal();

	}

	async openLeaderboardModal() {

		const modal = await this.modal.create({
			  component: ActivityFeedleaderboardPage,
			  componentProps: {
				 enableBackdropDismiss: false
			  }
		});
		 
		modal.onDidDismiss().then(() => {
		   this.localstorage.setLocalValue('afFABClicked', '0');
		   console.log('Leaderboard modal closed.');
		});
		
		await modal.present();

	}

	ViewLeaderboard() {
		
		// Disable other click event
		this.localstorage.setLocalValue('afFABClicked', '1');

		console.log('Set FAB Override, ViewLeaderboard');
		
		this.openLeaderboardModal();
		
	}

	navToWeb(wURL) {
		
		if (wURL != "") {
          if ((wURL.substring(0, 7).toLowerCase() != "http://") && (wURL.substring(0, 8).toLowerCase() != "https://")) {
               wURL = "http://" + wURL;
          }
			
			console.log('Activities Feed: Navigating to: ' + wURL);
           window.open(wURL, '_system');
		}

	}

	
 }

 