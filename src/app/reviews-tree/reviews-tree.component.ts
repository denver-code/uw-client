import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ServerService} from '../services/server.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {SessionService} from '../services/session.service';
import {MessagesComponent} from '../Shared/messages/messages.component';

@Component({
  selector: 'app-reviews-tree',
  templateUrl: './reviews-tree.component.html',
  styleUrls: ['./reviews-tree.component.css']
})
export class ReviewsTreeComponent implements OnInit {
  currentRate = 0;
  // Mobile
  public isMobile: boolean;
  deviceInfo = null;
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  constructor(public service: ServerService,
              public sessionService: SessionService,
              public deviceService: DeviceDetectorService,
              public dialog: MatDialog,
              public router: Router,
              public fb: FormBuilder) {
    this.isMobile = false;
    this.epicFunction();
  }
  ngOnInit() {
    if (this.sessionService.IsAuthenticatedPage('ReviewsTree')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  StartPage() {
  }
  epicFunction() {
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
