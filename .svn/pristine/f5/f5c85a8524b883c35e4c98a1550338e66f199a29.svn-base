import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//PAGES
//import { SpeakersPage } from './pages/speakers/speakers.page';
//import { SpeakersPageModule } from './pages/speakers/speakers.module';
//import { SpeakerDetailsPage } from './pages/speakerdetails/speakerdetails.page';
//import { SpeakerdetailsPageModule } from './pages/speakerdetails/speakerdetails.module';
//import { EducationDetailsPage } from './pages/educationdetails/educationdetails.page';
//import { EducationDetailsPageModule } from './pages/educationdetails/educationdetails.module';
//import { HelpPage } from './pages/help/help.page';
//import { HelpPageModule } from './pages/help/help.module';
//import { AttendeesPage } from './pages/attendees/attendees.page';
//import { AttendeesPageModule } from './pages/attendees/attendees.module';
//import { AttendeesProfilePage } from './pages/attendeesprofile/attendeesprofile.page';
//import { AttendeesprofilePageModule } from './pages/attendeesprofile/attendeesprofile.module';
//import { ListingLevel1Page } from './pages/listinglevel1/listinglevel1.page';
//import { ListingLevel1PageModule } from './pages/listinglevel1/listinglevel1.module';
//import { LoginPage } from './pages/login/login.page';
//import { LoginPageModule } from './pages/login/login.module';
//import { ExhibitorsPage } from './pages/exhibitors/exhibitors.page';
//import { ExhibitorsPageModule } from './pages/exhibitors/exhibitors.module';
//import { ExhibitorDetailsPage } from './pages/exhibitordetails/exhibitordetails.page';
//import { ExhibitorDetailsPageModule } from './pages/exhibitordetails/exhibitordetails.module';
//import { SponsorsPage } from './pages/sponsors/sponsors.page';
//import { SponsorsPageModule } from './pages/sponsors/sponsors.module';


const routes: Routes = [
  { path: '', redirectTo: 'home' , pathMatch: 'full' },

  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'activity', loadChildren: './pages/activity/activity.module#ActivityPageModule' },
  { path: 'activityfeedcomment', loadChildren: './pages/activityfeedcomment/activityfeedcomment.module#ActivityfeedcommentPageModule' },
  { path: 'activityfeeddetails/:activityfeedID', loadChildren: './pages/activityfeeddetails/activityfeeddetails.module#ActivityfeeddetailsPageModule' },
  { path: 'activityfeedleaderboard', loadChildren: './pages/activityfeedleaderboard/activityfeedleaderboard.module#ActivityfeedleaderboardPageModule' },
  { path: 'activityfeedposting', loadChildren: './pages/activityfeedposting/activityfeedposting.module#ActivityfeedpostingPageModule' },
  { path: 'attendeesbookmarks', loadChildren: './pages/attendeesbookmarks/attendeesbookmarks.module#AttendeesbookmarksPageModule' },
  { path: 'attendees', loadChildren: './pages/attendees/attendees.module#AttendeesPageModule' },
  { path: 'attendeesprofile/:oAttendeeID', loadChildren: './pages/attendeesprofile/attendeesprofile.module#AttendeesprofilePageModule' },
  { path: 'conferencecity', loadChildren: './pages/conferencecity/conferencecity.module#ConferencecityPageModule' },
  { path: 'conversation/:ConversationAttendeeID', loadChildren: './pages/conversation/conversation.module#ConversationPageModule' },
  { path: 'conversations', loadChildren: './pages/conversations/conversations.module#ConversationsPageModule' },
  { path: 'database', loadChildren: './pages/database/database.module#DatabasePageModule' },
  { path: 'educationdetails/:EventID', loadChildren: './pages/educationdetails/educationdetails.module#EducationDetailsPageModule' },
  { path: 'evaluationconference', loadChildren: './pages/evaluationconference/evaluationconference.module#EvaluationconferencePageModule' },
  { path: 'evaluationworkshop', loadChildren: './pages/evaluationworkshop/evaluationworkshop.module#EvaluationworkshopPageModule' },
  { path: 'evaluationlecture', loadChildren: './pages/evaluationlecture/evaluationlecture.module#EvaluationlecturePageModule' },
  { path: 'exhibitors', loadChildren: './pages/exhibitors/exhibitors.module#ExhibitorsPageModule' },
  { path: 'exhibitordetails/:ExhibitorID', loadChildren: './pages/exhibitordetails/exhibitordetails.module#ExhibitorDetailsPageModule' },
  { path: 'floorplanmapping', loadChildren: './pages/floorplanmapping/floorplanmapping.module#FloorplanmappingPageModule' },
  { path: 'help', loadChildren: './pages/help/help.module#HelpPageModule' },
  { path: 'listinglevel1/:listingType', loadChildren: './pages/listinglevel1/listinglevel1.module#ListingLevel1PageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'map', loadChildren: './pages/map/map.module#MapPageModule' },
  { path: 'modal', loadChildren: './pages/modal/modal.module#ModalPageModule' },
  { path: 'more', loadChildren: './pages/more/more.module#MorePageModule' },
  { path: 'myagenda', loadChildren: './pages/myagenda/myagenda.module#MyagendaPageModule' },
  { path: 'myagendafull', loadChildren: './pages/myagendafull/myagendafull.module#MyagendafullPageModule' },
  { path: 'myagendapersonal/:PersonalEventID', loadChildren: './pages/myagendapersonal/myagendapersonal.module#MyagendapersonalPageModule' },
  { path: 'networking', loadChildren: './pages/networking/networking.module#NetworkingPageModule' },
  { path: 'notes', loadChildren: './pages/notes/notes.module#NotesPageModule' },
  { path: 'notesdetails/:EventID', loadChildren: './pages/notesdetails/notesdetails.module#NotesdetailsPageModule' },
  { path: 'notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'program', loadChildren: './pages/program/program.module#ProgramPageModule' },
  { path: 'review', loadChildren: './pages/review/review.module#ReviewPageModule' },
  { path: 'searchbytopic', loadChildren: './pages/searchbytopic/searchbytopic.module#SearchbytopicPageModule' },
  { path: 'social', loadChildren: './pages/social/social.module#SocialPageModule' },
  { path: 'speakers', loadChildren: './pages/speakers/speakers.module#SpeakersPageModule' },
  { path: 'speakerdetails/:SpeakerID', loadChildren: './pages/speakerdetails/speakerdetails.module#SpeakerdetailsPageModule' },
  { path: 'sponsors', loadChildren: './pages/sponsors/sponsors.module#SponsorsPageModule' },

];

@NgModule({
 
  imports: [
    RouterModule.forRoot(routes,
      {
        preloadingStrategy: PreloadAllModules
      }),


   // SpeakersPageModule,
   // SpeakerdetailsPageModule,
   // EducationDetailsPageModule,
   // HelpPageModule,
   // AttendeesPageModule,
   // AttendeesprofilePageModule,
   // LoginPageModule,
   // ExhibitorsPageModule,
   // ExhibitorDetailsPageModule,
   // SponsorsPageModule,
   // ListingLevel1PageModule,
  
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }




