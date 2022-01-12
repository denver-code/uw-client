import {Component, OnInit, ViewChild} from '@angular/core';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {PageNavigationComponent} from '../Shared/page-navigation/page-navigation.component';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ServerService} from '../services/server.service';
import {SessionService} from '../services/session.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DataPageEventInformation, PageEventType} from '../Shared/page-navigation/page-navigation.core';
import {TransactionalInformation} from '../entities/TransactionalInformation.entity';
import {ChatColumn} from '../model/ChatColumn';


@Component({
  selector: 'app-my-chats',
  templateUrl: './my-chats.component.html',
  styleUrls: ['./my-chats.component.css']
})
export class MyChatsComponent implements OnInit {

  // Mobile
  public isMobile: boolean;
  deviceInfo = null;
  // Page
  @ViewChild (PageNavigationComponent, {static: false}) pageNavigation: PageNavigationComponent;
  // page
  public pageSize: number;
  public tabIndex: number;
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  public chatList: ChatColumn[] = [];
  constructor(public service: ServerService,
              public sessionService: SessionService,
              public deviceService: DeviceDetectorService,
              public router: Router,
              public fb: FormBuilder) {
    this.pageSize = 10;
    this.isMobile = false;
    this.tabIndex = 3;
    this.epicFunction();
  }

  ngOnInit() {
    if (this.sessionService.IsAuthenticatedPage('MyChats')) {
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
    this.service.httpPost(`notification/request_list_chats`, {page: currentPageNumber , amount: this.pageSize}).subscribe(
      data => {
        // Success
        const transactionalInformation = new TransactionalInformation();
        transactionalInformation.currentPageNumber = currentPageNumber;
        transactionalInformation.pageSize = pageSize;
        transactionalInformation.totalPages = this.service.calculateTotalPages(data.body.message.totalAmount, pageSize );
        transactionalInformation.totalRows = data.body.message.totalAmount;
        this.chatList = data.body.message.chats;
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
      ['ViewChatNotification', id],
      {
        queryParams: {
          // 'appNo': "userid"
          // 'price': myItem.price
        }
      }
    );
  }
  chatRequest(chatId: number) {
    // сhat
    this.router.navigate(
      ['chat', chatId],
      {
        queryParams: {
          // 'appNo': "userid"
          // 'price': myItem.price
        }
      }
    );
  }
  // viewNotification() {
  //   if ( this.notificationsList.length > 0) {
  //     const id = this.notificationsList[0].id as number;
  //     this.router.navigate(
  //       ['ViewServiceNotification', id],
  //       {
  //         queryParams: {
  //           // 'appNo': "userid"
  //           // 'price': myItem.price
  //         }
  //       }
  //     );
  //   }
  // }
  public pageEvent(event: any) {
    const pageEvent: DataPageEventInformation = event.value;
    if ( pageEvent.EventType === PageEventType.PageSizeChanged) {
      this.pageSize = pageEvent.PageSize;
    }
    // console.log(pageEvent.CurrentPageNumber);
    this.LoadData(pageEvent.PageSize, pageEvent.CurrentPageNumber);
  }
  public UserReviewLoadRowData(index: number) {
    if (index === this.chatList.length - 1) {
      // this.load = true;
      // setTimeout(helpScrollNicescroll, 100);
      // this.LoadData(this.pageSize,1);
    }
    return true;
  }
  // EditAnnouncement() {
  //   this.router.navigate(
  //     ['AddNotification', 0],
  //     {
  //       queryParams: {
  //         // 'appNo': "userid"
  //         // 'price': myItem.price
  //       }
  //     }
  //   );
  // }
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
