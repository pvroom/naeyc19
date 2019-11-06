// Components, functions, plugins
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, LoadingController, AlertController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet/dist';
import * as L from "leaflet";

// Pages
import { LoginPage } from '../login/login.page';
import { MyAgendaPage } from '../myagenda/myagenda.page';
import { ReviewPage } from '../review/review.page';


declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'app-educationdetails',
  templateUrl: './educationdetails.page.html',
  styleUrls: ['./educationdetails.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EducationDetailsPage implements OnInit {

	// Exhibitor Details
	public EventID: string;
	public EventName: string;
	public EventSubName: string;
	public DisplayEventTimeDateLocation: string;
	public SpeakerDisplayName: string;
	public EventTypeName: string;
	public SpeakerHostEmcee: string;
	public EventCorporateSupporter: string;
	public EventDetails: string;
	public sessionAbstract: string;
	public HandoutFn: string;	
	public HandoutURL: string;
	public educationHeader: string;
	
	// Control Buttons
	public visAgendaAddRemoveButton: string;
	public btnAgendaManagement = true;
	public AgendaButtonColor: string = '#ffffff';
	public AgendaButtonTextColor: string = '#43ada5';

	public btnNotes = true;
	public btnPrint = true;
	public btnEval = false;

	public visBookmarkAddRemoveButton: string;
	public btnBookmarkManagement = true;
	public BookmarkButtonColor: string = '#ffffff';
	public BookmarkButtonTextColor: string = '#43ada5';

	// Session rating
	public SessionRatingSelection: string;
	
	// SubSection Control
	public SpeakerHostShow = true;
	public CorporateSupporterShow = true;
	public AuthorsDisplay = false;
	public AbstractDisplay = true;
	public DescriptionDisplay = true;
	public SubEventsDisplay = false;
	public RecordingShow = true;
	public HandoutShow = true;
	public OtherInformationDisplay = true;

	public SpeakerList: any[] = [];

	// Other Information
	public vSessionPrimaryAudience: string;
	public vSessionAgeLevel: string;
	public SessionStatusStyle: string;
	public SessionStatus: string;
	public vSessionCourseID: string;
	public vSessionFloorRoom: string;
	public vSessionCapacity: string;
	public vSessionSetup: string;
	
	// Leaflet mapping variables
	myMap: any;

	constructor(public navCtrl: NavController, 
				private storage: Storage,
				private databaseprovider: DatabaseService,
				private cd: ChangeDetectorRef,
				private alertCtrl: AlertController, 
				private router: Router,
				private route: ActivatedRoute,
				public events: Events,
				public loadingCtrl: LoadingController,
				private localstorage: LocalstorageService) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EducationDetailsPage');
	}

	goToReviewPage() {
		this.router.navigateByUrl('ReviewPage');
	}

	mcqAnswer(value){
	   console.log(value);
	}

	// Alert definitions
	async presentSessionRatingAlert() {
		const alert = await this.alertCtrl.create({
			header: 'Session Ratings',
			message: 'You must be logged in to select a rating.',
			buttons: ['OK']
		});

		await alert.present();
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
			
	SessionRatingChange(event) {

		console.log("Rating value: " + this.SessionRatingSelection);
		console.log("Rating value 2: " + event);
		
		var StarRating;
		if (event == null) {
			StarRating = 0;
		} else {
			StarRating = event;
		}
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		let EventID = this.route.snapshot.paramMap.get('EventID');
		this.localstorage.setLocalValue('EventID', EventID);
		var flags = "rw|" + EventID + "|" + StarRating;
		console.log('AttendeeID: ' + AttendeeID);
		
		if ((AttendeeID == null) || (AttendeeID === null) || (AttendeeID.length == 0)) {
			
			this.SessionRatingSelection = null;
			this.cd.markForCheck();
			
			this.presentSessionRatingAlert();
			
		} else {
			
			this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
				// Nothing to do with the return data
			}).catch(function () {
				console.log("getDatabaseStats Promise Rejected");
			});
			
		}
	}
		
	ngOnInit() {
		

		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		
		if (AttendeeID == '' || AttendeeID == null) {
			AttendeeID = '0';
		}

		// Load initial data set here
		//let loading = this.loadingCtrl.create({
		//	spinner: 'crescent',
		//	content: 'Please wait...'
		//});

		//loading.present();

		// Blank and show loading info
		this.cd.markForCheck();
    

		// Temporary use variables
		var EventID = this.localstorage.getLocalValue('EventID');
		var flags = "dt|0|Alpha|" + EventID;
		this.EventID = EventID;
    
   
        // ---------------------
        // Get Education Details
        // ---------------------

        var PrimarySpeakerName = "";
        var SQLDate;
        var DisplayDateTime;
        var DisplayDateTime2;
        var dbEventDateTime;
        var courseID = "";
        var UpdatedEventDescription;
        var UpdatedEventDescription2;
		var HandoutPDFName = "";

   		console.log('Education Details, flags: ' + flags);
		
        // Get course detail record
		this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {

			console.log("getLectureData: " + JSON.stringify(data));
			
			if (data['length']>0) {

                PrimarySpeakerName = "";
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

				console.log('Education Details, Point 0');
				
                if (data[0].primary_speaker == "" || data[0].primary_speaker == "null" || data[0].primary_speaker == null) {
                    //PrimarySpeakerName = "No Assigned Primary Presenter";
                    PrimarySpeakerName = "";
                } else {
                    PrimarySpeakerName = data[0].primary_speaker;
                }
                //this.SpeakerDisplayName = PrimarySpeakerName;

 				console.log('Education Details, Point 1a');
				
				//this.EventName = data[0].session_title;
                //this.EventSubName = "ID: " + data[0].session_id;
				
                if (data[0].RoomName === null || data[0].RoomName === undefined || data[0].RoomName.length == 0) {
					DisplayDateTime2 = DisplayDateTime;
                    //this.DisplayEventTimeDateLocation = DisplayDateTime;
                } else {
					DisplayDateTime2 = DisplayDateTime + " in " + data[0].RoomName;
                    //this.DisplayEventTimeDateLocation = DisplayDateTime + " in " + data[0].RoomName;
                }
                //this.EventTypeName = data[0].EventTypeName;
				
				var DisplayTitle = data[0].session_title.replace(/\r\\\n/g, '');

				this.educationHeader = '<h3>' + DisplayTitle + '</h3><p>' + "ID: " + data[0].session_id + '</p><p>' + DisplayDateTime2 + '</p><p>' + PrimarySpeakerName + '</p>';
				
 				console.log('Education Details, Point 1b');
				
                if ((data[0].speaker_host_emcee === undefined) || (data[0].speaker_host_emcee === "") || (data[0].speaker_host_emcee === null)) {
                    this.SpeakerHostShow = false;
                } else {
                    this.SpeakerHostEmcee = data[0].speaker_host_emcee;
                }

                if ((data[0].corporate_supporter === undefined) || (data[0].corporate_supporter === "") || (data[0].corporate_supporter === null)) {
                    this.CorporateSupporterShow = false;
                } else {
                    this.EventCorporateSupporter = data[0].corporate_supporter;
                }

				console.log('Education Details, Point 1c');
				
                UpdatedEventDescription2 = data[0].description;
                UpdatedEventDescription2 = UpdatedEventDescription2.replace(/\\/g, '');
                this.sessionAbstract = UpdatedEventDescription2;

				console.log("Education Details, Abstract: " + UpdatedEventDescription2);
				
                //this.EventID = data[0].session_id;
				HandoutPDFName = data[0].HandoutFilename + ".pdf";
                this.HandoutURL = "https://naeyc.convergence-us.com/naeyc/www/assets/Handouts/" + HandoutPDFName;
                this.HandoutFn = HandoutPDFName;
				
                courseID = data[0].session_id;

                this.localstorage.setLocalValue("PDFLink", data[0].course_id);

                // Values for Agenda Management
                this.localstorage.setLocalValue("AAOID", data[0].session_id);
                this.localstorage.setLocalValue("EventStartTime", data[0].session_start_time.substring(11,19));
                this.localstorage.setLocalValue("EventEndTime", data[0].session_end_time.substring(11,19));
                this.localstorage.setLocalValue("EventLocation", data[0].RoomName);
                this.localstorage.setLocalValue("EventName", data[0].session_title);
                this.localstorage.setLocalValue("EventDate", data[0].session_start_time.substring(0,10));

                if (data[0].OnAgenda != null) {
                    this.visAgendaAddRemoveButton = "Remove";
					this.AgendaButtonColor = 'buttonRemove';
					//this.AgendaButtonTextColor = '#ffffff!important';
                } else {
                    this.visAgendaAddRemoveButton = "Add";
					this.AgendaButtonColor = 'buttonAdd';
					//this.AgendaButtonTextColor = '#ffffff!important';
                }

                // Values for Bookmark Management
                this.localstorage.setLocalValue("BookmarkID", data[0].session_id);
                this.localstorage.setLocalValue("BookmarkType", "Sessions");

                if (data[0].Bookmarked != "0") {
                    this.visBookmarkAddRemoveButton = "Remove";
					this.BookmarkButtonColor = 'buttonRemove';
					//this.BookmarkButtonTextColor = '#fff';
                } else {
                    this.visBookmarkAddRemoveButton = "Bookmark";
					this.BookmarkButtonColor = 'buttonAdd';
					//this.BookmarkButtonTextColor = '#fff';
                }

				// Session ratings
				this.SessionRatingSelection = data[0].asrRating;
				
                if (data[0].ce_credits_type == "") {
                    this.AbstractDisplay = false;
                } else {
                    this.DescriptionDisplay = false;
                }
				
                if ((data[0].description === undefined) || (data[0].description === "") || (data[0].description === null)) {
                    this.AbstractDisplay = false;
                    this.DescriptionDisplay = false;
                }

				console.log('Education Details, Session recording: ' + data[0].session_recording.trim());
                if (data[0].session_recording.trim() == "N") {
                    this.RecordingShow = false;
                }

				console.log('HandoutFilename: ' + HandoutPDFName);
                if (data[0].HandoutFilename === "" || data[0].HandoutFilename === null) {
                    this.HandoutShow = false;
                }

				// Other Information grid
				console.log('Education Details, PrimaryAudience: ' + data[0].PrimaryAudience);
				console.log('Education Details, AgeLevel: ' + data[0].AgeLevel);
				
				if (data[0].PrimaryAudience != '') {
					var PrimaryAudience = data[0].PrimaryAudience.replace(/; /g, '\r\n');
					this.vSessionPrimaryAudience = PrimaryAudience;
				} else {
					this.vSessionPrimaryAudience = "";
				}
				
				if (data[0].AgeLevel != '') {
					var AgeLevel = data[0].AgeLevel.replace(/; /g, '\r\n');
					this.vSessionAgeLevel = AgeLevel;
				} else {
					this.vSessionAgeLevel = "";
				}

				this.vSessionCourseID = data[0].session_id;
				//this.vSessionFloorRoom = data[0].FloorNumber + " / " + data[0].RoomName;
				this.vSessionFloorRoom = data[0].BuildingName + " / " + data[0].RoomName;

				// Status checks
				var SessionStatus = "";
				var StatusStyle = "SessionStatusNormal";
								
				// Cancellation check
				if (data[0].CancelledYN == "Y") {
					SessionStatus = "CANCELLED";
					StatusStyle = "SessionStatusRed";
				}

				console.log('Education Details, SessionStatus: ' + SessionStatus);
				
				this.SessionStatusStyle = StatusStyle;
				this.SessionStatus = SessionStatus;
				
				console.log('Education Details, Point 2');
				
				// ---------------------------
                // Get Linked Speakers
                // ---------------------------

                this.AuthorsDisplay = false;
					
				// Keep hidden for non-CE events
				console.log('Education Details, Non-CE event');
				//this.OtherInformationDisplay = false;
				
				this.cd.markForCheck();

				console.log('Education Details, Loading speakers');
				flags = "cd|Alpha|0|0|" + courseID;

				// Get speaker detail record
				this.databaseprovider.getSpeakerData(flags, AttendeeID).then(data2 => {
					
					console.log("Education Details, getSpeakerData: " + JSON.stringify(data2));

					if (data2['length'] > 0) {

						// Process returned records to display
						this.SpeakerList = [];
						var DisplayName = "";

						for (var i = 0; i < data2['length']; i++) {

							DisplayName = "";

							// Concatenate fields to build displayable name
							DisplayName = DisplayName + data2[i].FirstName;
							DisplayName = DisplayName + " " + data2[i].LastName;
							
							var imageAvatar = "";

							var DisplaySecondLine = "";
							var DisplayThirdLine = "";
							DisplaySecondLine = data2[i].Company;
							if (data2[i].SortOrder == '1') {
								DisplayThirdLine = 'Primary Presenter';
							} else {
								DisplayThirdLine = 'Co-Presenter';
							}
							
							this.SpeakerList.push({
								speakerIcon: "person",
								speakerAvatar: imageAvatar,
								navigationArrow: "arrow-dropright",
								SpeakerID: data2[i].speakerID,
								DisplayNameLastFirst: DisplayName,
								DisplayCredentials: DisplaySecondLine,
								DisplayStatus: DisplayThirdLine
								//Affiliation: data2[i].Affiliation
							});

						}

						this.AuthorsDisplay = true;

					}

					this.cd.markForCheck();

					console.log("Education Details, Speaker load complete");
					
				}).catch(function () {
					console.log("Education Details, Speaker Promise Rejected");
				});
				
				console.log("Education Details, Session load complete");
				
			}
		
		}).catch(function () {
			console.log("Education Details, Course Promise Rejected");
		});


        // -------------------
        // Get Attendee Status
        // -------------------
		console.log('Education Details, Attendee Button Management, AttendeeID: ' + AttendeeID);
		if (AttendeeID == '0') {
			this.btnNotes = false;
			this.btnAgendaManagement = false;
			this.btnBookmarkManagement = false;
		} else {
			this.btnNotes = true;
			this.btnAgendaManagement = true;
			this.btnBookmarkManagement = true;
		}

	}

    SpeakerDetails(SpeakerID) {
		
        if (SpeakerID != 0) {
			console.log('Education Details, Navigate to speaker: ' + SpeakerID);
            // Navigate to Speaker Details page
			this.navCtrl.navigateForward('/speakerdetails/' + SpeakerID);
        }

    };

    printWindow() {
        window.open('https://www.google.com/cloudprint/#printers', '_system');
    };

    openPDF(PDFURL) {
        var ref = window.open(PDFURL, '_system');
    };

    navToMyAgenda() {

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		if (AttendeeID != '' && AttendeeID != null) {
			// If not, store the page they want to go to and go to the Login page
			console.log('Stored AttendeeID: ' + AttendeeID);
			this.localstorage.setLocalValue('NavigateToPage', "MyAgenda");
			this.router.navigateByUrl('LoginPage');
		} else {
			// Otherwise just go to the page they want
			this.router.navigateByUrl('MyAgenda');
		}

	};

    navToNotes(EventID) {

		console.log("NoteDetails: " + EventID);

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
	
    AgendaManagement() {
		
		console.log("Begin AgendaManagement process...");

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

        var AAOID = this.localstorage.getLocalValue("AAOID");
        var EventID = this.localstorage.getLocalValue("EventID");
        var EventStartTime = this.localstorage.getLocalValue("EventStartTime");
        var EventEndTime = this.localstorage.getLocalValue("EventEndTime");
        var EventLocation = this.localstorage.getLocalValue("EventLocation");
        var EventName = this.localstorage.getLocalValue("EventName");
		EventName = EventName.replace(/'/g, "''");
        var EventDate = this.localstorage.getLocalValue("EventDate");

		var flags = '';
		
		// Starting variables
		console.log("AttendeeID: " + AttendeeID);
		console.log("AAOID: " + AAOID);
		console.log("EventID: " + EventID);
		console.log("EventStartTime: " + EventStartTime);
		console.log("EventEndTime: " + EventEndTime);
		console.log("EventLocation: " + EventLocation);
		console.log("EventName: " + EventName);
		console.log("EventDate: " + EventDate);

		this.cd.markForCheck();
		
		var LastUpdateDate2 = new Date().toUTCString();
		var LastUpdateDate = dateFormat(LastUpdateDate2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");

        if (this.visAgendaAddRemoveButton == "Add") {

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
						this.visAgendaAddRemoveButton = "Remove";
						this.AgendaButtonColor = 'buttonRemove';
						//this.AgendaButtonColor = '#43ada5';
						//this.AgendaButtonTextColor = '#ffffff';
						this.cd.markForCheck();
						
					} else {
						
						console.log("Return query: " + data[0].AddQuery);
						
						this.presentAgendaAddAlert();
						
					}
					
				}

			}).catch(function () {
				console.log("Promise Rejected");
			});
			
        } else {

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
						this.visAgendaAddRemoveButton = "Add";
						this.AgendaButtonColor = 'buttonAdd';
						//this.AgendaButtonColor = '#43ada5';
						//this.AgendaButtonTextColor = '#43ada5';
						this.cd.markForCheck();
						
					} else {
						
						console.log("Return query: " + data[0].DeleteQuery);
						
						this.presentAgendaRemoveAlert();
						
					}
					
				}

			}).catch(function () {
				console.log("Promise Rejected");
			});

        }

    };

    BookmarkManagement() {
		
		console.log("Begin BookmarkManagement process...");

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

        var BookmarkType = this.localstorage.getLocalValue("BookmarkType");
        var BookmarkID = this.localstorage.getLocalValue("BookmarkID");

		var flags = '';
		
		// Starting variables
		console.log("AttendeeID: " + AttendeeID);
		console.log("BookmarkType: " + BookmarkType);
		console.log("BookmarkID: " + BookmarkID);

		this.cd.markForCheck();

		var LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

        if (this.visBookmarkAddRemoveButton == "Bookmark") {

            // ------------------------
            // Add item to Bookmarks List
            // ------------------------
			flags = 'cb|0|' + BookmarkType + '|' + BookmarkID;
			console.log("flags: " + flags);
			
			this.databaseprovider.getBookmarksData(flags, AttendeeID).then(data => {
				
				console.log("getBookmarksData: " + JSON.stringify(data));

				if (data['length']>0) {

                    console.log("Return status: " + data[0].Status);

					if (data[0].Status == "Saved") {
						
						this.visBookmarkAddRemoveButton = "Remove";
						this.BookmarkButtonColor = 'buttonRemove';
						//this.BookmarkButtonColor = '#43ada5';
						//this.BookmarkButtonTextColor = '#ffffff';
						this.cd.markForCheck();
						
					} else {
						
						console.log("Return query: " + data[0].Query);
						
						this.presentBookmarkAddAlert();
						
					}
					
				}

			}).catch(function () {
				console.log("Promise Rejected");
			});
			
        } else {

            // -----------------------
            // Remove Item from Bookmarks List
            // -----------------------
			flags = 'rb|0|' + BookmarkType + '|' + BookmarkID;
			console.log("flags: " + flags);
			
			this.databaseprovider.getBookmarksData(flags, AttendeeID).then(data => {
				
				console.log("getBookmarksData: " + JSON.stringify(data));

				if (data['length']>0) {

                    console.log("Return status: " + data[0].Status);

					if (data[0].Status == "Saved") {
						
						this.visBookmarkAddRemoveButton = "Bookmark";
						this.BookmarkButtonColor = 'buttonAdd';
						//this.BookmarkButtonColor = '#ffffff';
						//this.BookmarkButtonTextColor = '#43ada5';
						this.cd.markForCheck();
						
					} else {
						
						console.log("Return query: " + data[0].Query);
						
						this.presentBookmarkRemoveAlert();
						
					}
					
				}

			}).catch(function () {
				console.log("Promise Rejected");
			});

        }

    };
  
   
  }

