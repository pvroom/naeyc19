// Components, functions, plugins
import { Component, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, NgModule,  ErrorHandler, Injectable, Injector } from '@angular/core';
import { NavController, LoadingController, Events, Platform, AlertController, IonicModule, MenuController  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { RouterEvent, Router } from '@angular/router';
//import { File } from '@ionic-native/file/ngx';


// Providers
import { DatabaseService } from './services/database.service';
import { LocalstorageService } from './services/localstorage.service';
import { SynchronizationService } from './services/synchronization.service';
import { RelativeTimePipe } from './pipes/relative-time.pipe';

declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  //encapsulation: ViewEncapsulation.None
})

export class AppComponent {
	public appMenu = [

		{title: 'Home',url: '/home',icon: 'home'},
		{title: 'Program',url: '/program',icon:"list-box"},
		{title: 'My Agenda',url: '/myagenda',icon: 'calendar'},
		{title: 'Presenters',url: '/speakers',icon: 'mic'},
		{title: 'Exhibitors',url: '/exhibitors',icon: 'people'},
		{title: 'Networking',url: '/networking',icon: 'calendar'},
		{title: 'Sponsors',url: '/sponsors',icon: 'ribbon'},
		{title: 'Bookmarks',url: '/attendeesbookmarks',icon: 'bookmark'},
		{title: 'Nashville',url: '/conferencecity',icon: 'home'},
		{title: 'Maps',url: '/map',icon: 'map'},
		{title: 'Social Media',url: '/social',icon: 'at'},
		{title: 'Notes',url: '/notes',icon: 'create'},
		{title: 'Help',url: '/help',icon:"help-circle"},
		{title: 'More',url: '/more',icon: 'more'},
		{title: 'Login',url: '/login',icon: 'log-in'},
		//{title: 'Notes Details',url: '/notesdetails',icon: 'calendar'},
		//{title: 'Activity', url: '/activity', icon: 'chatboxes'},
		//{title: 'Conversation',url: '/conversation', icon: 'chatbubbles'},
		//{title: 'Full Agenda',url: '/fullagenda',icon: 'home'},
		//{title: 'Floor Plan Mapping',url: '/floorplanmapping',icon: 'home'},
		//{title: 'Speaker Details',url: '/speakerdetails',icon: 'home'},
		//{title: 'Personal Agenda',url: '/myagendapersonal',icon: 'calendar'},
		//{title: 'Search by Topic',url: '/searchbytopic',icon: 'calendar'},
		//{title: 'Review',url: '/review',icon: 'calendar'},
		//{title: 'Notifications',url: '/notifications',icon: 'calendar'},
		//{title: 'Exhibitor Details',url: '/exhibitordetails',icon: 'calendar'},
		//{title: 'Activity Feed Comment',url: '/activityfeedcomment',icon: 'calendar'},
		//{title: 'Activity Feed Details',url: '/activityfeeddetails',icon: 'calendar'},
		//{title: 'Activity Feed Leaderboard',url: '/activityfeedleaderboard',icon: 'calendar'},
		//{title: 'Activity Feed Posting',url: '/activityfeedposting',icon: 'calendar'},
		//{title: 'Attendee Bookmarks',url: '/attendeesbookmarks',icon: 'calendar'},
		//{title: 'Attendees Profile',url: '/attendeesprofile',icon: 'calendar'},
		//{title: 'Conversations',url: '/conversations',icon: 'calendar'},
		//{title: 'Database',url: '/database',icon: 'calendar'},
		//{title: 'Education Details',url: '/educationdetails',icon: 'calendar'},
		//{title: 'Evaluation Conference',url: '/evaluationconference',icon: 'calendar'},
		//{title: 'Evaluation Workshop',url: '/evaluationworkshop',icon: 'calendar'},
		//{title: 'Evaluation Lecture',url: '/evaluationlecture',icon: 'calendar'},
		//{title: 'Listing Level 1',url: '/listinglevel1',icon: 'calendar'},
		//{title: 'Modal',url: '/modal',icon: 'calendar'},
		//{title: 'Speaker Details',url: '/speakerdetails',icon: 'calendar'},

	];

	public SelectedPath = '';

	public DevicePlatform: string;
	public pnTitle: string;
	public pnMessage: string;
	public upcomingAgendaItems: any[] = [];
	public items: any = [];
	
