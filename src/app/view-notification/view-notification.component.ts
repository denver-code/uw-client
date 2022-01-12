import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SessionService} from '../services/session.service';
import {AuthenticationService} from '../services/SessionStorage/authentication.service';
import {DialogConfirmationComponent} from '../Shared/dialog-confirmation/dialog-confirmation.component';
import {DialogMessagesComponent} from '../Shared/dialog-messages/dialog-messages.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TransactionalInformation} from '../entities/TransactionalInformation.entity';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {NotificationColumn} from '../model/NotificationColumn';
import {ServerService} from '../services/server.service';
import {EditText, RemoveText, BackText, DateText, CountryText, CityText, RegionText} from '../language/general-language';
import {RequestTitleText, TypeServiceText, RequestDeletedText, СhatAgreementText} from '../language/view-notification';
import {LanguageName} from '../language/language-name';

@Component({
  selector: 'app-view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.css']
})
export class ViewNotificationComponent implements OnInit {
  // params query url
  public routeSubscription: Subscription;
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
  public editText: LanguageName = EditText;
  public removeText: LanguageName = RemoveText;
  public backText: LanguageName = BackText;
  public requestTitleText: LanguageName = RequestTitleText;
  public typeServiceText: LanguageName = TypeServiceText;
  public dateText: LanguageName = DateText;
  public countryText: LanguageName = CountryText;
  public cityText: LanguageName = CityText;
  public regionText: LanguageName = RegionText;
  public requestDeletedText: LanguageName = RequestDeletedText;
  public chatAgreementText: LanguageName = СhatAgreementText;
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
    this.selectedTypeServicesName = '';
  }

  ngOnInit() {
    this.notification = {id: 0, name: '', description: '',
      createdAt: '', updatedAt: '', chat: ''};
    if (this.sessionService.IsAuthenticatedPage('view-notification')) {
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
  public RemoveDialog(): void {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      // width: '400px',
      data: {title: '', content: '', details: this.requestDeletedText[this.sessionService.activeLanguage]}
    });
    // If you need a result from your dialog
    dialogRef.afterClosed().subscribe(result => {
      // Do something with result, if needed.
      if (result) {
        this.service.httpPost(`customer/chat_agreement`, {id: this.id}).subscribe(
          dataAgreement => {
            const chatAgreement = dataAgreement.body.message.chat_agreement;
            // console.log(chatAgreement);
            if (chatAgreement === null){
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
            }
            else {
              this.dialogMessages(this.chatAgreementText[this.sessionService.activeLanguage] + ' ' + chatAgreement.provide.name);
            }
          },
          error => {
            // const statusError = this.service.globalStatusError();
            this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
            return;
          }
        );
        // console.log('Yes');
      } else {
        // console.log('Closed');
      }
    });
  }
  EditAnnouncement() {
    // this.router.navigate(['AddNotification']);
    this.router.navigate(
      ['AddNotification', this.id],
      {
        queryParams: {
          // 'appNo': "userid"
          // 'price': myItem.price
        }
      }
    );
  }
  CanselAnnouncement() {
    this.router.navigate(['Notification']);
  }
  public navEvent(event: any){
    // console.log(event.value);
    this.selectedTypeServicesName = this.notification.service['name' + this.sessionService.activeLanguage];
  }
  dialogMessages(data: string): void {
    const dialogRef = this.dialog.open(DialogMessagesComponent, {
      width: '450px',
      data: {
        title: '',
        content: '',
        details: data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('Yes');
      } else {
        // console.log('Closed');
      }
    });
  }
}
