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
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { TextAvatarModule } from 'src/app/components/text-avatar/text-avatar.module';
import { FileUploadModule } from 'ng2-file-upload';
import { ExpandableComponent } from 'src/app/components/expandable/expandable.component';
import { Animation } from '@ionic/core';

// Services
import { DatabaseService } from './services/database.service';
import { LocalstorageService } from './services/localstorage.service';
import { SynchronizationService } from './services/synchronization.service';
import { ChatService } from './services/chat-service';

// Modals
import { LoginSamplePageModule } from './pages/loginsample/loginsample.module';
import { ActivityfeedleaderboardPageModule } from './pages/activityfeedleaderboard/activityfeedleaderboard.module';
import { ActivityfeedpostingPageModule } from './pages/activityfeedposting/activityfeedposting.module';
import { ProfilePasswordChangePageModule } from './pages/profilepasswordchange/profilepasswordchange.module';
import { ProfileSocialMediaEntryPageModule } from './pages/profilesocialmediaentry/profilesocialmediaentry.module';


@NgModule({
  declarations: [
	AppComponent, 
	ExpandableComponent,
  ],
  entryComponents: [
  ],
  imports: [
	RouterModule,
	TextAvatarModule,
	BrowserModule, 

	FormsModule,
	HttpModule,
	FileUploadModule,
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
	ProfileSocialMediaEntryPageModule,
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
	ChatService,
	DatabaseService,
	SQLite,
	SynchronizationService,
	{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

