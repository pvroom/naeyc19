// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';

@Component({
  selector: 'app-profilepasswordchange',
  templateUrl: './profilepasswordchange.page.html',
  styleUrls: ['./profilepasswordchange.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfilePasswordChangePage {

	passwordOld: string;
	passwordNew1: string;
	passwordNew2: string;
	AlertMessage: string;
	passwordType: string = 'password';
	passwordIcon: string = 'eye-off';
	
	constructor(private storage: Storage,
				private databaseprovider: DatabaseService,
				private cd: ChangeDetectorRef,
				private modal: ModalController,
				private alertCtrl: AlertController,
				private localstorage: LocalstorageService) {
					
	}

	ngOnInit() {

	}
	
	hideShowPassword() {
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
		this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	async presentOldPasswordBlank() {
		const alert = await this.alertCtrl.create({
			header: 'Password Change',
			message: 'Your old password cannot be blank.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async presentOldPasswordIncorrect() {
		const alert = await this.alertCtrl.create({
			header: 'Password Change',
			message: 'Your old password is not correct. Please re-check and try again.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async presentNewPasswordBlank() {
		const alert = await this.alertCtrl.create({
			header: 'Password Change',
			message: 'Your new password cannot be blank.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async presentNewPasswordMatch() {
		const alert = await this.alertCtrl.create({
			header: 'Password Change',
			message: 'The new passwords do not match.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async presentPasswordUpdated() {
		const alert = await this.alertCtrl.create({
			header: 'Password Change',
			message: 'Your password has been updated.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async presentPasswordUpdateProblem() {
		const alert = await this.alertCtrl.create({
			header: 'Password Change',
			message: 'There was a problem with your entries. Either the old password is incorrect, the new one does not meet minimum requirements, or there was a problem connecting to the server. Please re-check and try again.',
			buttons: ['OK']
		});

		await alert.present();
	}

	closeScreen(UserAction) {
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		if (UserAction == "Save") {

			var saveCheck = true;
			
			console.log('saveCheck: ' + saveCheck);
			console.log('passwordOld: ' + this.passwordOld);
			console.log('passwordNew1: ' + this.passwordNew1);
			console.log('passwordNew2: ' + this.passwordNew2);
			
			if (this.passwordOld === undefined) {
				
				this.presentOldPasswordBlank();
				
				saveCheck = false;
				
			}

			if ((saveCheck == true) && (this.passwordNew1 === undefined || this.passwordNew2 === undefined)) {
				
				this.presentNewPasswordBlank();

				saveCheck = false;
				
			}

			if ((saveCheck == true) && (this.passwordNew1 != this.passwordNew2)) {
				
				this.presentNewPasswordMatch();

				saveCheck = false;
				
			}
			
			if (saveCheck == true) {

				console.log('saveCheck: ' + saveCheck);
				console.log('passwordOld: ' + this.passwordOld);
				console.log('passwordNew1: ' + this.passwordNew1);
				console.log('passwordNew2: ' + this.passwordNew2);
			
				var flags = 'pw|' + this.passwordOld + '|' + this.passwordNew1;
				
				this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
					
					console.log("getDatabaseStats: " + JSON.stringify(data));

					if (data['length']>0) {

						//console.log("Return status: " + JSON.stringify(data));
						var ReturnStatus = data[0].Status;
						
						switch(ReturnStatus) {
							case "Saved":
								this.presentPasswordUpdated();								
								this.closeModal(UserAction);
								break;
							case "Failed":
								this.presentPasswordUpdateProblem();
								break;
							case "OldFail":
								this.presentOldPasswordIncorrect();
								break;
						}
						
					}
				
				}).catch(function () {
					console.log("Password Change Promise Rejected");
				});
			
			}			
		}
		
		if (UserAction == "Cancel") {
			this.closeModal(UserAction);
		}
		
	}

	async closeModal(UserAction) {
		//const onClosedData: string = "Wrapped Up!";
		//await this.modal.dismiss(onClosedData);
		console.log('Modal close button clicked');
		await this.modal.dismiss(UserAction);
	}
}
