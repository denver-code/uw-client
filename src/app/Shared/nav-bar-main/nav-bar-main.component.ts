import {
  Component,
  EventEmitter,
  Injectable,
  Output,
  Input,
  OnInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { LanguageName } from '../../language/language-name';
import { ButtonProvide, ButtonRequest } from '../../language/main-home';
import { SessionService } from '../../services/session.service';
import {
  TopMenuHelp,
  TopMenuLogOut,
  ProfileText,
  ViewProfileText,
  HomeText,
  ServiceHomeText,
  ViewReviewsText,
  MyChatsText,
  NotificationText,
} from '../../language/top-menu';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router, RouterModule } from '@angular/router';
import { ServerService } from '../../services/server.service';
@Component({
  selector: 'app-nav-bar-main',
  templateUrl: 'nav-bar-main.component.html',
  styleUrls: ['nav-bar-main.component.css'],
})
@Injectable()
export class NavBarMainComponent implements OnInit {
  @Output() navEvent: any;
  public lan = 'EN';
  public buttonProvide: LanguageName = ButtonProvide;
  public menuHelp: LanguageName = TopMenuHelp;
  public menuLogOut: LanguageName = TopMenuLogOut;
  public profileText: LanguageName = ProfileText;
  public viewProfileText: LanguageName = ViewProfileText;
  public homeText: LanguageName = HomeText;
  public serviceHomeText: LanguageName = ServiceHomeText;
  public viewReviewsText: LanguageName = ViewReviewsText;
  public myChatsText: LanguageName = MyChatsText;
  public notificationText: LanguageName = NotificationText;
  // Mobile
  public isMobile: boolean;
  deviceInfo = null;
  constructor(
    public el: ElementRef,
    public service: ServerService,
    public router: Router,
    public sessionService: SessionService,
    public deviceService: DeviceDetectorService,
    public renderer: Renderer2
  ) {
    this.navEvent = new EventEmitter();
  }

  ngOnInit() {
    topMenuСollapse();
    this.lan = this.sessionService.getActiveLanguage();
  }
  databind(): boolean {
    return true;
  }
  logoutClick() {
    this.sessionService.logout();
    navbarCollapseHide();
    this.router.navigate(['Home']);
  }
  Setlanguage(l) {
    navbarCollapseHide();
    this.sessionService.setActiveLanguage(l);
    this.lan = l;
    if (this.sessionService.IsAuthenicated) {
      this.service
        .httpPost(`user/language_selection`, { language: this.lan })
        .subscribe(
          (data) => {
            // console.log('OK');
          },
          (error) => {
            /// this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
            alert(this.service.globalMessageError());
            return;
          }
        );
    }
    this.navEvent.emit({
      value: this.lan,
    });
    // alert('456');
  }
  LoginFacebook() {
    this.router.navigate(['FacebookLogin']);
  }
  EditProfile() {
    navbarCollapseHide();
    this.router.navigate(['EditProfile']);
  }
  ServiceUserProfile() {
    navbarCollapseHide();
    this.router.navigate(['ServiceUserProfile']);
  }
  EditProvideProfile() {
    navbarCollapseHide();
    this.router.navigate(['EditProvideProfile']);
  }
  ViewProvideProfile() {
    navbarCollapseHide();
    this.router.navigate(['ViewProvideProfile', -1]);
  }
  ProviderChats() {
    navbarCollapseHide();
    this.router.navigate(['ProviderChats']);
  }
  SetHome() {
    if (
      !this.sessionService.getPermission(
        this.sessionService.permission.provider_getService
      )
    ) {
      navbarCollapseHide();
      this.router.navigate(['Home']);
    } else {
      if (
        this.sessionService.AuthorizeUserRole ===
        this.sessionService.permission.getService
      ) {
        this.router.navigate(['EditProfile']);
      }
      if (
        this.sessionService.AuthorizeUserRole ===
        this.sessionService.permission.provider
      ) {
        this.router.navigate(['ServiceHome']);
      }
    }
  }
  ServiceHome() {
    navbarCollapseHide();
    this.router.navigate(['ServiceHome']);
  }
  Notification() {
    navbarCollapseHide();
    this.router.navigate(['Notification']);
  }
  ReviewsTree() {
    navbarCollapseHide();
    this.router.navigate(['ReviewsTree']);
  }
  WriteUs() {
    navbarCollapseHide();
    this.router.navigate(['WriteUs']);
  }
  WriteUsProvider() {
    navbarCollapseHide();
    this.router.navigate(['WriteUsProvider']);
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
  provideService() {
    this.sessionService.setRoleRequest(this.sessionService.permission.provider);
    this.router.navigate(['LogIn']);
  }
}
