import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {SessionService} from './services/session.service';
import {AuthenticationService} from './services/SessionStorage/authentication.service';
import {LocalStoreManager} from './services/SessionStorage/local-store-manager.service';
// import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { LanguageName} from './language/language-name';
import { TopMenuHelp, TopMenuLogOut, ProfileText, HomeText, ServiceHomeText, ViewReviewsText, MyChatsText, NotificationText} from './language/top-menu';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // public lan = 'EN';
  // Mobile
  public isMobile: boolean;
  deviceInfo = null;
  title = 'UnitedWealth';
  constructor(
              public router: Router,
              public authenticationService: AuthenticationService,
              storageManager: LocalStoreManager,
              public deviceService: DeviceDetectorService,
              public sessionService: SessionService
  ) {
    storageManager.initialiseStorageSyncListener();
    this.isMobile = false;
    this.epicFunction();
  }
  ngOnInit() {
    // this.lan = this.sessionService.getActiveLanguage();
    topMenuСollapse();
  }
  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
  }
}
