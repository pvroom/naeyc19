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

	
};





