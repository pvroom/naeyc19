import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {ModalPage } from  '../modal/modal.page';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseService } from './../../services/database.service';
import { LocalstorageService } from './../../services/localstorage.service';

@Component({
  selector: 'app-activityfeedcomment',
  templateUrl: './activityfeedcomment.page.html',
  styleUrls: ['./activityfeedcomment.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityFeedCommentPage {

	public CommentEntry: string;
	
	constructor(
				private storage: Storage,
				private databaseprovider: DatabaseService,
				private view: ModalController,
				private localstorage: LocalstorageService) {
					
	}

	ngOnInit() {


	}

	
	closeModal(UserAction) {
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');

		if (UserAction == "Save") {

			var UserComment = this.CommentEntry;
			
			var flags = 'ad|' + ActivityFeedID + '|' + UserComment;
			
			this.databaseprovider.getActivityFeedData(flags, AttendeeID).then(data => {
				
				console.log("getActivityFeedData: " + JSON.stringify(data));

				if (data['length']>0) {

                    console.log("Return status: " + data[0].Status);
					this.view.dismiss(UserAction);
					
				}
			
			}).catch(function () {
				console.log("Activity Feed Promise Rejected");
			});
						
		}
		
		if (UserAction == "Cancel") {
			this.view.dismiss(UserAction);
		}
		
	}
}
