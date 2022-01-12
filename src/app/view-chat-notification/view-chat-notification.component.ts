import {Component, OnInit, ViewChild} from '@angular/core';
import {NotificationColumn} from '../model/NotificationColumn';
import {Subscription} from 'rxjs';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../services/SessionStorage/authentication.service';
import {MatDialog} from '@angular/material/dialog';
import {ServerService} from '../services/server.service';
import {SessionService} from '../services/session.service';
import {DialogConfirmationComponent} from '../Shared/dialog-confirmation/dialog-confirmation.component';
import {LanguageName} from '../language/language-name';
import {BackText, CityText, CountryText, DateText, EditText, RegionText, RemoveText} from '../language/general-language';
import {RequestDeletedText, RequestTitleText, TypeServiceText} from '../language/view-notification';

@Component({
  selector: 'app-view-chat-notification',
  templateUrl: './view-chat-notification.component.html',
  styleUrls: ['./view-chat-notification.component.css']
})
export class ViewChatNotificationComponent implements OnInit {

  // params query url
  private routeSubscription: Subscription;
  // private querySubscription: Subscription;
  public id: number;
  public selectedCountryName: string;
  public selectedCityName: string;
  public selectedRegionName: string;
  public selectedTypeServicesName: string;
  // private appNo: string;
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  public notification: NotificationColumn;
  public backText: LanguageName = BackText;
  public requestTitleText: LanguageName = RequestTitleText;
  public typeServiceText: LanguageName = TypeServiceText;
  public dateText: LanguageName = DateText;
  public countryText: LanguageName = CountryText;
  public cityText: LanguageName = CityText;
  public regionText: LanguageName = RegionText;
  constructor(public service: ServerService,
              public router: Router ,
              public sessionService: SessionService ,
              public dialog: MatDialog,
              public auService: AuthenticationService,
              public route: ActivatedRoute) {
    this.routeSubscription = route.params.subscribe(params => this.id = parseInt(params['id']));
    // this.querySubscription = route.queryParams.subscribe(
    //   (queryParam: any) => {
    //     this.appNo = queryParam['appNo'];
    //   }
    // );
    this.selectedCountryName = '';
    this.selectedCityName = '';
    this.selectedRegionName = '';
    this.selectedTypeServicesName = ''; }

  ngOnInit() {
    this.notification = {id: 0, name: '', description: '',
      createdAt: '', updatedAt: ''};
    if (this.sessionService.IsAuthenticatedPage('ViewChatNotification')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  StartPage() {
    this.service.httpPost(`user/notification`, {id: this.id}).subscribe(
      data => {
        // Success
        this.notification = data.body.message.notification;
        if (data.body.message.notification.country != null) {
          this.selectedCountryName = data.body.message.notification.country.name;
        }
        if (data.body.message.notification.city != null) {
          this.selectedCityName = data.body.message.notification.city.name;
        }
        if (data.body.message.notification.region != null) {
          this.selectedRegionName = data.body.message.notification.region.name;
        }
        if (data.body.message.notification.service != null) {
          this.selectedTypeServicesName = data.body.message.notification.service['name' + this.sessionService.activeLanguage];
        }
      },
      error => {
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        return;
      }
    );
  }
  private RemoveDialog(): void {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      // width: '400px',
      data: {title: '', content: '', details: 'This request will be deleted ?'}
    });
    // If you need a result from your dialog
    dialogRef.afterClosed().subscribe(result => {
      // Do something with result, if needed.
      if (result) {
        this.service.httpPost(`customer/deletenotification`, {id: this.id}).subscribe(
          data => {
            this.router.navigate(['Notification']);
          },
          error => {
            // const statusError = this.service.globalStatusError();
            this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
            return;
          }
        );
        console.log('Yes');
      } else {
        console.log('Closed');
      }
    });
  }
  // EditAnnouncement() {
  //   // this.router.navigate(['AddNotification']);
  //   this.router.navigate(
  //     ['AddNotification', this.id],
  //     {
  //       queryParams: {
  //         // 'appNo': "userid"
  //         // 'price': myItem.price
  //       }
  //     }
  //   );
  // }
  CanselAnnouncement() {
    if (this.sessionService.backChatId && this.sessionService.backChatId > 0) {
      const backChatId = this.sessionService.backChatId;
      this.sessionService.backChatId = 0;
      this.router.navigate(
        ['chat', backChatId],
        {
          queryParams: {
            // 'appNo': "userid"
            // 'price': myItem.price
          }
        }
      );
    } else {
      if (this.sessionService.AuthorizedUser.RoleName === this.sessionService.permission.provider) {
        this.router.navigate(['ProviderChats']);
      } else {
        this.router.navigate(['MyChats']);
      }
    }
  }
  public navEvent(event: any){
    // console.log(event.value);
    this.selectedTypeServicesName = this.notification.service['name' + this.sessionService.activeLanguage];
  }

}
