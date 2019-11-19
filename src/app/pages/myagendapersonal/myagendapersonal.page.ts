// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController,LoadingController, AlertController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';

declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'app-myagendapersonal',
  templateUrl: './myagendapersonal.page.html',
  styleUrls: ['./myagendapersonal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MyagendapersonalPage {

	public btnDelete = false;

	public agendaItempersonalEventName: string;
	public agendaItempersonalEventLocation: string;
	public agendaItempersonalDate;
	public agendaItempersonalStartTime;
	public agendaItempersonalEndTime;
	public agendaItempersonalEventDescription: string;
	public agendaItemid: string;
	
	constructor(public navCtrl: NavController, 
				private storage: Storage,
				private databaseprovider: DatabaseService,
				public loadingCtrl: LoadingController,
				private alertCtrl: AlertController,
				public events: Events,
				private router: Router,
				private cd: ChangeDetectorRef,
				private localstorage: LocalstorageService) {
					
	}

	ionViewDidLoad() {
		
		console.log('ionViewDidLoad MyAgendaPersonal');
				
	}

	ngOnInit() {

		// Load initial data set here

		//let loading = this.loadingCtrl.create({
		//	spinner: 'crescent',
		//	content: 'Please wait...'
		//});

        this.btnDelete = false;
		this.cd.markForCheck();

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var personalID = this.localstorage.getLocalValue('PersonalEventID');

        if (personalID != "0") {

			var flags = "pi|0|" + personalID + "|0|0|0|0|0|0|0";

			// Get the data
			this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
				
				console.log("getPersonalAgendaData: " + JSON.stringify(data));

				if (data['length']>0) {

                    this.agendaItempersonalEventName = data[0].EventName;
                    this.agendaItempersonalEventLocation = data[0].EventLocation;
                    this.agendaItempersonalDate = data[0].EventDate;
					if (data[0].EventStartTime === null || data[0].EventStartTime == '') {
						this.agendaItempersonalStartTime = data[0].EventStartTime;
						this.agendaItempersonalEndTime = data[0].EventEndTime;
					} else {
						this.agendaItempersonalStartTime = data[0].EventDate + 'T' + data[0].EventStartTime;
						this.agendaItempersonalEndTime = data[0].EventDate + 'T' + data[0].EventEndTime;
					}
					if (data[0].EventDescription=='undefined' || data[0].EventDescription===undefined || data[0].EventDescription === null ) {
						this.agendaItempersonalEventDescription = "";
					} else {
						this.agendaItempersonalEventDescription = data[0].EventDescription;
					}
                    this.agendaItemid = data[0].mtgID;

                    this.btnDelete = true;

					this.cd.detectChanges();
			
 					this.cd.markForCheck();
					
				}

			}).catch(function () {
				console.log("Promise Rejected");
			});
			
        }

		//loading.dismiss();

	}

    async SaveAgendaItem() {

        console.log('Process Personal Agenda Save');

		// Saving progress
		const saving = await this.loadingCtrl.create({
			spinner: 'crescent',
			message: 'Saving...'
		});

		// Alert for required fields
		const requiredalert = await this.alertCtrl.create({
			header: 'Personal Agenda Entry',
			subHeader: 'All fields except Description are required to be completed before saving.',
			buttons: ['Ok']
		});

		// Alert for successful save
		const savealert = await this.alertCtrl.create({
			header: 'Personal Agenda Entry',
			subHeader: 'Personal Agenda entry has been saved.',
			buttons: ['Ok']
		});

		// Alert for failed save
		const failalert = await this.alertCtrl.create({
			header: 'Personal Agenda Entry',
			subHeader: 'Unable to save your Personal Agenda entry at this time - please try again in a little bit.',
			buttons: ['Ok']
		});

		// Show saving progress
		await saving.present();

        var personalID = this.localstorage.getLocalValue('PersonalEventID');
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

        var ControlDate;
        var StartTime = "";
        var EndTime = "";
        var EventDate = "";

        // Validation checks
        var ValidationPass = true;

		// Diagnostics
		console.log('Personal Agenda Save, agendaItempersonalEventName: ' + this.agendaItempersonalEventName);
		console.log('Personal Agenda Save, agendaItempersonalEventLocation: ' + this.agendaItempersonalEventLocation);
		console.log('Personal Agenda Save, agendaItempersonalDate: ' + this.agendaItempersonalDate);
		console.log('Personal Agenda Save, agendaItempersonalStartTime: ' + this.agendaItempersonalStartTime);
		console.log('Personal Agenda Save, agendaItempersonalEndTime: ' + this.agendaItempersonalEndTime);
		
		console.log('Personal Agenda Save: Validating entries');
		
		console.log('Personal Agenda Save, Validating entries, agendaItempersonalEventName');
        if (this.agendaItempersonalEventName == null || this.agendaItempersonalEventName == "") {
            ValidationPass = false;
        }
		console.log('Personal Agenda Save, Validating entries, agendaItempersonalEventLocation');
        if (this.agendaItempersonalEventLocation == null || this.agendaItempersonalEventLocation == "") {
            ValidationPass = false;
        }
		console.log('Personal Agenda Save, Validating entries, agendaItempersonalDate');
        if (this.agendaItempersonalDate == null || this.agendaItempersonalDate == "") {
            ValidationPass = false;
        }
		console.log('Personal Agenda Save, Validating entries, agendaItempersonalStartTime');
        if (this.agendaItempersonalStartTime == null || this.agendaItempersonalStartTime == "") {
            ValidationPass = false;
        }
		console.log('Personal Agenda Save, Validating entries, agendaItempersonalEndTime');
        if (this.agendaItempersonalEndTime == null || this.agendaItempersonalEndTime == "") {
            ValidationPass = false;
        }
		console.log('Personal Agenda Save, Validating status: ' + ValidationPass);
        if (ValidationPass == false) {
			
			saving.dismiss();
			await requiredalert.present();

        } else {

            // Get last update performed by this app
			console.log('Personal Agenda Save: Get last update performed by this app');
			var LastSync3 = this.localstorage.getLocalValue('LastSync');
			if (LastSync3 == '' || LastSync3 === null) {
				LastSync3 = '2018-09-01T00:00:01Z';
			}
			var LastSync2 = new Date(LastSync3).toUTCString();
			var LastUpdateDate = dateFormat(LastSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
			
            // Date formatting
			console.log('Personal Agenda Save: Format dates entered');
            //ControlDate = new Date(this.agendaItempersonalDate + "T" + this.agendaItempersonalStartTime + ":00");
            //StartTime = dateFormat(ControlDate, "HH:MM:ss");
            //StartTime = this.agendaItempersonalStartTime + ":00";
			console.log('Personal Agenda Save, Start time entered: ' + this.agendaItempersonalStartTime);
			StartTime = dateFormat(this.agendaItempersonalStartTime, "HH:MM:ss");
			console.log('Personal Agenda Save, Start time: ' + StartTime);

            //ControlDate = new Date(this.agendaItempersonalDate + "T" + this.agendaItempersonalEndTime + ":00");
            //EndTime = dateFormat(ControlDate, "HH:MM:ss");
            //EndTime = this.agendaItempersonalEndTime + ":00";
			console.log('Personal Agenda Save, End time entered: ' + this.agendaItempersonalEndTime);
			EndTime = dateFormat(this.agendaItempersonalEndTime, "HH:MM:ss");
			console.log('Personal Agenda Save, End time: ' + EndTime);

			console.log('Personal Agenda Save, Date entered: ' + this.agendaItempersonalDate);
			var PersonalItemDate = dateFormat(this.agendaItempersonalDate, "yyyy-mm-dd");
			//var PersonalItemDate = this.agendaItempersonalDate;
			console.log('Personal Agenda Save, Date: ' + PersonalItemDate);

			var flags = "ps|0|" + personalID + "|" + StartTime + "|" + EndTime + "|" + this.agendaItempersonalEventLocation + "|" + this.agendaItempersonalEventName + "|" + PersonalItemDate + "|0|" + LastUpdateDate + "|" + this.agendaItempersonalEventDescription;
			console.log('Save personal flags: ' + flags);
			
			this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
				
				console.log("getAgendaData: " + JSON.stringify(data));

				if (data['length']>0) {
					
					if (data[0].PEStatus == "Success") {
						// Saved
						this.events.publish('user:Status', 'Personal Agenda Save/Update');
						saving.dismiss();
						//await savealert.present();
						this.navCtrl.navigateBack('/myagenda');
					} else {
						// Not saved
						console.log("Query: " + data[0].PEQuery);
						saving.dismiss();
						//await failalert.present();
					}
					
				} else {
					
					// Not saved
					console.log("No query to show");
					saving.dismiss();
					//await failalert.present();
					
				}

			}).catch(function () {
				console.log("Promise Rejected");
			});
		
        }
    }
	
    async DeleteAgendaItem() {

        console.log('Process Personal Agenda Delete');

		// Deleting progress
		const deleting = await this.loadingCtrl.create({
			spinner: 'crescent',
			message: 'Deleting...'
		});

		// Alert for successful delete
		const deletealert = await this.alertCtrl.create({
			header: 'Personal Agenda Entry',
			subHeader: 'Personal Agenda entry has been deleted.',
			buttons: ['Ok']
		});

		// Alert for failed delete
		const failalert = await this.alertCtrl.create({
			header: 'Personal Agenda Entry',
			subHeader: 'Unable to delete your Personal Agenda entry at this time - please try again in a little bit.',
			buttons: ['Ok']
		});

		const confirmAlert = await this.alertCtrl.create({
			header: 'Delete Personal Agenda',
			message: 'Are you sure you want to delete this agenda item?',
			buttons: [
				{
					text: 'No',
					handler: () => {
						console.log('User chose to keep agenda item');
						//this.confirmAlert.dismiss();
					}
				},
				{
					text: 'Yes',
					handler: () => {
						console.log('User chose to delete agenda item');
						var personalID = this.localstorage.getLocalValue('PersonalEventID');
						var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

						// Get last update performed by this app
						var LastUpdateDate = this.localstorage.getLocalValue("LastUpdateDate");
						if (LastUpdateDate == null) {
							// If never, then set variable and localStorage item to NA
							LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
							this.localstorage.setLocalValue("LastUpdateDate", LastUpdateDate);
						}

						var flags = "pd|0|" + personalID + "|0|0|0|0|0|0|" + LastUpdateDate + "|0";
						console.log('Delete personal flags: ' + flags);
						
						this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
							
							console.log("getAgendaData: " + JSON.stringify(data));

							if (data['length']>0) {
								
								if (data[0].PEStatus == "Success") {
									// Saved
									this.events.publish('user:Status', 'Personal Agenda Delete');
									confirmAlert.dismiss();
									//deletealert.present();
									this.navCtrl.navigateBack('/myagenda');
								} else {
									// Not saved
									console.log("Query: " + data[0].PEQuery);
									confirmAlert.dismiss();
									//failalert.present();
								}
								
							} else {
								
								// Not saved
								console.log("No query to show");
								confirmAlert.dismiss();
								//failalert.present();
								
							}

						}).catch(function () {
							console.log("Promise Rejected");
						});
					}
				}
			]
		});

		// Show saving progress
		await confirmAlert.present();
  
    }	

  

}


