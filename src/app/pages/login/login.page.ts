// Components, functions, plugins
import { Component, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { ModalController, NavController, DomController, LoadingController, Events, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LocalstorageService } from './../../services/localstorage.service';
import { SynchronizationService } from './../../services/synchronization.service';



// Pages
import { LoginSamplePage } from '../loginsample/loginsample.page';

declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {

	// Setup page variables
	LoginName: string;
	LoginPassword: string;
	LoggedInUser: string = "";
	public LoginSection = false;
	public LogoutSection = false;
	public msgRequireLogin = false;
	public msgRequireLogin2 = false;
	public msgRequireLogin3 = false;
	public LoginButton = false;
	public LoginSelectButton = false;

	public login: any[] = [];
	public teammembers: any[] = [];
	
	constructor(public navCtrl: NavController, 
				public http: Http, 
				private alertCtrl: AlertController, 
				private storage: Storage,
				private domCtrl: DomController,
				private modal: ModalController,
				private cd: ChangeDetectorRef,
				private syncprovider: SynchronizationService,
				private localstorage: LocalstorageService,
				public events: Events,
				public loadingCtrl: LoadingController) {

				/* Determine currently logged in user */
				var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
				var LoginName = this.localstorage.getLocalValue('LoginFullName');
				
				if (AttendeeID == '' || AttendeeID == null) {
					console.log('LS AttendeeID blank');
					this.LoginSection = true;
					this.LogoutSection = false;
					this.msgRequireLogin3 = true;
				} else {
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.LoginSection = false;
					this.LogoutSection = true;
					this.msgRequireLogin3 = false;
				}
				
				if (LoginName != '' && LoginName != null) {
					console.log('Stored LoginName: ' + LoginName);
					this.LoggedInUser = LoginName;
				} else {
					console.log('User not logged in');
					this.LoggedInUser = '';
				}

				var WarningStatus = this.localstorage.getLocalValue("LoginWarning");
				if (WarningStatus == "1") {			// Screen requires account access
					this.msgRequireLogin = true;
					this.msgRequireLogin2 = false;
				}
				if (WarningStatus == "2") {			// Agenda requires account access
					this.msgRequireLogin = false;
					this.msgRequireLogin2 = true;
				}

	}

	SetTeamMember(event) {
		console.log("SetTeamMember function: " + JSON.stringify(event));
	}

	// If page is in Sign In mode and user hits enter (from web version 
	// or mobile keyboard), initiate LoginUser function
	@HostListener('document:keypress', ['$event'])
		handleKeyboardEvent(event: KeyboardEvent) { 
		if (event.key == 'Enter' && this.LoginSection == true) {
			console.log('Enter key detected');
			this.LoginUser();
		}
	}

	ngOnInit() {
	}
	
	
	ionViewDidEnter() {
		
	}


	async openLoginSampleModal() {

		const modal = await this.modal.create({
			  component: LoginSamplePage,
			  componentProps: {
				 enableBackdropDismiss: false
			  }
		});
		 
		//modal.onDidDismiss().then((detail: OverlayEventDetail) => {
		//   if (detail !== null) {
		//	 console.log('The result:', detail.data);
		//   }
		//});
		
		await modal.present();

	}

	ViewSample() {
		
		this.openLoginSampleModal();
		
		/*
		const LoginSampleModalOptions: ModalOptions = {
			enableBackdropDismiss: false
		};

		const LoginSampleModal: Modal = this.modal.create('LoginSamplePage', {}, LoginSampleModalOptions);

		LoginSampleModal.present();
		*/
	}

	// Alert definitions
	async appLogoutAlert() {
		const alert = await this.alertCtrl.create({
			header: 'App Logout',
			message: 'Logout successful',
			buttons: ['OK']
		});

		await alert.present();
	}

	async appLoginSuccess() {
		const alert = await this.alertCtrl.create({
			header: 'App Login',
			message: 'Login successful',
			buttons: ['OK']
		});

		await alert.present();
	}

	async appLoginAlert() {
		const alert = await this.alertCtrl.create({
			header: 'App Login',
			message: 'Both fields must be filled in before signing in.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async appLoginFail() {
		const alert = await this.alertCtrl.create({
			header: 'App Login',
			message: "We're sorry. The credentials entered could not be validated for NAEYC. Possible reasons include:<br/> 1) You're not using the Registration ID from your confirmation letter;<br/> 2) You've mistyped your Registration ID or password.",
			buttons: ['OK']
		});

		await alert.present();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	// Logout button clicked, clear stored values
	LogoutUser() {

		this.localstorage.setLocalValue('LoginName', '');
		this.localstorage.setLocalValue('LoginFullName', '');
		this.localstorage.setLocalValue('AttendeeID', '');
		this.localstorage.setLocalValue("loginUsername", '');
		this.localstorage.setLocalValue("loginPassword", '');
		this.localstorage.setLocalValue('LastSync', '');
		this.localstorage.setLocalValue("LoginNameInitials", '');
		this.LoginName = '';
		this.LoginPassword = '';
		this.LoggedInUser = "";

		this.appLogoutAlert();

		this.LoginSection = true;
		this.LogoutSection = false;
		this.msgRequireLogin3 = true;

		this.events.publish('user:Status', 'Logged Out');
		
		this.localstorage.setLocalValue('ForwardingPage', '');
		this.navCtrl.navigateRoot('/home');
		
		//var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
											
		//switch(ForwardingPage) {
		//	case "HomePage":
		//		this.navCtrl.navigateRoot('/home');
		//		this.localstorage.setLocalValue('ForwardingPage', '');
		//		break;
		//}
		
	}
	
	// Login button clicked, process input
	LoginUser() {
		
		//let loading = this.loadingCtrl.create({
		//	spinner: 'crescent',
		//	content: 'Validating login...'
		//});

		//loading.present();

		console.log("Login button clicked.");
		console.log("User name: " + this.LoginName);
		console.log("User password: " + this.LoginPassword);

		if (this.LoginName == undefined || this.LoginPassword == undefined) {
		
			//loading.dismiss();
			this.appLoginAlert();
			
		} else {
		
			// Reset stored values
			this.localstorage.setLocalValue('LoginName', '');
			this.localstorage.setLocalValue('LoginFullName', '');
			this.localstorage.setLocalValue('AttendeeID', '');
			this.localstorage.setLocalValue("loginUsername", '');
			this.localstorage.setLocalValue("loginPassword", '');
			this.localstorage.setLocalValue('LastSync', '');
			this.localstorage.setLocalValue("LoginNameInitials", '');
			
			var pushID = this.localstorage.getLocalValue('PlayerID');
			var deviceType = this.localstorage.getLocalValue('DevicePlatform');

			// Try client AMS system
			// Not available for NAEYC
			
			// Try development environment login API as a fallback
			console.log('Check development login API');
			
			var URL = 'https://naeyc.convergence-us.com/cvplanner.php?acy=Annual2019';
			URL = URL + '&action=authenticate';
			URL = URL + '&em=' + this.LoginName;
			URL = URL + '&ps=' + this.LoginPassword;
			URL = URL + '&pushID=' + pushID;
			URL = URL + '&deviceType=' + deviceType;
			
			this.http.get(URL).map(res => res.json()).subscribe(
				data => {
					console.log("API Response: " + JSON.stringify(data)); 
					console.log("Status: " + data.status);
					console.log("Attendee ID: " + data.AttendeeID);
					console.log("Attendee Full Name: " + data.AttendeeFullName);

					var initials = data.AttendeeFullName.match(/\b\w/g) || [];
					initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
					
					// Store values
					this.localstorage.setLocalValue('LoginName', this.LoginName);
					this.localstorage.setLocalValue('LoginFullName', data.AttendeeFullName);
					this.localstorage.setLocalValue('AttendeeID', data.AttendeeID);
					this.localstorage.setLocalValue("LoginNameInitials", initials);
					
					// Show response
					if (data.status=="200") {
						console.log('Login success, 200 status code received, updating left menu status');
						this.events.publish('user:Status', 'Logged In');
						this.appLoginSuccess();
					}
					var LoginName = this.localstorage.getLocalValue('LoginName');
					console.log('Retrieved LoginName: ' + LoginName);

					this.ManualSync(); 
					//this.events.publish('user:Status', 'Logged In');

					// Get forwarding page value
					var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
					this.navCtrl.navigateRoot('/home');
					/*
					switch(ForwardingPage) {
						case "MyAgenda":
							//this.navCtrl.push(MyAgenda, {}, {animate: true, direction: 'forward'}).then(() => {
							//	const startIndex = this.navCtrl.getActive().index - 1;
							//	this.navCtrl.remove(startIndex, 1);
							//});
							break;
						case "MyAgendaFull":
							//this.navCtrl.push(MyAgendaFull, {}, {animate: true, direction: 'forward'}).then(() => {
							//	const startIndex = this.navCtrl.getActive().index - 1;
							//	this.navCtrl.remove(startIndex, 1);
							//});
							break;
						case "EventSurvey":
							//this.navCtrl.push(EvaluationConference, {}, {animate: true, direction: 'forward'}).then(() => {
							//	const startIndex = this.navCtrl.getActive().index - 1;
							//	this.navCtrl.remove(startIndex, 1);
							//});
							break;
						case "CETracking":
							//this.navCtrl.push('CetrackingPage', {}, {animate: true, direction: 'forward'}).then(() => {
							//	const startIndex = this.navCtrl.getActive().index - 1;
							//	this.navCtrl.remove(startIndex, 1);
							//});
							break;
						case "Notes":
							//this.navCtrl.push(NotesPage, {}, {animate: true, direction: 'forward'}).then(() => {
							//	const startIndex = this.navCtrl.getActive().index - 1;
							//	this.navCtrl.remove(startIndex, 1);
							//});
							break;
						case "Profile":
							//this.navCtrl.push(ProfilePage, {}, {animate: true, direction: 'forward'}).then(() => {
							//	const startIndex = this.navCtrl.getActive().index - 1;
							//	this.navCtrl.remove(startIndex, 1);
							//});
							break;
						default:
							// Navigate back to Home page but eliminate Back button by setting it to Root
							this.navCtrl.navigateRoot('/home');
							//this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
							break;
					}
					*/
					//loading.dismiss();
					
				},
				err => {
					
					//loading.dismiss();
					
					this.appLoginFail();
					
					console.log("Error");
					var LoginName = this.localstorage.getLocalValue('LoginName');
					console.log('Retrieved LoginName [2]: ' + LoginName);
					
				}
			); 
	
		}
		
	}



	ManualSync() {
		
		var DPlatform = this.localstorage.getLocalValue('DevicePlatform');
		var DefaultSyncStart = this.localstorage.getLocalValue('DefaultSyncStart');
		
		if (DPlatform != 'Browser') {
		
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
		
			console.log('LoginPage: ManualSync event');
			console.log('Sync period: ' + LastSync + ' to ' + ThisSync);
			
			// Call AutoSync service in providers
			this.syncprovider.DBSyncUpdateUM2S(LastSync, ThisSync).then(data => {
				console.log('LoginPage: Executed UpdateM2S Sync: ' + data);
				// Update LastSync date for next run
				this.localstorage.setLocalValue('LastSync', ThisSync);
			}).catch(function () {
				console.log("LoginPage: UpdateM2S Sync Promise Rejected");
			});
			
			this.syncprovider.DBSyncUpdateS2M(LastSync, ThisSync).then(data => {
				console.log('LoginPage: Executed UpdateS2M Sync: ' + data);
				// Update LastSync date for next run
				this.localstorage.setLocalValue('LastSync', ThisSync);
			}).catch(function () {
				console.log("LoginPage: UpdateS2M Sync Promise Rejected");
			});
		
		}

	}

}
