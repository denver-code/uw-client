import { Component, OnInit, ViewChild } from '@angular/core';
// import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { ServerService } from '../services/server.service';
import { MessagesComponent } from '../Shared/messages/messages.component';
import { AuthenticationService } from '../services/SessionStorage/authentication.service';
import { Global } from '../Shared/global';
import { ShowHideInputDirective } from '../Shared/show-hide-Input/show-hide-Input';
import {
  EmailText,
  PasswordText,
  PasswordRequiredText,
  EmailRequiredText,
  InvalidEmailFormatText,
} from '../language/general-language';
import {
  HeaderText,
  ButtonLogIn,
  ButtonRegister,
  EmailNotFound,
  PasswordNotFound,
} from '../language/log-in';
import { LanguageName } from '../language/language-name';
import { ButtonProvide, ButtonRequest } from '../language/main-home';

@Component({
  selector: 'app-client-log-in',
  templateUrl: './client-log-in.component.html',
  styleUrls: ['./client-log-in.component.css'],
})
export class ClientLogInComponent implements OnInit {
  loginFrm: FormGroup;
  loginStatusSubscription: any;
  password = 'secret';
  show = false;
  hide = true;
  // Messages
  @ViewChild(MessagesComponent, { static: false }) Messages: MessagesComponent;
  @ViewChild(ShowHideInputDirective, { static: false })
  input: ShowHideInputDirective;
  public headerText: LanguageName = HeaderText;
  public buttonLogIn: LanguageName = ButtonLogIn;
  public buttonRegister: LanguageName = ButtonRegister;
  public emailText: LanguageName = EmailText;
  public passwordText: LanguageName = PasswordText;
  public emailRequiredText: LanguageName = EmailRequiredText;
  public passwordRequiredText: LanguageName = PasswordRequiredText;
  public invalidEmailFormatText: LanguageName = InvalidEmailFormatText;
  public emailNotFound: LanguageName = EmailNotFound;
  public passwordNotFound: LanguageName = PasswordNotFound;
  public buttonRequest: LanguageName = ButtonRequest;
  public buttonProvide: LanguageName = ButtonProvide;
  constructor(
    public service: ServerService,
    public router: Router,
    public sessionService: SessionService,
    public auService: AuthenticationService,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loginFrm = this.fb.group({
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [Validators.required]),
    });
    let token = null;
    let emailAddress = null;
    let userRole = null;
    let userFBId = null;
    let firstNameU = null;
    let lastNameU = null;
    let userNameU = null;
    let photoUrlU = null;
    let providerU = null;
    this.loginStatusSubscription = this.auService
      .getLoginStatusEvent()
      .subscribe((isLoggedIn) => {
        if (!this.sessionService.IsAuthenicated) {
          token = localStorage.getItem(Global.tokenKey);
          emailAddress = localStorage.getItem(Global.emailAddress);
          userRole = localStorage.getItem(Global.userRole);
          userFBId = localStorage.getItem(Global.userFBId);
          firstNameU = localStorage.getItem(Global.firstName);
          lastNameU = localStorage.getItem(Global.lastName);
          userNameU = localStorage.getItem(Global.userName);
          photoUrlU = localStorage.getItem(Global.photoUrl);
          providerU = localStorage.getItem(Global.provider);
          if (token) {
            sessionStorage.setItem(Global.tokenKey, token);
            const authUser = {
              EmailAddress: emailAddress,
              RoleName: userRole,
              id: userFBId,
              firstName: firstNameU,
              lastName: lastNameU,
              name: userNameU,
              photoUrl: photoUrlU,
              provider: providerU,
            };
            this.sessionService.setAuthorizeUser(authUser);
            this.auService.redirectLoginUser();
          }
        }
        // alert(isLoggedIn);
      });
  }
  onSubmit(formData: any) {
    const fd = formData.value;
    const emailAddress = fd.emailAddress;
    const passwordU = fd.password;
    // this.router.navigate(['FacebookLogin']);
    // console.log(fd);
    this.service
      .login(`user/login`, {
        client_id: emailAddress,
        password: passwordU,
        role_request: this.sessionService.getRoleRequest(),
      })
      .subscribe(
        (data) => {
          // Success
          const token = data.headers.get('Authorization');
          const role = data.headers.get('role');
          const profile = data.body.message.profile;
          const authUser = {
            EmailAddress: emailAddress,
            RoleName: role,
            id: '',
            firstName: profile.name,
            lastName: profile.surname === null ? ' ' : profile.surname,
            name: '',
            photoUrl: '',
            provider: '',
          };
          this.sessionService.setAuthorizeUser(authUser);
          if (typeof Storage !== 'undefined') {
            localStorage.setItem(Global.tokenKey, token);
            sessionStorage.setItem(Global.tokenKey, token);
          }
          this.auService.reevaluateLoginStatus(authUser);
          if (this.sessionService.mail === 1) {
            this.sessionService.mail = 0;
            this.auService.redirectLoginUser();
            return;
          }
          if (authUser.RoleName === this.sessionService.permission.getService) {
            this.sessionService.setRoleRequest(
              this.sessionService.permission.getService
            );
            // this.router.navigate(['EditProfile']);
            this.router.navigate(['Notification']);
          }
          if (authUser.RoleName === this.sessionService.permission.provider) {
            this.sessionService.setRoleRequest(
              this.sessionService.permission.provider
            );
            this.router.navigate(['ServiceHome']);
          }
        },
        (error) => {
          const statusError = this.service.globalStatusError();
          if (statusError === '409') {
            this.Messages.AddMessage(
              this.emailNotFound[this.sessionService.activeLanguage],
              'alert-danger'
            );
          } else if (statusError === '401') {
            this.Messages.AddMessage(
              this.passwordNotFound[this.sessionService.activeLanguage],
              'alert-danger'
            );
          } else {
            this.Messages.AddMessage(
              this.service.globalMessageError(),
              'alert-danger'
            );
          }
          //   this.router.navigate(['error']);
          return;
        }
      );
  }
  logoutClick() {}
  signUp() {
    if (
      this.sessionService.getRoleRequest() ===
      this.sessionService.permission.getService
    ) {
      this.router.navigate(['Registration']);
    }
    if (
      this.sessionService.getRoleRequest() ===
      this.sessionService.permission.provider
    ) {
      this.router.navigate(['ProviderRegistration']);
    }
  }
  toggleShow() {
    this.show = !this.show;
    // console.log(this.input); //undefined
    if (this.show) {
      this.input.changeType('text');
    } else {
      this.input.changeType('password');
    }
  }
}
