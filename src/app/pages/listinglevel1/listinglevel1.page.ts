// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, LoadingController, AlertController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';
import { Router, ActivatedRoute } from '@angular/router';


declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'app-listinglevel1',
  templateUrl: './listinglevel1.page.html',
  styleUrls: ['./listinglevel1.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListingLevel1Page {

	public ProgramListing: any[] = [];
	public ProgramTitle: string;
	public daysShow = true;
	public EntryTerms: string;
	public AllListing: any[] = [];
	public myInput:any;

	// Day buttons
	public btnTue = "myButtonGreyBlue";
	public btnWed = "myButtonGreyBlue";
	public btnThu = "myButtonGreyBlue";
	public btnFri = "myButtonGreyBlue";
	public btnSat = "myButtonGreyBlue";
	
	constructor(public navCtrl: NavController, 
				private storage: Storage,
				private databaseprovider: DatabaseService,
				private cd: ChangeDetectorRef,
				public loadingCtrl: LoadingController,
				public events: Events,
				private router: Router,
				private route: ActivatedRoute,
				private alertCtrl: AlertController, 
				private localstorage: LocalstorageService) {
        
				let listingType = this.route.snapshot.paramMap.get('listingType');

				if (listingType == "Lectures") {
					this.ProgramTitle = "Sessions by Day";
				} else {
					this.ProgramTitle = listingType;
				}
				
	}

  
  	async presentAgendaAddAlert() {
		const alert = await this.alertCtrl.create({
			header: 'Agenda Item',
			message: 'Unable to add the item to your agenda at this time. Please try again shortly.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async presentAgendaRemoveAlert() {
		const alert = await this.alertCtrl.create({
			header: 'Agenda Item',
			message: 'Unable to remove the item from your agenda at this time. Please try again shortly.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async presentBookmarkAddAlert() {
		const alert = await this.alertCtrl.create({
			header: 'Bookmarks',
			message: 'Unable to add the item to your bookmark list at this time. Please try again shortly.',
			buttons: ['OK']
		});

		await alert.present();
	}

	async presentBookmarkRemoveAlert() {
		const alert = await this.alertCtrl.create({
			header: 'Bookmarks',
			message: 'Unable to remove the item from your bookmark list at this time. Please try again shortly.',
			buttons: ['OK']
		});

		await alert.present();
	}


	onSearchTerm(ev: CustomEvent) {
		
		const val = ev.detail.value;
		console.log('Filter value: ' + val);
		
		this.ProgramListing = this.AllListing;
		if (val && val.trim() !== '') {
			this.ProgramListing = this.AllListing.filter(term => {
				return term.SearchField.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
			});
		}
		
		this.cd.markForCheck();
		
	}

	async ngOnInit() {

		let listingType = this.route.snapshot.paramMap.get('listingType');
		// Load initial data set here
		//switch(listingType) {
		//		case "Lectures":
		//			this.daysShow = true;
		//			console.log('Showing day bar');
		//			break;
		//		default:
		//			this.daysShow = false;
		//			console.log('Hiding day bar');
		//			break;
		//}

		const loading = await this.loadingCtrl.create({
			message: 'Loading'
		});
		await loading.present();

		// Blank and show loading info
		this.ProgramListing = [];
		this.cd.markForCheck();
		

		var flags;
		var NotesButtonStatus = true;
		var AgendaButtonStatus = true;
		var dayID;
		var SearchField = "";
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var ProgramDay = this.localstorage.getLocalValue('ProgramDay');

		this.btnTue = "myButtonGreyBlue";
		this.btnWed = "myButtonGreyBlue";
		this.btnThu = "myButtonGreyBlue";
		this.btnFri = "myButtonGreyBlue";
		this.btnSat = "myButtonGreyBlue";
		
		switch(ProgramDay) {
			case "Sat":
				this.btnTue = "myButtonActive";
				flags = "11/19/2019";
				break;
			case "Sun":
				this.btnWed = "myButtonActive";
				flags = "11/20/2019";
				break;
			case "Mon":
				this.btnThu = "myButtonActive";
				flags = "11/21/2019";
				break;
			case "Tue":
				this.btnFri = "myButtonActive";
				flags = "11/22/2019";
				break;
			case "Wed":
				this.btnSat = "myButtonActive";
				flags = "11/23/2019";
				break;
			default:
				this.btnTue = "myButtonActive";
				flags = "11/19/2019";
				break;
		}
		

		console.log('Flags: ' + flags);
		
		//if (AttendeeID != '' && AttendeeID != null) {
										
			this.databaseprovider.getLecturesByDay(flags, listingType, AttendeeID).then(data => {
				
				console.log("getLecturesByDay: " + JSON.stringify(data));

				if (data['length']>0) {
					
					var TimeslotDivider = "";
					
					for (var i = 0; i < data['length']; i++) {

						var educationHeader = "";
						var SubjectCodeCECredits = "";

						var dbEventDateTime = data[i].session_start_time.substring(0, 19);
						dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
						dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
						var SQLDate = new Date(dbEventDateTime);
						var DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
						var DisplayStartTime = dateFormat(SQLDate, "h:MMtt");
						
						// Display end time
						dbEventDateTime = data[i].session_end_time.substring(0, 19);
						dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
						dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
						SQLDate = new Date(dbEventDateTime);
						DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");


						var AgendaButtonText = "";
						var visAgendaButtonColor = "";
						var visAgendaButtonTextColor = "";
						
						if (data[i].OnAgenda != null) {
							AgendaButtonText = "Remove";
						    visAgendaButtonColor = "buttonRemove";
						    //visAgendaButtonTextColor = "#fff";
						} else {
							AgendaButtonText = "Add";
						    visAgendaButtonColor = "buttonAdd";
						    //visAgendaButtonTextColor = "#fff";
						}

						var visEventName = data[i].session_title;
						var DisplayDateRoom = "";
						
						if (data[i].RoomName.length==0) {
							DisplayDateRoom = DisplayDateTime;
						} else {
							DisplayDateRoom = DisplayDateTime + " in " + data[i].RoomName;
						}

						SubjectCodeCECredits = "ID: " + data[i].session_id;
						
						educationHeader = '<h5>' + visEventName + '</h5><ion-label>' + DisplayDateRoom + '</ion-label></br><ion-label>' + SubjectCodeCECredits + '</ion-label>';
						
						//if (data[i].subject != null && data[i].subject != "") {
						//	SubjectCodeCECredits = "Subject code: " + data[i].subject;
						//}
						//if (data[i].subject != null && data[i].subject != "") {
						//	if (data[i].cs_credits != null && data[i].cs_credits != "") {
						//		SubjectCodeCECredits = SubjectCodeCECredits + " - CE Credits: " + data[i].cs_credits;
						//	}
						//} else {
						//	if (data[i].cs_credits != null && data[i].cs_credits != "") {
						//		SubjectCodeCECredits = "CE Credits: " + data[i].cs_credits;
						//	}
						//}
						
						// Status checks
						var visSessionStatus = "";
						var visStatusStyle = "SessionStatusNormal";
						
						/*
						// Room Capacity check
						if (parseInt(data[i].room_capacity) <= parseInt(data[i].Attendees)) {
							visSessionStatus = "Course at Capacity";
							visStatusStyle = "SessionStatusRed";
						}
						
						// Waitlist check
						if (data[i].Waitlist == "1") {
							if (visSessionStatus == "") {
								visSessionStatus = "You are Waitlisted";
								visStatusStyle = "SessionStatusRed";
							} else {
								visSessionStatus = visSessionStatus + " / You are Waitlisted";
								visStatusStyle = "SessionStatusRed";
							}
						}
						*/
						
						// Cancellation check
						if (data[i].CancelledYN == "Y") {
							visSessionStatus = "CANCELLED";
							visStatusStyle = "SessionStatusRed";
						}

						// SearchField concatenation
						SearchField = data[i].session_title + ' ';
						SearchField = SearchField + data[i].RoomName + ' ';
						SearchField = SearchField + data[i].session_id + ' ';
						SearchField = SearchField + visSessionStatus + ' ';
						SearchField = SearchField + data[i].other_speakers + ' ';
						SearchField = SearchField + data[i].description + ' ';
						SearchField = SearchField + data[i].AgeLevel + ' ';
						SearchField = SearchField + data[i].PrimaryAudience + ' ';
						
						console.log(SearchField);
						
						if (DisplayStartTime != TimeslotDivider) {
							
							// Display the divider
							this.ProgramListing.push({
								DisplayEducationHeader: '<ion-label>' + DisplayStartTime + '</>',
								DisplayEventName: DisplayStartTime,
								DisplayEventTimeDateLocation: "",
								SpeakerDisplayName: "",
								EventID: "0",
								visAgendaAddRemoveButton: false,
								btnEvalShow: false,
								btnNotesShow: false,
								btnAgendaShow: false,
								btnEmailShow: false,
								DisplaySubjectCodeCECredits: "",
								SessionStatusStyle: "SessionStatusNormal",
								SessionStatus: "",
								AgendaButtonColor: "#F15D22",
								AgendaButtonTextColor: "#ffffff",
								DisplayIcon: "",
								DividerStyle: "alphaDivider",
								btnAgendaDisable: false,
								SearchField: ""
							});

							// Set the new marker point
							TimeslotDivider = DisplayStartTime;

							this.ProgramListing.push({
								DisplayEducationHeader: educationHeader,
								DisplayEventName: visEventName,
								DisplayEventTimeDateLocation: DisplayDateRoom,
								SpeakerDisplayName: data[i].other_speakers,
								EventID: data[i].session_id,
								visAgendaAddRemoveButton: AgendaButtonText,
								btnEvalShow: false,
								btnNotesShow: NotesButtonStatus,
								btnAgendaShow: AgendaButtonStatus,
								btnEmailShow: true,
								DisplaySubjectCodeCECredits: SubjectCodeCECredits,
								SessionStatusStyle: visStatusStyle,
								SessionStatus: visSessionStatus,
								AgendaButtonColor: visAgendaButtonColor,
								AgendaButtonTextColor: visAgendaButtonTextColor,
								DisplayIcon: "arrow-dropright",
								DividerStyle: "",
								btnAgendaDisable: true,
								SearchField: SearchField
							});

						} else {
							
							this.ProgramListing.push({
								DisplayEducationHeader: educationHeader,
								DisplayEventName: visEventName,
								DisplayEventTimeDateLocation: DisplayDateRoom,
								SpeakerDisplayName: data[i].other_speakers,
								EventID: data[i].session_id,
								visAgendaAddRemoveButton: AgendaButtonText,
								btnEvalShow: false,
								btnNotesShow: NotesButtonStatus,
								btnAgendaShow: AgendaButtonStatus,
								btnEmailShow: true,
								DisplaySubjectCodeCECredits: SubjectCodeCECredits,
								SessionStatusStyle: visStatusStyle,
								SessionStatus: visSessionStatus,
								AgendaButtonColor: visAgendaButtonColor,
								AgendaButtonTextColor: visAgendaButtonTextColor,
								DisplayIcon: "arrow-dropright",
								DividerStyle: "",
								btnAgendaDisable: true,
								SearchField: SearchField
							});
						}
						
					}

				} else {
					
					this.ProgramListing.push({
						DisplayEducationHeader: "No events available",
						DisplayEventName: "No events available",
						DisplayEventTimeDateLocation: "",
						SpeakerDisplayName: "",
						EventID: 0,
						btnEvalShow: false,
						btnNotesShow: false,
						btnAgendaShow: false,
						btnEmailShow: false,
						DisplaySubjectCodeCECredits: "",
						SessionStatusStyle: "",
						SessionStatus: "",
						AgendaButtonColor: "",
						AgendaButtonTextColor: "",
						DisplayIcon: "",
						DividerStyle: "",
						btnAgendaDisable: false,
						SearchField: ""
					});

				}

				this.AllListing = this.ProgramListing;

				this.cd.markForCheck();
				
				loading.dismiss();
				
			}).catch(function () {
				console.log("Promise Rejected");
				loading.dismiss();
			});
			
		//} else {
		//	console.log('User not logged in');
		//	loading.dismiss();
		//}
		
	}

	ionViewDidLoad() {
		
		console.log('ionViewDidLoad ListingLevel1');
				
	}

    GetSearchResults() {

        var SearchTerms = this.EntryTerms;

        if ((SearchTerms == undefined) || (SearchTerms == "")) {
            // Do nothing or show message
			
        } else {

            this.localstorage.setLocalValue("SearchTerms", SearchTerms);
			this.navCtrl.navigateForward('/searchresults');

        }
    };

    EventDetails(EventID) {
		
		this.localstorage.setLocalValue('EventID', EventID);

		if (EventID != 0) {

			var MassAddFlag = "0";
            var MassEvalFlag = "0";
            var MassContactFlag = "0";
            var MassEmailFlag = "0";
            var MassAgendaFlag = "0";
            var MassNotesFlag = "0";
			
            MassAddFlag = this.localstorage.getLocalValue("MassAdd");
            MassEvalFlag = this.localstorage.getLocalValue("MassEval");
            MassContactFlag = this.localstorage.getLocalValue("MassContact");
            MassEmailFlag = this.localstorage.getLocalValue("MassEmail");
            MassAgendaFlag = this.localstorage.getLocalValue("MassAgenda");
            MassNotesFlag = this.localstorage.getLocalValue("MassNotes");

            if ((MassAddFlag != "0") || (MassEvalFlag != "0") || (MassContactFlag != "0") || (MassEmailFlag != "0") || (MassAgendaFlag != "0") || (MassNotesFlag != "0")) {

                this.localstorage.setLocalValue("MassAdd", "0");
                this.localstorage.setLocalValue("MassEval", "0");
                this.localstorage.setLocalValue("MassContact", "0");
				this.localstorage.setLocalValue("MassEmail", "0");
                this.localstorage.setLocalValue("MassAgenda", "0");
                this.localstorage.setLocalValue("MassNotes", "0");
				
			} else {
				// Navigate to Exhibitor Details page
				this.navCtrl.navigateForward('/educationdetails/' + EventID);
			}
        }

    };

    navToNotes(EventID) {

		console.log("NoteDetails: " + EventID);
        this.localstorage.setLocalValue("MassNotes", "1");

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		if (AttendeeID == '' || AttendeeID == null) {
			// If not, store the page they want to go to and go to the Login page
			console.log('Stored AttendeeID: ' + AttendeeID);
			this.localstorage.setLocalValue('NavigateToPage', "NotesDetailsPage");
			this.navCtrl.navigateForward('/login');
		} else {
			// Otherwise just go to the page they want
			this.localstorage.setLocalValue('EventID', EventID);
			this.navCtrl.navigateForward('/notesdetails/' + EventID);
		}

	};

    eMailCourse(CourseTitle) {

        this.localstorage.setLocalValue("MassEmail", "1");
        window.open("mailto:info@mailaddress.com?subject=" + CourseTitle + "&body=From the NAEYC Annual 2019 Conference...", '_system');

    };
	
	DayUpdate(dayID) {

		switch(dayID) {
			case "Sat":
				this.localstorage.setLocalValue('ProgramDay', 'Sat');
				break;
			case "Sun":
				this.localstorage.setLocalValue('ProgramDay', 'Sun');
				break;
			case "Mon":
				this.localstorage.setLocalValue('ProgramDay', 'Mon');
				break;
			case "Tue":
				this.localstorage.setLocalValue('ProgramDay', 'Tue');
				break;
			case "Wed":
				this.localstorage.setLocalValue('ProgramDay', 'Wed');
				break;
			default:
				this.localstorage.setLocalValue('ProgramDay', 'Sat');
				break;			
		}
		
		this.ngOnInit();
		
	}

    AgendaUpdate(session, EventID, sessionCard) {

		console.log('Agenda Update called');
		console.log('Session: ' + JSON.stringify(session));
		console.log('EventID: ' + EventID);
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        this.localstorage.setLocalValue("MassAdd", "1");
        this.localstorage.setLocalValue("EventID", EventID);
        this.localstorage.setLocalValue("MassAddTag", EventID);
		var flags = '';

        if (AttendeeID !== null) {
			
            if (AttendeeID.length > 0) {

				// Disable the button while we process the request
				session.btnAgendaDisable = false;
				
				var LastUpdateDate2 = new Date().toUTCString();
				var LastUpdateDate = dateFormat(LastUpdateDate2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
				
                // If so, remove it
                if (session.visAgendaAddRemoveButton == "Remove") {

					console.log('Remove detected');
					
					flags = "dt|0|Alpha|" + EventID;

					this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
						
						console.log("getLectureData: " + JSON.stringify(data));

						if (data['length']>0) {

							// Values for Agenda Management
							this.localstorage.setLocalValue("AAOID", EventID);
							this.localstorage.setLocalValue("EventStartTime", data[0].session_start_time.substring(11,19));
							this.localstorage.setLocalValue("EventEndTime", data[0].session_end_time.substring(11,19));
							this.localstorage.setLocalValue("EventLocation", data[0].RoomName);
							this.localstorage.setLocalValue("EventName", data[0].session_title);
							this.localstorage.setLocalValue("EventDate", data[0].session_start_time.substring(0,10));

							var AAOID = this.localstorage.getLocalValue("AAOID");
							var EventID = this.localstorage.getLocalValue("EventID");
							var EventStartTime = this.localstorage.getLocalValue("EventStartTime");
							var EventEndTime = this.localstorage.getLocalValue("EventEndTime");
							var EventLocation = this.localstorage.getLocalValue("EventLocation");
							var EventName = this.localstorage.getLocalValue("EventName");
							EventName = EventName.replace(/'/g, "''");
							var EventDate = this.localstorage.getLocalValue("EventDate");

							// -----------------------
							// Remove Item from Agenda
							// -----------------------
							flags = 'dl|0|' + EventID + '|' + EventStartTime + '|' + EventEndTime + '|' + EventLocation + '|' + EventName + '|' + EventDate + '|' + AAOID + '|' + LastUpdateDate;
							console.log("flags: " + flags);
							
							this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
								
								console.log("getAgendaData: " + JSON.stringify(data));

								if (data['length']>0) {

									console.log("Return status: " + data[0].DeleteStatus);

									if (data[0].DeleteStatus == "Success") {
										
										this.events.publish('user:Status', 'AgendaItem Remove');
										session.visAgendaAddRemoveButton = "Add";
										session.AgendaButtonColor = "buttonAdd";
										//session.AgendaButtonTextColor = "#fff";

										// Disable the button while we process the request
										session.btnAgendaDisable = true;

										this.cd.markForCheck();
										
									} else {
										
										console.log("Return query: " + data[0].DeleteQuery);
										
										this.presentAgendaRemoveAlert();

										// Disable the button while we process the request
										session.btnAgendaDisable = true;

									}
									
								}

							}).catch(function () {
								console.log("Promise Rejected");
							});

						}
						
					}).catch(function () {
						console.log("Promise Rejected");
					});

                }

                // If not, add it
                if (session.visAgendaAddRemoveButton == "Add") {

					console.log('Add detected');
					
					flags = "dt|0|Alpha|" + EventID;

					this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
						
						console.log("getLectureData: " + JSON.stringify(data));

						if (data['length']>0) {

							// Values for Agenda Management
							this.localstorage.setLocalValue("AAOID", EventID);
							this.localstorage.setLocalValue("EventStartTime", data[0].session_start_time.substring(11,19));
							this.localstorage.setLocalValue("EventEndTime", data[0].session_end_time.substring(11,19));
							this.localstorage.setLocalValue("EventLocation", data[0].RoomName);
							this.localstorage.setLocalValue("EventName", data[0].session_title);
							this.localstorage.setLocalValue("EventDate", data[0].session_start_time.substring(0,10));

							var AAOID = this.localstorage.getLocalValue("AAOID");
							var EventID = this.localstorage.getLocalValue("EventID");
							var EventStartTime = this.localstorage.getLocalValue("EventStartTime");
							var EventEndTime = this.localstorage.getLocalValue("EventEndTime");
							var EventLocation = this.localstorage.getLocalValue("EventLocation");
							var EventName = this.localstorage.getLocalValue("EventName");
							EventName = EventName.replace(/'/g, "''");
							var EventDate = this.localstorage.getLocalValue("EventDate");
							
							// ------------------------
							// Add item to Agenda
							// ------------------------
							flags = 'ad|0|' + EventID + '|' + EventStartTime + '|' + EventEndTime + '|' + EventLocation + '|' + EventName + '|' + EventDate + '|' + AAOID + '|' + LastUpdateDate;
							console.log("flags: " + flags);
							
							this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
								
								console.log("getAgendaData: " + JSON.stringify(data));

								if (data['length']>0) {

									console.log("Return status: " + data[0].AddStatus);

									if (data[0].AddStatus == "Success") {
										
										this.events.publish('user:Status', 'AgendaItem Add');
										session.visAgendaAddRemoveButton = "Remove";
										session.AgendaButtonColor = "buttonRemove";
										//session.AgendaButtonTextColor = "#ffffff";

										// Disable the button while we process the request
										session.btnAgendaDisable = true;

										this.cd.markForCheck();
										
									} else {
										
										console.log("Return query: " + data[0].AddQuery);
										
										this.presentAgendaAddAlert();
										
										// Disable the button while we process the request
										session.btnAgendaDisable = true;

									}
									
								}

							}).catch(function () {
								console.log("Promise Rejected");
							});
			
						}
						
					}).catch(function () {
						console.log("Promise Rejected");
					});
					
                }
				
            } else {
                // Not logged in
				this.localstorage.setLocalValue('NavigateToPage', "listingLevel1");
                this.localstorage.setLocalValue("LoginWarning", "2");
				this.navCtrl.navigateForward('/login');
            }
        } else {
            // Not logged in
			this.localstorage.setLocalValue('NavigateToPage', "listingLevel1");
			this.localstorage.setLocalValue("LoginWarning", "2");
			this.navCtrl.navigateForward('/login');
        }

    };
	
}