	constructor(
				private platform: Platform,
				private router: Router,
				private splashScreen: SplashScreen,
				private statusBar: StatusBar,
				public loadingCtrl: LoadingController,
				public storage: Storage,
				public alertCtrl: AlertController, 
				private oneSignal: OneSignal,
				// private IonicPro: Pro,
				public navCtrl: NavController,
				public events: Events,
				public menuCtrl: MenuController,
				private cd: ChangeDetectorRef,
				private keyboard: Keyboard,
				private databaseprovider: DatabaseService,
				private syncprovider: SynchronizationService,
				private localstorage: LocalstorageService

	) {

		this.initializeApp();

		// Listen for login/logout events and 
		// refresh side menu dashboard
		this.events.subscribe('user:Status', (LoginType) => {
			console.log('AppComponents: User has:', LoginType);
			this.LoadSideMenuDashboard();
		});

		// Used for expanding accordion control
		this.router.events.subscribe((event: RouterEvent) => {
			
			this.SelectedPath = event.url;

			this.items = [
				{ expanded: false },
			]
		});

	}


	// Used for expanding accordion control
	expandItem(item): void {
		if (item.expanded) {
			item.expanded = false;
		} else {
			this.items.map(listItem => {
				if (item == listItem) {
					listItem.expanded = !listItem.expanded;
				} else {
					listItem.expanded = false;
				}
				return listItem;
			});
		}
	}


