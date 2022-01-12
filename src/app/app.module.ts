import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DeviceDetectorModule } from 'ngx-device-detector';

import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { MenuComponent } from './menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Facebook
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';
// Service
import {ServerService} from './services/server.service';
import {SessionService} from './services/session.service';
import {UiService} from './services/ui.service';
import {SocketService} from './chat/shared/services/socket.service';

import {Utilities} from './services/SessionStorage/utilities';
import {AuthenticationService} from './services/SessionStorage/authentication.service';
import {LocalStoreManager} from './services/SessionStorage/local-store-manager.service';
// Dialog
import {DialogConfirmationComponent} from './Shared/dialog-confirmation/dialog-confirmation.component';
import {DialogMessagesComponent} from './Shared/dialog-messages/dialog-messages.component';

import {WriteReviewComponent} from './view-tree/write-review.component';
// Messages
import {MessagesComponent} from './Shared/messages/messages.component';
// Page
import {PageNavigationComponent} from './Shared/page-navigation/page-navigation.component';
// Nav Bar Main
import {NavBarMainComponent} from './Shared/nav-bar-main/nav-bar-main.component';
// Upload
import {UploadComponent} from './Shared/upload/upload.component';
// Page
import {CustomMenuComponent} from './Shared/custom-menu/custom-menu';
import {ProvideMenuComponent} from './Shared/provide-menu/provide-menu.component';
// Directive
import {ShowHideInputDirective} from './Shared/show-hide-Input/show-hide-Input';
// SelectSearch
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule} from '@angular/material/divider';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatListModule} from '@angular/material/list';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatRadioModule} from '@angular/material/radio';
import { MatSelectModule} from '@angular/material/select';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSortModule} from '@angular/material/sort';
import { MatStepperModule} from '@angular/material/stepper';
import { MatTableModule} from '@angular/material/table';
import { MatTabsModule} from '@angular/material/tabs';
import { MatTreeModule} from '@angular/material/tree';
import { MatTooltipModule} from '@angular/material/tooltip';

import { MAT_DATE_FORMATS} from '@angular/material/core';
import { HomeComponent } from './home/home.component';
import { ClientLogInComponent } from './client-log-in/client-log-in.component';
import { FacebookLoginComponent } from './facebook-login/facebook-login.component';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { LeavingFeedbackComponent } from './leaving-feedback/leaving-feedback.component';
import { WriteUsComponent } from './write-us/write-us.component';
import { ServiceUserProfileComponent } from './service-user-profile/service-user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NotificationComponent } from './notification/notification.component';
import { RegistrationComponent } from './registration/registration.component';
import { MyChatsComponent } from './my-chats/my-chats.component';
import { ChatComponent } from './chat/chat.component';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import { ViewNotificationComponent } from './view-notification/view-notification.component';
import { ProviderRegistrationComponent } from './provider-registration/provider-registration.component';

// Selection
import {СountrySelectionComponent} from './add-notification/selection/country-selection.component';
import {RegionsSelectionComponent} from './add-notification/selection/regions-selection.component';
import {ServicesSelectionComponent} from './add-notification/selection/services-selection.component';
import {CitiesSelectionComponent} from './add-notification/selection/cities-selection.component';
import {CountryMultipleSelectionComponent} from './multiple-selection/country-multiple-selection.component';
import {ServicesMultipleSelectionComponent} from './multiple-selection/services-multiple-selection.component';
import { WriteUsProviderComponent } from './write-us-provider/write-us-provider.component';
import {RegionsMultipleSelectionComponent} from './multiple-selection/regions-multiple-selection.component';
import {CitiesMultipleSelectionComponent} from './multiple-selection/cities-multiple-selection.component';
import { ServiceHomeComponent } from './service-home/service-home.component';
import { ViewServiceNotificationComponent } from './view-service-notification/view-service-notification.component';
import { EditProvideProfileComponent } from './edit-provide-profile/edit-provide-profile.component';
import { ReviewsTreeComponent } from './reviews-tree/reviews-tree.component';
import { ProviderChatComponent } from './provider-chat/provider-chat.component';
import { ViewChatNotificationComponent } from './view-chat-notification/view-chat-notification.component';
import { ViewProvideProfileComponent } from './view-provide-profile/view-provide-profile.component';
import {ServicesDetailComponent} from './view-detail/services-detail.component';
import {CountryDetailComponent} from './view-detail/country-detail.component';
import {RegionsDetailComponent} from './view-detail/regions-detail.component';
import {CitiesDetailComponent} from './view-detail/cities-detail.component';
import {TreeReviewsComponent} from './view-tree/tree-reviews.component';

import { SafePipe } from './Shared/safe/safe.pipe';
const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('1281625242227909')
    // provider: new FacebookLoginProvider('534844870413127')
    // 1281625242227909
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  entryComponents: [DialogConfirmationComponent, DialogMessagesComponent, WriteReviewComponent],
  declarations: [
    AppComponent,
    PageNavigationComponent,
    NavBarMainComponent,
    CustomMenuComponent,
    ProvideMenuComponent,
    DialogConfirmationComponent,
    DialogMessagesComponent,
    WriteReviewComponent,
    MessagesComponent,
    MenuComponent,
    HomeComponent,
    ClientLogInComponent,
    FacebookLoginComponent,
    AddAnnouncementComponent,
    LeavingFeedbackComponent,
    WriteUsComponent,
    ServiceUserProfileComponent,
    EditProfileComponent,
    UploadComponent,
    NotificationComponent,
    RegistrationComponent,
    MyChatsComponent,
    ChatComponent,
    AddNotificationComponent,
    ViewNotificationComponent,
    СountrySelectionComponent,
    RegionsSelectionComponent,
    ServicesSelectionComponent,
    CitiesSelectionComponent,
    CountryMultipleSelectionComponent,
    ServicesMultipleSelectionComponent,
    RegionsMultipleSelectionComponent,
    CitiesMultipleSelectionComponent,
    ServicesDetailComponent,
    CountryDetailComponent,
    RegionsDetailComponent,
    CitiesDetailComponent,
    TreeReviewsComponent,
    ShowHideInputDirective,
    ProviderRegistrationComponent,
    WriteUsProviderComponent,
    ServiceHomeComponent,
    ViewServiceNotificationComponent,
    EditProvideProfileComponent,
    ReviewsTreeComponent,
    ProviderChatComponent,
    ViewChatNotificationComponent,
    ViewProvideProfileComponent,
    SafePipe
  ],
  imports: [
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    NgbModule,
    SocialLoginModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTreeModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    DeviceDetectorModule.forRoot(),
  ],
  providers: [
    {
    provide: MAT_DATE_FORMATS,
    useValue: {
      parse: {
        dateInput: 'MM.DD.YYYY',
      },
      display: {
        dateInput: 'MM.DD.YYYY',
        monthYearLabel: 'MM.DD.YYYY',
        dateA11yLabel: 'MM.DD.YYYY',
        monthYearA11yLabel: 'MM.DD.YYYY',
      },
    },
  },
  {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
  },
    ServerService,
    SessionService,
    UiService,
    AuthenticationService,
    LocalStoreManager,
    SocketService,
    Utilities
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
