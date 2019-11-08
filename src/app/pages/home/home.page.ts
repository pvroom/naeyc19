// Components, functions, plugins
import { Component, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { ModalController, NavController, LoadingController, AlertController, Platform, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SynchronizationService } from './../../services/synchronization.service';

import * as moment from 'moment';

// Modals
import { ActivityFeedPostingPage } from '../activityfeedposting/activityfeedposting.page';
import { ActivityFeedleaderboardPage } from '../activityfeedleaderboard/activityfeedleaderboard.page';

declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

	public items: any = [];
	
	// Setup page variables
	public DevicePlatform: string;
	LogInOutIcon: string;
	LoggedInUser: string;
	AttendeeInitials: string;
	
	// Setup Menu Style variables
	public DisplayMenuVertical = false;
	public DisplayMenuGrid = false;
	public DisplayMenuDashboard = false;
	
	public AttendeeLoggedIn = true;
	public AttendeeLoggedOut = false;
	
	public MenuBackground: string;

	public upcomingAgendaItems: any[] = [];
	public activityFeedListing: any[] = [];
	public NotificationListing: any[] = [];
	public creditsTypeL: string;
	public creditsTypeP: string;

    public subscription;
    public DCsubscription;
    public i = 0;
	//private db: SQLiteObject;
	public NewMessagesIndicator = false;
	public FABViewable = false;

	constructor(public navCtrl: NavController, 
				private storage: Storage,
				private router: Router,
				private databaseprovider: DatabaseService,
				private modal: ModalController,
				public syncprovider: SynchronizationService,
				private cd: ChangeDetectorRef,
				public events: Events,
				public pltfrm: Platform,
				public loadingCtrl: LoadingController,
				public alertCtrl: AlertController,
				private localstorage: LocalstorageService) {
				


				// Determine platform that the app is running on
				pltfrm.ready().then(() => {
					
					this.DevicePlatform = "Browser";
					if (pltfrm.is('android') && pltfrm.is('mobileweb')==false) {
						console.log("Home: Running on an Android device!");
						this.DevicePlatform = "Android";
						//this.connectToDb();
					}
					if (pltfrm.is('android') && pltfrm.is('mobileweb')==true) {
						console.log("Home: Running on an Android device!");
						this.DevicePlatform = "Browser";
						//this.connectToDb();
					}
					if (pltfrm.is('ios')==true && pltfrm.is('mobileweb')==false) {
						console.log("Home: Running the app on an iOS device!");
						this.DevicePlatform = "iOS";
						//this.connectToDb();
					}
					if (pltfrm.is('ios')==true && pltfrm.is('mobileweb')==true) {
						console.log("Home: Running on browser on an iOS device!");
						this.DevicePlatform = "Browser";
						//this.connectToDb();
					}

					console.log("Home: App platform: " + this.DevicePlatform);
					this.localstorage.setLocalValue('DevicePlatform', this.DevicePlatform);
					this.LogInOutIcon = "log-in";

					var LoginName = this.localstorage.getLocalValue('LoginFullName');
					if (LoginName != '' && LoginName != null) {
						console.log('Stored LoginName: ' + LoginName);
						this.AttendeeLoggedIn = true;
						this.AttendeeLoggedOut = false;
						this.AttendeeInitials = LoginName;
						this.FABViewable = true;
					} else {
						console.log('User not logged in');
						this.LoggedInUser = '';
						this.AttendeeLoggedIn = false;
						this.AttendeeLoggedOut = true;
						this.AttendeeInitials = "";
						this.FABViewable = false;
					}
					this.cd.markForCheck();
					

				}).catch(function () {
					console.log("Home: Promise Rejected");
				});

				// Listen for login/logout events and 
				// refresh side menu dashboard
				this.events.subscribe('user:Status', (LoginType) => {
					console.log('AppComponents: User has ', LoginType);
					this.ShowHideFAB();
					this.LoadNotifications();
					this.LoadUpcomingAgenda();
					this.LoadActivityFeed();
				});

	}

	ShowHideFAB() {
		
		var LoginName = this.localstorage.getLocalValue('LoginFullName');
		if (LoginName != '' && LoginName != null) {
			console.log('Stored LoginName: ' + LoginName);
			this.AttendeeLoggedIn = true;
			this.AttendeeLoggedOut = false;
			this.AttendeeInitials = LoginName;
			this.FABViewable = true;
		} else {
			console.log('User not logged in');
			this.LoggedInUser = '';
			this.AttendeeLoggedIn = false;
			this.AttendeeLoggedOut = true;
			this.AttendeeInitials = "";
			this.FABViewable = false;
		}
		this.cd.markForCheck();
		
	}
	
	timeDifference(laterdate, earlierdate) {
		
		//console.log('Moment timeDifference input, laterdate: ' + laterdate + ', earlierdate: ' + earlierdate);
		//console.log('Moment timeDifference output: ' + moment(earlierdate).fromNow());
		return moment(earlierdate).fromNow();
				
	}

	// Alert definitions
	async internetRequired() {
		const alert = await this.alertCtrl.create({
			header: 'Internet Error',
			message: 'You need to have Internet access in order to use that feature.',
			buttons: ['OK']
		});

		await alert.present();
	}

	ionViewWillEnter() {
		
		console.log('Home: ionViewWillEnter: HomePage');

		var LoginName = this.localstorage.getLocalValue('LoginFullName');
		if (LoginName != '' && LoginName != null) {
			console.log('Stored LoginName: ' + LoginName);
			this.AttendeeLoggedIn = true;
			this.AttendeeLoggedOut = false;
			this.AttendeeInitials = LoginName;
		} else {
			console.log('User not logged in');
			this.LoggedInUser = '';
			this.AttendeeLoggedIn = false;
			this.AttendeeLoggedOut = true;
			this.AttendeeInitials = "";
		}
		
		var HomeScreenStyle = this.localstorage.getLocalValue('HomeScreenStyle');
		switch(HomeScreenStyle) {
			case "DisplayMenuVertical":
				this.DisplayMenuVertical = true;
				this.DisplayMenuGrid = false;
				this.DisplayMenuDashboard = false;
				break;
			case "DisplayMenuGrid":
				this.DisplayMenuVertical = false;
				this.DisplayMenuGrid = true;
				this.DisplayMenuDashboard = false;
				break;
			case "DisplayMenuDashboard":
				this.DisplayMenuVertical = false;
				this.DisplayMenuGrid = false;
				this.DisplayMenuDashboard = true;
				break;
			default:
				this.DisplayMenuVertical = true;
				this.DisplayMenuGrid = false;
				this.DisplayMenuDashboard = false;
				break;
		}
		
		this.cd.markForCheck();

		this.LoadNotifications();
		
		this.LoadUpcomingAgenda();

		this.LoadActivityFeed();
		
	}
	
	ionViewDidEnter() {
		
		console.log('Home: ionViewDidEnter: HomePage');
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var LoginName = this.localstorage.getLocalValue('LoginName');

		var AutoSync = this.localstorage.getLocalValue('AutoSync');
		var DirectChatMonitoring = this.localstorage.getLocalValue('DirectChatMonitoring');
		
		//AutoSync = '0';	// Disabling Autosync while I verify changes under Ionic 4 [John Black]
		
		// Check to start AutoSync if not running a browser and user is logged in
		//if ((this.DevicePlatform != "Browser") && (AttendeeID !== null && AttendeeID != '')) {
		if (this.DevicePlatform != "Browser") {
			
			// If AutoSync = 0 then it has been disabled
			if (AutoSync != '0') {
				
				var LastDirectChatCheck = this.localstorage.getLocalValue('LastDirectChatCheck');
				if (LastDirectChatCheck == '' || LastDirectChatCheck === null) {
					LastDirectChatCheck = '2019-09-01T00:00:01Z';
				}

				if (AutoSync == '' || AutoSync == null) {

					console.log('Home: First AutoSync');

					// Set localstorage value with length in minutes
					this.localstorage.setLocalValue('AutoSync', '10');
					// First time startup of AutoSync
					this.startAutoSync();
					
				} else {
					
					// Reset AutoSync when entering the Home page (either from fresh start
					// or coming back within the same instance of the app)
					this.stopAutoSync();
					this.startAutoSync();
					
				}
			
			}
		
		} else {
		
			console.log('Home: AutoSync disabled because platform is browser');
			
		}
	
		// Check on first run in order to reset AutoSync
		var AutoSyncReset = this.localstorage.getLocalValue('AutoSyncReset');
		
		if (AutoSyncReset == '' || AutoSyncReset == null) {

			// If first run, check if platform is not web browser			
			if (this.DevicePlatform != "Browser") {
				
				// Reset AutoSync and then disable this section of code by setting 
				// the localstorage value to 1
				this.localstorage.setLocalValue('AutoSyncReset', '1');		
			
			}
			
		}

		// If DirectChatMonitoring = 0 then it has been disabled
		//DirectChatMonitoring = '0';
		if (DirectChatMonitoring != '0') {
			
			if (DirectChatMonitoring == '' || DirectChatMonitoring == null) {

				console.log('Home: First DirectChatMonitoring');

				// Set localstorage value with length in minutes
				this.localstorage.setLocalValue('DirectChatMonitoring', '10');
				// First time startup of DirectChatMonitoring
				this.startDirectChatMonitoring();
				
			} else {
				
				// Reset DirectChatMonitoring when entering the Home page (either from fresh start
				// or coming back within the same instance of the app)
				this.stopDirectChatMonitoring();
				this.startDirectChatMonitoring();
				
			}
		
		}
	
	}
	
	LoadActivityFeed() {
		
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
				
				for (var i = 0; i < 3; i++) {
					
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
	
	LoadNotifications() {
		
		// Temporary use variables
		this.NotificationListing = [];
		var flags;
		var visReceivedDate;
		var visReceivedTime;
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		flags = "pn|0";
		
		this.databaseprovider.getMessagingData(flags, AttendeeID).then(data => {
			
			console.log("getMessagingData: " + JSON.stringify(data));

			if (data['length']>0) {
				
				for (var i = 0; i < 3; i++) {
					
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
	
	LoadUpcomingAgenda() {
		
		// Temporary use variables
		var flags;
		var visStartTime;
		var visEndTime;
		var eventIcon;
		var visEventName;
		var maxRecs;
		
		// Get the data
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		
		if (AttendeeID != '' && AttendeeID != null) {

			flags = "li2|0";
			
			this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
				
				console.log('AppComponents: Getting agenda data for side menu');

				if (data['length']>0) {
					
					this.upcomingAgendaItems = [];

					console.log('AppComponents: Looping through data for side menu');
					
					if (data['length'] > 4) {
						maxRecs = 3;
					} else {
						maxRecs = data['length'];
					}
					
					for (var i = 0; i < maxRecs; i++) {

						var educationHeader = "";
						var dbEventDateTime = data[i].EventDate.substring(5, 10);
						var DisplayDateTime = dbEventDateTime.replace(/-/g, '/');

						visStartTime = formatTime(data[i].EventStartTime);
						visEndTime = formatTime(data[i].EventEndTime);
						
						DisplayDateTime = DisplayDateTime + " from " + visStartTime + " to " + visEndTime;
						
						if (data[i].mtgID == "0") {
							eventIcon = "time";
							visEventName = data[i].EventName;
						} else {
							eventIcon = "list-box";
							visEventName = data[i].EventName;
						}
						//console.log('AppComponents: Setting icon to: ' + eventIcon);
						//console.log('AppComponents: Setting name to: ' + visEventName);
						//console.log('AppComponents: Setting EventID to: ' + data[i].EventID);

						educationHeader = '' + visEventName; // + '' + DisplayDateTime + ' ' + data[i].EventLocation + '';
						
						this.upcomingAgendaItems.push({
							DisplayEducationHeader: educationHeader,
							EventName: visEventName,
							visEventTimeframe: DisplayDateTime,
							visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
							EventLocation: data[i].EventLocation,
							eventTypeIcon: eventIcon
						});

					}


				} else {
					
					this.upcomingAgendaItems = [];

					this.upcomingAgendaItems.push({
						DisplayEducationHeader: "No upcoming agenda entries",
						EventName: "No upcoming agenda entries",
						visEventTimeframe: "",
						EventLocation: "",
						visEventID: "'0|0'",
						eventTypeIcon: "remove-circle"
					});

				}

				this.cd.markForCheck();
				
			}).catch(function () {
				console.log("AppComponents: Promise Rejected");
			});
						
		} else {
			
			this.upcomingAgendaItems = [];

			this.upcomingAgendaItems.push({
				EventName: "You need to be logged in to see your agenda",
				visEventTimeframe: "",
				EventLocation: "",
				visEventID: "'0|0'",
				eventTypeIcon: "remove-circle"
			});
			
			this.cd.markForCheck();
			
		}

	}
	
	NavigateToAuthenticatedPage(PageID) {
		
		console.log('Home: Navigating to ' + PageID);

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		if (AttendeeID !='' && AttendeeID != null) {

			this.localstorage.setLocalValue('LoginWarning', '0');
			this.localstorage.setLocalValue('ForwardingPage', '');
			switch(PageID) {
				case "MyAgenda":
					this.navCtrl.navigateForward('/myagenda');
					break;
				case "Notes":
					this.navCtrl.navigateForward('/notes');
					break;
				case "Bookmarks":
					this.navCtrl.navigateForward('/attendeesbookmarks');
					break;
				case "Networking":
					this.navCtrl.navigateForward('/networking');
					break;
				case "Speakers":
					this.navCtrl.navigateForward('/speakers');
					break;
				case "Exhibitors":
					this.navCtrl.navigateForward('/exhibitors');
					break;
				case "Sponsors":
					this.navCtrl.navigateForward('/sponsors');
					break;
				case "ActivityFeed":
					var flags = "cn";

					this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
						
						if (data[0].Status == "Connected") {
							
							// Navigate to Activity Feed page
							this.localstorage.setLocalValue('ActivityFeedID', '0');
							this.navCtrl.navigateForward('/activity');
						
						} else {

							this.internetRequired();
						
						}
						
					});
					break;
			}
			
		} else {
			
			this.localstorage.setLocalValue('ForwardingPage', PageID);
			this.localstorage.setLocalValue('LoginWarning', '1');
			this.navCtrl.navigateForward('/login');

		}
			
	
	}

	NavigateToLoginPage() {
		
		this.localstorage.setLocalValue('LoginWarning', '0');
		this.localstorage.setLocalValue('ForwardingPage', '');
		this.navCtrl.navigateForward('/login');
	
	}

	startDirectChatMonitoring() {

		console.log('Start Direct Chat Monitoring');
		// Set sync interval
		// Entry is in milliseconds
		// 600000 for every 10 minutes
		// 60000 for every minute
		// 30000 for every 30 seconds (for testing)

		this.DCsubscription = Observable.interval(10000).subscribe(x => {

			// Previously successful sync time
			var LastDirectChatCheck = this.localstorage.getLocalValue('LastDirectChatCheck');
			if (LastDirectChatCheck == '' || LastDirectChatCheck === null) {
				LastDirectChatCheck = '2019-10-31T00:00:01Z';
			}
			
			// Current sync time in UTC
			var ThisDirectChatCheck2 = new Date().toUTCString();
			var ThisDirectChatCheck = dateFormat(ThisDirectChatCheck2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
			//var ThisDirectChatCheck = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
			
			console.log('Home: Direct Chat Monitoring event: ' + this.i);
			this.i++;
			
			// Call AutoSync service in providers
			this.syncprovider.DirectChatMonitor(LastDirectChatCheck, ThisDirectChatCheck).then(data => {
				//console.log('Home: Executed Direct Chat Monitoring');
				
				this.localstorage.setLocalValue('DirectChatMonitoringString', JSON.stringify(data));
				
				if (data[0].NewMessages == "0") {
					//console.log('No new messages');
					if (this.NewMessagesIndicator != false) {
						this.NewMessagesIndicator = false;
						this.cd.markForCheck();
					}
				} else {
					//console.log('New messages!');
					if (this.NewMessagesIndicator != true) {
						this.NewMessagesIndicator = true;
						this.cd.markForCheck();
					}
				}
				
				// Update LastSync date for next run
				//this.localstorage.setLocalValue('LastDirectChatCheck', ThisDirectChatCheck);
			}).catch(function () {
				console.log("Home: Direct Chat Monitoring Promise Rejected");
			});

		});
	}

	stopDirectChatMonitoring() {

		if (this.DCsubscription != null) {
			console.log('Home: Stop Direct Chat Monitoring');
			this.DCsubscription.unsubscribe();
		}
		
	}
	
	startAutoSync() {

		console.log('Start AutoSync');
		// Set sync interval
		// Entry is in milliseconds
		// 600000 for every 10 minutes
		// 60000 for every minute
		// 30000 for every 30 seconds (for testing)
		var DefaultSyncStart = this.localstorage.getLocalValue('DefaultSyncStart');

		this.subscription = Observable.interval(30000).subscribe(x => {
		
			// Previously successful sync time
			var LastSync3 = this.localstorage.getLocalValue('LastSync');
			if (LastSync3 == '' || LastSync3 === null) {
				LastSync3 = DefaultSyncStart;
			}
			var LastSync2 = new Date(LastSync3).toUTCString();
			var LastSync = dateFormat(LastSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
			
			// Current sync time in UTC
			var ThisSync2 = new Date().toUTCString();
			var ThisSync = dateFormat(ThisSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");

			console.log('Home: AutoSync event: ' + this.i);
			console.log('Sync period: ' + LastSync + ' to ' + ThisSync);
			this.i++;
			
			// Call AutoSync service in providers
			this.syncprovider.DBSyncUpdateM2S(LastSync, ThisSync).then(data => {
				console.log('Home: Executed UpdateM2S Sync: ' + data);
				// Update LastSync date for next run
				this.localstorage.setLocalValue('LastSync', ThisSync);
			}).catch(function () {
				console.log("Home: UpdateM2S Sync Promise Rejected");
			});
			
			this.syncprovider.DBSyncUpdateS2M(LastSync, ThisSync).then(data => {
				console.log('Home: Executed UpdateS2M Sync: ' + data);
				// Update LastSync date for next run
				this.localstorage.setLocalValue('LastSync', ThisSync);
			}).catch(function () {
				console.log("Home: UpdateS2M Sync Promise Rejected");
			});
			
		});
	}
	
	stopAutoSync() {

		if (this.subscription != null) {
			console.log('Home: Stop AutoSync');
			this.subscription.unsubscribe();
		}
		
	}
	
	AddPosting() {
		
		// Disable other click event
		this.localstorage.setLocalValue('afFABClicked', '1');
		
		console.log('Set FAB Override, AddPosting');
		
		this.openAddPostingModal();

	}

	ViewLeaderboard() {
		
		// Disable other click event
		this.localstorage.setLocalValue('afFABClicked', '1');

		console.log('Set FAB Override, ViewLeaderboard');
		
		this.openLeaderboardModal();
		
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

	async openAddPostingModal() {

		const modal = await this.modal.create({
			  component: ActivityFeedPostingPage,
			  componentProps: {
				 enableBackdropDismiss: false
			  }
		});
		 
		modal.onDidDismiss().then((data) => {
		   this.localstorage.setLocalValue('afFABClicked', '0');
		});
		
		await modal.present();

	}

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

    EventDetails(EventID) {
		
		console.log("AppComponents: Btn ID: " + EventID);
		
        var IDSplit = EventID.split("|");

        var storeEventID = IDSplit[0].replace("'","");
        var storePersonalEventID = IDSplit[1].replace("'", "");
		console.log("AppComponents: storeEventID: " + storeEventID);
		console.log("AppComponents: storePersonalEventID: " + storePersonalEventID);

        if (storeEventID == "0" && storePersonalEventID == "0") {
            // Do nothing
        } else {
            if (storeEventID == "0") {

                // Set EventID to LocalStorage
				this.localstorage.setLocalValue('PersonalEventID', storePersonalEventID);

                // Navigate to Personal Event Details page
				this.navCtrl.navigateForward('/myagendapersonal/' + storePersonalEventID);

            } else {

                // Set EventID to LocalStorage
				this.localstorage.setLocalValue('EventID', storeEventID);

                // Navigate to Education Details page
				this.navCtrl.navigateForward('/educationdetails/' + storeEventID);

			}

        }
    };

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
	
};





