// Components, functions, plugins
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavController } from '@ionic/angular';
import 'rxjs/add/operator/map';
import { LocalstorageService } from './../../services/localstorage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-program',
  templateUrl: './program.page.html',
  styleUrls: ['./program.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramPage {
  router: any;
 
	constructor(public navCtrl: NavController, 
				private nav: NavController,
				private localstorage: LocalstorageService) {

	}


ngOnInit() {

}

	ionViewDidLoad() {
		console.log('ionViewDidLoad: ProgramPage');
	}
	
    DisplayListing(listingType) {

        // Store selection in localStorage for the next page
		this.localstorage.setLocalValue('ListingType', listingType);
        console.log('Listing Type: ' + listingType);

		switch(listingType) {
			case "Speakers":
				// Navigate to Speakers page
				this.navCtrl.navigateForward('/speakers');
				break;
			case "SearchbyTopic":
				// Navigate to Speakers page
				this.navCtrl.navigateForward('/searchbytopic');
				break;
			default:
				// Navigate to Listing page
				this.navCtrl.navigateForward('/listinglevel1/' + listingType);
				break;
    }
		
    }

    navToClientWebsite() {

        var WebsiteURL = "https://www.aacd.com/index.php?module=aacd.websiteforms&cmd=aacdconvergenceauth";

		var u = this.localstorage.getLocalValue('loginUsername');
		var p = this.localstorage.getLocalValue('loginPassword');
		
		// Create URL string
		WebsiteURL = WebsiteURL + "&u=" + u + "&p=" + p;
		// Open website
		window.open(WebsiteURL, '_system');

    }
	
}











