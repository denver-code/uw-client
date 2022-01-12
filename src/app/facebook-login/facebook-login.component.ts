import { Component, OnInit } from '@angular/core';
import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {SessionService} from '../services/session.service';
import {Global} from '../Shared/global';

@Component({
  selector: 'app-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.css']
})
export class FacebookLoginComponent implements OnInit {
  // fb
  user: SocialUser;
  loggedIn: boolean;
  constructor(public authService: AuthService,
              public sessionService: SessionService ,
              public router: Router ,
              public fb: FormBuilder) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      // const authorizedUser: AuthorizeUser = new  AuthorizeUser();
      if (this.user ) {
        const authUser = {
          EmailAddress: this.user.email,
          RoleName: 'getService',
          id: this.user.id,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          name: this.user.name,
          photoUrl: this.user.photoUrl,
          provider: this.user.provider
        };
        this.sessionService.setAuthorizeUser(authUser);
        const token = this.user.authToken;
        localStorage.setItem(Global.tokenKey, token);
        sessionStorage.setItem(Global.tokenKey, token);
        // console.log(this.sessionService.AuthorizedUser);
      }
      console.log(this.user);
    });
  }
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
    this.sessionService.resetAuthorizeUser();
  }
}
