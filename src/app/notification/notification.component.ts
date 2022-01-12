import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {SessionService} from '../services/session.service';
import {ServerService} from '../services/server.service';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {NotificationColumn} from '../model/NotificationColumn';
import {PageNavigationComponent} from '../Shared/page-navigation/page-navigation.component';
import {TransactionalInformation} from '../entities/TransactionalInformation.entity';
import {DataPageEventInformation, PageEventType} from '../Shared/page-navigation/page-navigation.core';
import {AddRequestText} from '../language/notification';
import {LanguageName} from '../language/language-name';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  // Mobile
  public isMobile: boolean;
  public tabIndex: number;
  deviceInfo = null;
  // Page
  @ViewChild (PageNavigationComponent, {static: false}) pageNavigation: PageNavigationComponent;
  // page
  public pageSize: number;
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  public notificationsList: NotificationColumn[] = [];
  public addRequestText: LanguageName = AddRequestText;
  constructor(public service: ServerService,
              public sessionService: SessionService,
              public deviceService: DeviceDetectorService,
              public router: Router,
              public fb: FormBuilder) {
    this.pageSize = 10;
    this.tabIndex = 2;
    this.isMobile = false;
    this.epicFunction();
  }

  ngOnInit() {
    if (this.sessionService.IsAuthenticatedPage('Notification')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  StartPage() {
    this.LoadData(this.pageSize,1);
  }
  public LoadData(pageSize: number, currentPageNumber: number) {
    // console.log(this.searchText);
    this.service.httpPost(`user/notifications`, {page: currentPageNumber , amount: this.pageSize, selector: ''}).subscribe(
      data => {
        // Success
        const transactionalInformation = new TransactionalInformation();
        transactionalInformation.currentPageNumber = currentPageNumber;
        transactionalInformation.pageSize = pageSize;
        transactionalInformation.totalPages = this.service.calculateTotalPages(data.body.message.totalAmount, pageSize );
        transactionalInformation.totalRows = data.body.message.totalAmount;
        this.notificationsList = data.body.message.notifications;
        this.pageNavigation.databind(transactionalInformation);
      },
      error => {
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        return;
      }
    );
  }
  editNotification(id: number) {
    this.router.navigate(
      ['ViewNotification', id],
      {
        queryParams: {
          // 'appNo': "userid"
          // 'price': myItem.price
        }
      }
    );
    // this.router.navigate(['ViewNotification']); // AddNotification
    // alert('123'); AddAnnouncement
  }
  public pageEvent(event: any) {
    const pageEvent: DataPageEventInformation = event.value;
    if ( pageEvent.EventType === PageEventType.PageSizeChanged) {
      this.pageSize = pageEvent.PageSize;
    }
    // console.log(pageEvent.CurrentPageNumber);
    this.LoadData(pageEvent.PageSize, pageEvent.CurrentPageNumber);
  }
  public UserReviewLoadRowData(index: number) {
    if (index === this.notificationsList.length - 1) {
      // this.load = true;
      // setTimeout(helpScrollNicescroll, 100);
      // this.LoadData(this.pageSize,1);
    }
    return true;
  }
  EditAnnouncement() {
    this.router.navigate(
      ['AddNotification', 0],
      {
        queryParams: {
          // 'appNo': "userid"
          // 'price': myItem.price
        }
      }
    );
    // this.router.navigate(['AddNotification']); // AddNotification
  }
  epicFunction() {
    // console.log('device Service');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(this.isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  }

}
