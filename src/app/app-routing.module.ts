import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClientLogInComponent } from './client-log-in/client-log-in.component';
import { FacebookLoginComponent } from './facebook-login/facebook-login.component';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { LeavingFeedbackComponent } from './leaving-feedback/leaving-feedback.component';
import { WriteUsComponent } from './write-us/write-us.component';
import { ServiceUserProfileComponent } from './service-user-profile/service-user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NotificationComponent } from './notification/notification.component';
import {RegistrationComponent} from './registration/registration.component';
import {MyChatsComponent} from './my-chats/my-chats.component';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import { ViewNotificationComponent } from './view-notification/view-notification.component';
import { ProviderRegistrationComponent } from './provider-registration/provider-registration.component';
import { WriteUsProviderComponent } from './write-us-provider/write-us-provider.component';
import { ServiceHomeComponent } from './service-home/service-home.component';
import { ViewServiceNotificationComponent } from './view-service-notification/view-service-notification.component';
import { EditProvideProfileComponent } from './edit-provide-profile/edit-provide-profile.component';
import { ReviewsTreeComponent } from './reviews-tree/reviews-tree.component';
import {ChatComponent} from './chat/chat.component';
import { ProviderChatComponent } from './provider-chat/provider-chat.component';
import { ViewChatNotificationComponent } from './view-chat-notification/view-chat-notification.component';
import { ViewProvideProfileComponent } from './view-provide-profile/view-provide-profile.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
},
  {
    path: 'Home',
    component: HomeComponent
  }
  ,
  {
    path: 'LogIn',
    component:  ClientLogInComponent
  },
  {
    path: 'FacebookLogin',
    component:  FacebookLoginComponent
  },
  {
    path: 'AddAnnouncement',
    component:  AddAnnouncementComponent
  },
  {
    path: 'LeavingFeedback',
    component:  LeavingFeedbackComponent
  },
  {
    path: 'WriteUs',
    component:  WriteUsComponent
  },
  {
    path: 'WriteUsProvider',
    component:  WriteUsProviderComponent
  },
  {
    path: 'ServiceUserProfile',
    component:  ServiceUserProfileComponent
  },
  {
    path: 'EditProvideProfile',
    component:  EditProvideProfileComponent
  },
  {
    path: 'ReviewsTree',
    component: ReviewsTreeComponent
  },
  {
    path: 'ServiceHome',
    component:  ServiceHomeComponent
  },
  {
    path: 'EditProfile',
    component: EditProfileComponent
  },
  {
    path: 'Notification',
    component: NotificationComponent
  },
  {
    path: 'Registration',
    component: RegistrationComponent
  },
  {
    path: 'ProviderRegistration',
    component: ProviderRegistrationComponent
  },
  {
    path: 'MyChats',
    component: MyChatsComponent
  },
  {
    path: 'chat/:id',
    component: ChatComponent
  },
  {
    path: 'ProviderChats',
    component: ProviderChatComponent
  },
  {
    path: 'AddNotification/:id',
    component:  AddNotificationComponent
  },
  {
    path: 'ViewNotification/:id',
    component:  ViewNotificationComponent
  },
  {
    path: 'ViewServiceNotification',
    component:  ViewServiceNotificationComponent
  },
  {
    path: 'ViewChatNotification/:id',
    component:  ViewChatNotificationComponent
  },
  {
    path: 'ViewProvideProfile/:id',
    component:  ViewProvideProfileComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
