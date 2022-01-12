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
import {BackText, CityText, CountryText, DateText, RegionText} from '../language/general-language';
import {RequestTitleText, TypeServiceText} from '../language/view-notification';
import {ChatText} from '../language/view-service-notification';
import {LanguageName} from '../language/language-name';

@Component({
  selector: 'app-view-service-notification',
  templateUrl: './view-service-notification.component.html',
  styleUrls: ['./view-service-notification.component.css']
})
export class ViewServiceNotificationComponent implements OnInit {
// params query url
  // public routeSubscription: Subscription;
  public querySubscription: Subscription;
  public id: number;
  public mail: number;
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
  public chatText: LanguageName = ChatText;
  constructor(public service: ServerService,
              public router: Router ,
              public sessionService: SessionService ,
              public dialog: MatDialog,
              public auService: AuthenticationService,
              public route: ActivatedRoute) {
    // this.routeSubscription = route.params.subscribe(params => this.id = parseInt(params['id']));
    this.querySubscription = route.queryParams.subscribe(
      (queryParam: any) => {
        this.id = Number(queryParam['viewId']);
        this.mail = Number(queryParam['mail']);
      }
    );
    this.selectedCountryName = '';
    this.selectedCityName = '';
    this.selectedRegionName = '';
    this.selectedTypeServicesName = ''; }

  ngOnInit() {
    this.notification = {id: 0, name: '', description: '',
      createdAt: '', updatedAt: ''};
    this.sessionService.setRoleRequest(this.sessionService.permission.provider);
    this.sessionService.mail = this.mail;
    if (this.sessionService.IsAuthenticatedPage('ViewServiceNotification?viewId=' + this.id.toString() + '&mail=0')) {
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
  addChat(idN: number, recieverId: number) {
    this.service.httpPost(`notification/notifications_add_chat`, {id: idN, request: recieverId}).subscribe(
      data => {
        console.log(data.body.message);
        this.router.navigate(['ProviderChats']);
      },
      error => {
        // const statusError = this.service.globalStatusError();
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        return;
      }
    );
  }
  CanselAnnouncement() {
    this.router.navigate(['ServiceHome']);
  }
  public navEvent(event: any){
    // console.log(event.value);
    this.selectedTypeServicesName = this.notification.service['name' + this.sessionService.activeLanguage];
  }

}
