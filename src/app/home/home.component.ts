import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { AuthenticationService } from '../services/SessionStorage/authentication.service';
import { Global } from '../Shared/global';
import { LanguageName } from '../language/language-name';
import {
  HeaderText,
  ButtonRequest,
  ButtonProvide,
  HomeHeading,
  HomeTitle,
  HomeSubtitle,
  HomeHowWorks,
  HomeHowWorksPost,
  HomeNewOrder,
  HomeNewOrderFirstLine,
  HomeNewOrderSecondLine,
  HomeNewOrderThirdLine,
  HomeExecutor,
  HomeExecutorFirstLine,
  HomeExecutorSecondLine,
  HomeExecutorThirdLine,
} from '../language/main-home';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public headerText: LanguageName = HeaderText;
  public buttonRequest: LanguageName = ButtonRequest;
  public buttonProvide: LanguageName = ButtonProvide;
  public homeHeading: LanguageName = HomeHeading;
  public homeTitle: LanguageName = HomeTitle;
  public homeSubtitle: LanguageName = HomeSubtitle;
  public homeHowWorks: LanguageName = HomeHowWorks;
  public homeHowWorksPost: LanguageName = HomeHowWorksPost;
  public homeNewOrder: LanguageName = HomeNewOrder;
  public homeNewOrderFirstLine: LanguageName = HomeNewOrderFirstLine;
  public homeNewOrderSecondLine: LanguageName = HomeNewOrderSecondLine;
  public homeNewOrderThirdLine: LanguageName = HomeNewOrderThirdLine;
  public homeExecutor: LanguageName = HomeExecutor;
  public homeExecutorFirstLine: LanguageName = HomeExecutorFirstLine;
  public homeExecutorSecondLine: LanguageName = HomeExecutorSecondLine;
  public homeExecutorThirdLine: LanguageName = HomeExecutorThirdLine;

  constructor(
    public sessionService: SessionService,
    public auService: AuthenticationService,
    public router: Router
  ) {}

  ngOnInit() {
    if (this.sessionService.IsAuthenticatedPage('Home')) {
      this.StartPage();
    } else {
      // this.StartPage();
    }
  }
  StartPage() {}
  getService() {
    this.sessionService.setRoleRequest(
      this.sessionService.permission.getService
    );
    // this.sessionService.roleRequest = this.sessionService.permission.getService;
    this.router.navigate(['LogIn']);
    // this.router.navigate(['FacebookLogin']);
  }
}
