// Components, functions, plugins
import { Component, OnInit, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';


@Component({
  selector: 'app-speakers',
  templateUrl: 'speakers.page.html',
 // changeDetection: ChangeDetectionStrategy.OnPush
})

export class SpeakersPage implements OnInit {

	public SpeakerListing: any[] = [];
	public EntryTerms: string;
	public AllListing: any[] = [];
	public myInput:any;

	constructor(public navCtrl: NavController, 
				private storage: Storage,
				private router: Router,
				private databaseprovider: DatabaseService,
				private cd: ChangeDetectorRef,
				public loadingCtrl: LoadingController,
				private localstorage: LocalstorageService) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SpeakersPage');
	}

	onSearchTerm(ev: CustomEvent) {
		
		const val = ev.detail.value;
		console.log('Filter value: ' + val);
		
		this.SpeakerListing = this.AllListing;
		if (val && val.trim() !== '') {
			this.SpeakerListing = this.AllListing.filter(term => {
				return term.SearchField.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
			});
		}
		
		this.cd.markForCheck();
		
	}

	async ngOnInit() {

		// Load initial data set here
		const loading = await this.loadingCtrl.create({
			message: 'Loading'
		});
		await loading.present();

		// Blank and show loading info
		this.SpeakerListing = [];
		this.cd.markForCheck();
		
		// Temporary use variables
		var flags = "li|Alpha|0";
        var DisplayName = "";
		var visDisplayAdditional = "";
        var SpeakerDividerCharacter = "";
		var SearchField = "";
		
		// Get the data
		this.databaseprovider.getSpeakerData(flags, "0").then(data => {
			
			//console.log("getSpeakerData: " + JSON.stringify(data));

			if (data['length']>0) {
				
				for (var i = 0; i < data['length']; i++) {

                    DisplayName = "";

                    // Concatenate fields to build displayable name
                    DisplayName = DisplayName + data[i].LastName + ", " + data[i].FirstName;
					
                    // AACD does not have middle name/initial for speakers
                    //if (data[i].MiddleInitial != "") {
                    //    DisplayName = DisplayName + " " + data[i].MiddleInitial;
                    //}
					
					// Use Credentials field for Company/Association
					visDisplayAdditional = "";
                    if (data[i].Title != "") {
                        visDisplayAdditional = data[i].Title + "</p><p>";
						console.log('Showing title: ' + data[i].Title);
                    }
					
                    if (data[i].Company != "") {
                        visDisplayAdditional = visDisplayAdditional + data[i].Company;
						//console.log('Showing company: ' + data[i].Company);
                    }

					var imageAvatar = data[i].imageFilename;
					//imageAvatar = imageAvatar.substr(0, imageAvatar.length - 3) + 'png';
					//console.log("imageAvatar: " + imageAvatar);
					imageAvatar = "https://naeyc.convergence-us.com/AdminGateway/images/Speakers/" + imageAvatar;
					//console.log('imageAvatar: ' + imageAvatar);

					// SearchField concatenation
					SearchField = data[i].LastName + ' ';
					SearchField = SearchField + data[i].FirstName + ' ';
					SearchField = SearchField + data[i].Company + ' ';
					SearchField = SearchField + data[i].Title + ' ';
					SearchField = SearchField + data[i].Bio + ' ';
					SearchField = SearchField + data[i].Credentials + ' ';
						
                    if (data[i].LastName.charAt(0) != SpeakerDividerCharacter) {

                        // Display the divider
						this.SpeakerListing.push({
							SpeakerID: 0,
							DisplayNameLastFirst: data[i].LastName.charAt(0),
							DisplaySecondLine: "",
							Affiliation: "",
							speakerIcon: "nothing",
							speakerAvatar: "assets/img/1x1.png",
							speakerClass: "alphaDivider",
							navigationArrow: "nothing",
							SearchField: ""
						});

						// Set the new marker point
						SpeakerDividerCharacter = data[i].LastName.charAt(0);


                        // Show the current record
						this.SpeakerListing.push({
							SpeakerID: data[i].speakerID,
							DisplayNameLastFirst: DisplayName,
							DisplaySecondLine: visDisplayAdditional,
							Affiliation: "",
							speakerIcon: "person",
							speakerAvatar: "assets/img/personIcon.png",
							speakerClass: "",
							navigationArrow: "arrow-dropright",
							SearchField: SearchField
						});

                    } else {

                        // Add current record to the list
						this.SpeakerListing.push({
							SpeakerID: data[i].speakerID,
							DisplayNameLastFirst: DisplayName,
							DisplaySecondLine: visDisplayAdditional,
							Affiliation: "",
							speakerIcon: "person",
							speakerAvatar: imageAvatar,
							speakerClass: "",
							navigationArrow: "arrow-dropright",
							SearchField: SearchField
						});
						
					}

				}


			} else {
				
                // No records to show
				this.SpeakerListing.push({
					SpeakerID: 0,
					DisplayNameLastFirst: "No records available",
					DisplaySecondLine: "",
					Affiliation: "",
					speakerIcon: "",
					speakerAvatar: "assets/img/1x1.png",
					speakerClass: "",
					navigationArrow: "",
					SearchField: ""
				});

			}

			this.AllListing = this.SpeakerListing;

			this.cd.markForCheck();

			loading.dismiss();
		
		}).catch(function () {
			console.log("Promise Rejected");
		});
					
			
		
	}

    SpeakerDetails(SpeakerID) {

		if (SpeakerID != 0) {
						
			// Navigate to Speaker Details page
			this.navCtrl.navigateForward('/speakerdetails/' + SpeakerID);
			
		}
    };

}




