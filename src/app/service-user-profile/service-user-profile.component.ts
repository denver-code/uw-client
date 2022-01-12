import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {SessionService} from '../services/session.service';
import {ServerService} from '../services/server.service';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {AreaColumn} from '../model/AreaColumn';
import {ServicesProvidedColumn} from '../model/ServicesProvidedColumn';
import {UserReviewColumn} from '../model/UserReviewColumn';
import {PageNavigationComponent} from '../Shared/page-navigation/page-navigation.component';
import {TransactionalInformation} from '../entities/TransactionalInformation.entity';
import {DataPageEventInformation, PageEventType} from '../Shared/page-navigation/page-navigation.core';
// import { interval } from 'rxjs';
// import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-service-user-profile',
  templateUrl: './service-user-profile.component.html',
  styleUrls: ['./service-user-profile.component.css']
})
export class ServiceUserProfileComponent implements OnInit {
  currentRate = 3;
  readonly = true;
  // Mobile
  public isMobile: boolean;
  deviceInfo = null;
  // Page
  @ViewChild (PageNavigationComponent, {static: false}) pageNavigation: PageNavigationComponent;
  // page
  public pageSize: number;
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  public areas: AreaColumn[] = [];
  public servicesProvided: ServicesProvidedColumn[] = [];
  public userReview: UserReviewColumn[] = [];
  constructor(public service: ServerService,
              public sessionService: SessionService,
              public deviceService: DeviceDetectorService,
              public router: Router,
              public fb: FormBuilder) {
    this.pageSize = 10;
    this.isMobile = false;
    this.epicFunction();
  }

  ngOnInit() {
    if (this.sessionService.IsAuthenticatedPage('ServiceUserProfile')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  StartPage() {
    this.areas = [
      {country: 'country 1', region: 'region 1', city: 'city 1'},
      {country: 'country 2', region: 'region 2', city: 'city 2'},
      {country: 'country 3', region: 'region 3', city: 'city 3'},
      {country: 'country 4', region: 'region 4', city: 'city 4'}
    ];
    this.servicesProvided = [
      {service: 'service 1'},
      {service: 'service 2'},
      {service: 'service 3'},
      {service: 'service 4'}
    ];
    this.userReview = [
      {userName: 'User Name', rating : 2, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'},
      {userName: 'User Name', rating : 3, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'},
      {userName: 'User Name', rating : 4, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'},
      {userName: 'User Name', rating : 3, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'},
      {userName: 'User Name', rating : 5, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'},
      {userName: 'User Name', rating : 2, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'},
      {userName: 'User Name', rating : 1, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'},
      {userName: 'User Name', rating : 2, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'},
      {userName: 'User Name', rating : 3, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'},
      {userName: 'User Name', rating : 4, reviewText: 'In general, all the reviews talk about what the consumer gets. In reviews ' +
        'of goods and services they write about their quality'}
    ];
    this.LoadData(this.pageSize,1);
  }
  public LoadData(pageSize: number, currentPageNumber: number) {
    this.service.httpGet(`language/all`, {}).subscribe(
      languageData => {
        // Success
        const transactionalInformation = new TransactionalInformation();
        transactionalInformation.currentPageNumber = currentPageNumber;
        transactionalInformation.pageSize = this.pageSize;
        transactionalInformation.totalPages = 10;
        transactionalInformation.totalRows = 100;
        // this.helpList = data.body.message.help;
        this.pageNavigation.databind(transactionalInformation);
      },
      error => {
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        //   this.router.navigate(['error']);
        return;
      }
    );
  }
  getWriteReview() {
    this.router.navigate(['LeavingFeedback']);
  }
  public pageEvent(event: any) {
    const pageEvent: DataPageEventInformation = event.value;
    if ( pageEvent.EventType === PageEventType.PageSizeChanged) {
      this.pageSize = pageEvent.PageSize;
    }
    // console.log(pageEvent.CurrentPageNumber);
    // this.LoadData(pageEvent.PageSize, pageEvent.CurrentPageNumber);
  }
  public UserReviewLoadRowData(index: number) {
    if (index === this.userReview.length - 1) {
      // this.load = true;
      // setTimeout(helpScrollNicescroll, 100);
      // this.LoadData(this.pageSize,1);
    }
    return true;
  }
  AddAnnouncement() {
    this.router.navigate(['AddAnnouncement']);
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