	LoadSideMenuDashboard() {
		
		console.log('AppComponents: LoadSideMenuDashboard');
		
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

	initializeApp() {
		this.platform.ready().then(() => {

	//Set status bar appearance
	 this.statusBar.overlaysWebView(false);
	 this.statusBar.backgroundColorByHexString('#0F3B5F');
	 this.statusBar.styleLightContent();
	  
	 	//Open side menu at page loading
		 this.menuCtrl.open();

			console.log('AppComponents: initializeApp accessed');

			// Set default value
			this.DevicePlatform = "Browser";

			// Determine if we are running on a device
			if (this.platform.is('android')) {
				console.log("AppComponents: Running on Android device");
				this.DevicePlatform = "Android";
			}
			if (this.platform.is('ios')) {
				console.log("AppComponents: Running on iOS device");
				this.DevicePlatform = "iOS";
			}
				
			// If running on a device, register/initialize Push service
			console.log('AppComponents: Check device for push setup');
			if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {

				console.log('AppComponents: Running on a device');
				
				this.initOneSignalNotification();

			} else {
				
				console.log('AppComponents: Running in a browser');
				
			}

			this.LoadSideMenuDashboard();

			// Set default sync starting point here.  Update this value each time the database
			// is refreshed or syncs get too big and slow down the app
			this.localstorage.setLocalValue('DefaultSyncStart','2019-10-31T22:45:01Z');
			// Set user sync starting point here.
			this.localstorage.setLocalValue('UserSyncStart','2019-10-31T22:45:01Z');

			// Set current database version here.  Update this value each time the database
			// is refreshed or syncs get too big and slow down the app
			this.localstorage.setLocalValue('databaseVersion','4.0');

			console.log('AppComponents: Hiding splash screen');
			this.splashScreen.hide();

		});
	}

	async appPushNotification() {
		const alert = await this.alertCtrl.create({
			header: this.pnTitle,
			message: this.pnMessage,
			buttons: ['OK']
		});

		await alert.present();
	}



	// OneSignal Push
	initOneSignalNotification()
	{
		console.log('AppComponents: Setting up OneSignal');
		
		this.oneSignal.startInit('ba7a3ced-935a-4469-9933-ed50b3090b0f', '177266994385');

		this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

		this.oneSignal.handleNotificationReceived().subscribe((data) => {
			// do something when notification is received
			console.log('oneSignal.handleNotificationReceived: Message received');
			console.log('oneSignal.handleNotificationReceived: ' + JSON.stringify(data));
			var pnTitle = data.payload.title;
			var pnMessage = data.payload.body;
			console.log('Title: ' + data.payload.title);
			console.log('Body: ' + data.payload.body);
			
			var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
			var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
			
			var flags = "ps|0|0|" + pnTitle + "|" + pnMessage + "|" + CurrentDateTime;
			
			this.databaseprovider.getMessagingData(flags, AttendeeID).then(data2 => {
				console.log("getMessagingData: " + JSON.stringify(data2));
			}).catch(function () {
				console.log("OneSignal Promise Rejected");
			});
		});

		this.oneSignal.handleNotificationOpened().subscribe((data) => {
			// Show the message in full if the app was not in focus when received.
			console.log('oneSignal.handleNotificationOpened: ' + data.notification.payload.title);
			//console.log('AppFocus: ' + data.notification.isAppInFocus);
			//console.log('Title: ' + data.notification.payload.title);
			//console.log('Body: ' + data.notification.payload.body);
			if (data.notification.isAppInFocus == false) {
				this.pnTitle = data.notification.payload.title;
				this.pnMessage = data.notification.payload.body;
				this.appPushNotification();
			}
		});

		// Only turn this line on when doing development work
		// It sends very verbose messages to the screen for each event received
		//this.oneSignal.setLogLevel({logLevel: 6, visualLevel: 6});
		
		this.oneSignal.endInit();

		//this.oneSignal.sendTag("LoginID","900000");
		
		this.oneSignal.getIds().then((id) => {
			//console.log('OneSignal IDs: ' + JSON.stringify(id));
			console.log('PlayerID: ' + id.userId);
			this.localstorage.setLocalValue('PlayerID', id.userId);
		});
	
		//this.oneSignal.getTags(function(tags) {
		//	console.log('OneSignal tags: ' + JSON.stringify(tags));
		//});
		
		console.log('AppComponents: OneSignal setup complete');
	}
	
	GetInitialDatabaseSync() {

		// Previously successful sync time
		var DefaultSyncStart = this.localstorage.getLocalValue('DefaultSyncStart');
		var LastSync3 = this.localstorage.getLocalValue('LastSync');
		if (LastSync3 == '' || LastSync3 === null) {
			LastSync3 = DefaultSyncStart;
		}
		var LastSync2 = new Date(LastSync3).toUTCString();
		var LastSync = dateFormat(LastSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
		
		// Current sync time in UTC
		var ThisSync2 = new Date().toUTCString();
		var ThisSync = dateFormat(ThisSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");

		console.log('AppComponents, Initial Sync: Sync period: ' + LastSync + ' to ' + ThisSync);
		
		// Call AutoSync service in providers
		this.syncprovider.DBSyncUpdateM2S(LastSync, ThisSync).then(data => {
			console.log('AppComponents, Initial Sync: Executed UpdateM2S Sync: ' + data);
			// Update LastSync date for next run
			this.localstorage.setLocalValue('LastSync', ThisSync);
		}).catch(function () {
			console.log("AppComponents, Initial Sync: UpdateM2S Sync Promise Rejected");
		});

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
				this.menuCtrl.close();
				this.navCtrl.navigateForward('/myagendapersonal/' + storePersonalEventID);

            } else {

                // Set EventID to LocalStorage
				this.localstorage.setLocalValue('EventID', storeEventID);

                // Navigate to Education Details page
				this.menuCtrl.close();
				this.navCtrl.navigateForward('/educationdetails/' + storeEventID);

			}

        }
    };

	openPage(page) {

		console.log('AppComponents: Selected side menu item: ' + page.title);
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		if (AttendeeID !='' && AttendeeID != null) {

			this.localstorage.setLocalValue('LoginWarning', '0');
			this.localstorage.setLocalValue('ForwardingPage', '');
			switch(page.title) {
				case "My Agenda":
					this.navCtrl.navigateForward('/myagenda');
					break;
				case "Notes":
					this.navCtrl.navigateForward('/notes');
					break;
				default:
					this.navCtrl.navigateForward(page.url);
					break;
			}
			
		} else {
			
			this.localstorage.setLocalValue('ForwardingPage', page.naventry);
			switch(page.title) {
				case "My Agenda":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.navigateForward('/login');
					break;
				case "Attendees":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.navigateForward('/login');
					break;
				case "Notes":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.navigateForward('/login');
					break;
				case "Networking":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.navigateForward('/login');
					break;
				case "Exhibitors":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.navigateForward('/login');
					break;
				case "Bookmarks":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.navigateForward('/login');
					break;
				default:
					this.navCtrl.navigateForward(page.url);
					break;
			}

		}
		
	}

}







