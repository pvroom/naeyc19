// Components, functions, plugins
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';

declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'app-evaluationworkshop',
  templateUrl: './evaluationworkshop.page.html',
  styleUrls: ['./evaluationworkshop.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EvaluationWorkshopPage implements OnInit {
	ngOnInit(): void {
		throw new Error("Method not implemented.");
	}
	
	// Eval header variables
	public DisplayEventName: string;
	public DisplayEventTimeDateLocation: string;
	
	// Eval question variables
	public CEEvaluationQ11: string;
	public CEEvaluationQ12: string;
	public CEEvaluationQ21: string;
	public CEEvaluationQ22: string;
	public CEEvaluationQ23: string;
	public CEEvaluationQ24: string;
	public CEEvaluationQ25: string;
	public CEEvaluationQ26: string;
	public CEEvaluationQ31: string;
	public CEEvaluationQ32: string;
	public CEEvaluationQ33: string;
	public CEEvaluationQ41: string;
	
	constructor(public navCtrl: NavController, 
				private nav: NavController,
				public cd: ChangeDetectorRef,
				private storage: Storage,
				public loadingCtrl: LoadingController,
				private alertCtrl: AlertController,
				private databaseprovider: DatabaseService,
				private localstorage: LocalstorageService) {

	}

	mcqAnswer(value){
	   console.log(value);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad: EvaluationWorkshop');
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var EventID = this.localstorage.getLocalValue('EventID');

        var dbEventDateTime;
        var SQLDate;
        var DisplayDateTime;
		var flags;
		this.CEEvaluationQ11 = "";
		this.CEEvaluationQ12 = "";
		this.CEEvaluationQ21 = "";
		this.CEEvaluationQ22 = "";
		this.CEEvaluationQ23 = "";
		this.CEEvaluationQ24 = "";
		this.CEEvaluationQ25 = "";
		this.CEEvaluationQ26 = "";
		this.CEEvaluationQ31 = "";
		this.CEEvaluationQ32 = "";
		this.CEEvaluationQ33 = "";
		this.CEEvaluationQ41 = "";
		
		flags = "ei|" + EventID + "|Workshop|0|0|0|0|0|0|0|0|0|0|0|0|0|0";
		
		this.databaseprovider.getEvaluationData(flags, AttendeeID).then(data => {
			
			console.log("getEvaluationData: " + JSON.stringify(data));

			if (data['length']>0) {
				
                dbEventDateTime = data[0].session_start_time.substring(0, 19);
                dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                SQLDate = new Date(dbEventDateTime);
                DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");

                // Display end time
                dbEventDateTime = data[0].session_end_time.substring(0, 19);
                dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                SQLDate = new Date(dbEventDateTime);
                DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");

                this.DisplayEventName = data[0].session_title;
                this.DisplayEventTimeDateLocation = DisplayDateTime + " in " + data[0].RoomName;

				this.CEEvaluationQ11 = data[0].Q11;
				this.CEEvaluationQ12 = data[0].Q12;
				this.CEEvaluationQ21 = data[0].Q21;
				this.CEEvaluationQ22 = data[0].Q22;
				this.CEEvaluationQ23 = data[0].Q23;
				this.CEEvaluationQ24 = data[0].Q24;
				this.CEEvaluationQ25 = data[0].Q25;
				this.CEEvaluationQ26 = data[0].Q26;
				this.CEEvaluationQ31 = data[0].Q31;
				this.CEEvaluationQ32 = data[0].Q32;
				this.CEEvaluationQ33 = data[0].Q33;
				this.CEEvaluationQ41 = data[0].Q41 || '';
				
				this.cd.markForCheck();

			}
			
		}).catch(function () {
			console.log("Promise Rejected");
		});
	}

	// Alert definitions
	async savealert() {
		const alert = await this.alertCtrl.create({
			header: 'Evaluation',
			message: 'Evaluation has been saved.',
			buttons: ['OK']
		});

		await alert.present();
	}
	
	async failedalert() {
		const alert = await this.alertCtrl.create({
			header: 'Evaluation Entry',
			message: 'Unable to save your evaluation at this time - please try again in a little bit.',
			buttons: ['OK']
		});

		await alert.present();
	}
	
	async requiredalert() {
		const alert = await this.alertCtrl.create({
			header: 'Evaluation Entry',
			message: 'All questions in blocks 1, 2 and 3 are required to be completed before saving.',
			buttons: ['OK']
		});

		await alert.present();
	}
	
	async requiredalert2() {
		const alert = await this.alertCtrl.create({
			header: 'Evaluation Entry',
			message: 'All questions are required to be completed before saving.  Some questions, when selecting No, require an additional comment to be entered.',
			buttons: ['OK']
		});

		await alert.present();
	}

	SubmitEvaluation() {
		
        console.log('Save evaluation (Workshop)...');

		// Saving progress
		let saving = this.loadingCtrl.create({
			spinner: 'crescent',
			message: 'Saving...'
		});

		// Show saving progress
//		saving.present();

		var Q11 = this.CEEvaluationQ11;
		var Q12 = this.CEEvaluationQ12;
		var Q21 = this.CEEvaluationQ21;
		var Q22 = this.CEEvaluationQ22;
		var Q23 = this.CEEvaluationQ23;
		var Q24 = this.CEEvaluationQ24;
		var Q25 = this.CEEvaluationQ25;
		var Q26 = this.CEEvaluationQ26;
		var Q31 = this.CEEvaluationQ31;
		var Q32 = this.CEEvaluationQ32;
		var Q33 = this.CEEvaluationQ33;
		var Q41 = this.CEEvaluationQ41 || '';
		var EventID = this.localstorage.getLocalValue('EventID');
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var flags;

        // Validation checks
        var ValidationPass = true;

        if (this.CEEvaluationQ11 == null || this.CEEvaluationQ11 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ12 == null || this.CEEvaluationQ12 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ21 == null || this.CEEvaluationQ21 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ22 == null || this.CEEvaluationQ22 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ23 == null || this.CEEvaluationQ23 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ24 == null || this.CEEvaluationQ24 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ25 == null || this.CEEvaluationQ25 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ26 == null || this.CEEvaluationQ26 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ31 == null || this.CEEvaluationQ31 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ32 == null || this.CEEvaluationQ32 == "") {
            ValidationPass = false;
        }
        if (this.CEEvaluationQ33 == null || this.CEEvaluationQ33 == "") {
            ValidationPass = false;
        }
        //if (this.CEEvaluationQ41 == null || this.CEEvaluationQ41 == "") {
        //    ValidationPass = false;
        //}
        if (ValidationPass == false) {
			
//			saving.dismiss();
			this.requiredalert();

        } else {

            // Get last update performed by this app
            var LastUpdateDate = this.localstorage.getLocalValue("LastUpdateDate");
            if (LastUpdateDate == null) {
                // If never, then set variable and localStorage item to NA
				LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                this.localstorage.setLocalValue("LastUpdateDate", LastUpdateDate);
            }

			flags = "es|" + EventID + "|Workshop|" + Q11 + "|" + Q12 + "|" + Q21 + "|" + Q22 + "|" + Q23 + "|" + Q24 + "|" + Q25 + "|" + Q26 + "|" + Q31 + "|" + Q32 + "|" + Q33 + "|" + Q41 + "|" + LastUpdateDate;
			console.log('Save Evaluation (Workshop) flags: ' + flags);
			
			this.databaseprovider.getEvaluationData(flags, AttendeeID).then(data => {
				
				console.log("getEvaluationData: " + JSON.stringify(data));

				if (data['length']>0) {
					
					if (data[0].EVStatus == "Success") {
						// Saved
//						saving.dismiss();
						this.savealert();
						this.navCtrl.pop();
					} else {
						// Not saved
						console.log("Query: " + data[0].EVQuery);
//						saving.dismiss();
						this.failedalert();
					}
					
				} else {
					
					// Not saved
					console.log("No query to show");
//					saving.dismiss();
					this.failedalert();
					
				}

			}).catch(function () {
				console.log("Promise Rejected");
			});

        }
		
	}

}