// Components, functions, plugins
import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy, PopoverController} from '@ionic/angular'; //IonicErrorHandler//
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite/ngx';
//import { MyApp } from './app.component';
import { OneSignal } from '@ionic-native/onesignal/ngx';
//import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Camera } from '@ionic-native/camera/ngx';
import { TextAvatarModule } from 'src/app/components/text-avatar/text-avatar.module';
//import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
//import { IonAlphaScrollModule } from 'ionic2-alpha-scroll';
import { ExpandableComponent } from 'src/app/components/expandable/expandable.component';
import { Animation } from '@ionic/core';

// Services
import { DatabaseService } from './services/database.service';
import { LocalstorageService } from './services/localstorage.service';
import { SynchronizationService } from './services/synchronization.service';
import { ChatService } from './services/chat-service';

// Pages, Modals
import { LoginSamplePageModule } from './pages/loginsample/loginsample.module';
import { ActivityfeedleaderboardPageModule } from './pages/activityfeedleaderboard/activityfeedleaderboard.module';
import { ActivityfeedpostingPageModule } from './pages/activityfeedposting/activityfeedposting.module';
import { ProfilePasswordChangePageModule } from './pages/profilepasswordchange/profilepasswordchange.module';

//import { SpeakersPage} from './pages/speakers/speakers.page';
//import { SpeakerDetailsPage } from './pages/speakerdetails/speakerdetails.page';
//import { EducationDetailsPage } from './pages/educationdetails/educationdetails.page';




//import { RelativeTimePipe } from './pipes/relative-time.pipe';



@NgModule({
  declarations: [
	AppComponent, 
	ExpandableComponent,
	//RelativeTimePipe,
  ],
  entryComponents: [
   // SpeakersPage,
	//SpeakerDetailsPage,
	//EducationDetailsPage,

  ],
  imports: [
	RouterModule,
	TextAvatarModule,
	BrowserModule, 

	FormsModule,
	HttpModule,
	//ElementRef,
	//ChartsModule,
	FileUploadModule,
	//IonicImageViewerModule,
	//IonAlphaScrollModule,
	HttpClientModule,
	// Normal page transitions
	IonicModule.forRoot(),
	// Disable page transitions
	//IonicModule.forRoot({
	//	  backButtonText: '',
	//	  navAnimation: (AnimationC: Animation): Promise<Animation> => { return Promise.resolve(new AnimationC()); }
	//}),	
	AppRoutingModule,
	LoginSamplePageModule,
	ActivityfeedleaderboardPageModule,
	ActivityfeedpostingPageModule,
	ProfilePasswordChangePageModule,
	IonicStorageModule.forRoot(),
  
  ],
  providers: [
	StatusBar,
	SplashScreen,
	Camera,
	StatusBar,
	InAppBrowser,
	OneSignal,
	Keyboard,
	LocalstorageService,
	// NotificationService,
	ChatService,
	//{provide: ErrorHandler, useClass: IonicErrorHandler},
	//[{ provide: ErrorHandler, useClass: MyErrorHandler }],
	DatabaseService,
	SQLite,
	SynchronizationService,
	{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

