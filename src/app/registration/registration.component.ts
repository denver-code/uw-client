import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../services/session.service';
import { ServerService } from '../services/server.service';
import { UiService } from '../services/ui.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Global } from '../Shared/global';
import { MessagesComponent } from '../Shared/messages/messages.component';
import { AuthenticationService } from '../services/SessionStorage/authentication.service';
import { IAgreeHTML } from '../language/registration-request';
import {
  RegistrationText,
  CloseText,
  NameText,
  EmailText,
  PasswordText,
  ConfirmPasswordText,
  SurnameText,
  NameRequiredText,
  SurnameRequiredText,
  EmailRequiredText,
  InvalidEmailFormatText,
  PasswordRequiredText,
  RepeatPasswordRequiredText,
  PasswordConfirmationPasswordText,
  VerificationPasswordText,
  UserExistsText,
} from '../language/general-language';
import { LanguageName } from '../language/language-name';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  editProfileFrm: FormGroup;
  hide = true;
  hideCon = true;
  // Messages
  @ViewChild(MessagesComponent, { static: false }) Messages: MessagesComponent;
  public nameText: LanguageName = NameText;
  public surnameText: LanguageName = SurnameText;
  public emailText: LanguageName = EmailText;
  public passwordText: LanguageName = PasswordText;
  public confirmPasswordText: LanguageName = ConfirmPasswordText;
  public registrationText: LanguageName = RegistrationText;
  public closeText: LanguageName = CloseText;
  public iAgreeHTML: LanguageName = IAgreeHTML;
  public nameRequiredText: LanguageName = NameRequiredText;
  public surnameRequiredText: LanguageName = SurnameRequiredText;
  public emailRequiredText: LanguageName = EmailRequiredText;
  public invalidEmailFormatText: LanguageName = InvalidEmailFormatText;
  public passwordRequiredText: LanguageName = PasswordRequiredText;
  public repeatPasswordRequiredText: LanguageName = RepeatPasswordRequiredText;
  public passwordConfirmationPasswordText: LanguageName =
    PasswordConfirmationPasswordText;
  public verificationPasswordText: LanguageName = VerificationPasswordText;
  public userExistsText: LanguageName = UserExistsText;
  public validatorPassword = false;
  constructor(
    public service: ServerService,
    public router: Router,
    public sessionService: SessionService,
    public auService: AuthenticationService,
    public uiService: UiService,
    public sanitizer: DomSanitizer,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.sessionService.setRoleRequest(
      this.sessionService.permission.getService
    );
    this.editProfileFrm = this.fb.group({
      Name: new FormControl('', [
        Validators.required,
        this.filledWithSpacesValidator,
      ]),
      Surname: new FormControl('', [
        Validators.required,
        this.filledWithSpacesValidator,
      ]),
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        this.verificationData,
      ]),
      passwordConfirm: new FormControl('', [Validators.required]),
      agree: new FormControl('', [
        (control) => {
          return !control.value ? { required: true } : null;
        },
      ]),
    });
    this.StartPage();
  }
  StartPage() {}
  onSubmit(formData: any) {
    const fd = formData.value;
    const emailAddress = (fd.emailAddress || '').trim();
    const passwordU = fd.newPassword;
    const usName = (fd.Name || '').trim();
    const usSurname = (fd.Surname || '').trim();
    this.uiService.LoadingStart();
    // check email
    this.service
      .create(`user/check_email`, {
        email: emailAddress,
        role_request: this.sessionService.getRoleRequest(),
      })
      .subscribe(
        (dataCheckEmail) => {
          if (dataCheckEmail.body.message.exist) {
            this.uiService.LoadingEnd();
            this.Messages.AddMessage(
              this.userExistsText[this.sessionService.activeLanguage],
              'alert-danger'
            );
            return;
          } else {
            this.service
              .create(`customer/create`, {
                name: usName,
                surname: usSurname,
                email: emailAddress,
                password: passwordU,
                phone: '8089',
                role_request: this.sessionService.getRoleRequest(),
                language: this.sessionService.activeLanguage,
              })
              .subscribe(
                (data) => {
                  this.service
                    .sendEmail(`sendemail/send`, {
                      name: usName,
                      email: emailAddress,
                      password: passwordU,
                      role: this.sessionService.getRoleRequest(),
                      lan: this.sessionService.activeLanguage,
                    })
                    .subscribe(
                      (dataEmail) => {
                        // Success
                        this.service
                          .login(`user/login`, {
                            client_id: emailAddress,
                            password: passwordU,
                            role_request: this.sessionService.getRoleRequest(),
                          })
                          .subscribe(
                            (datalog) => {
                              // Success
                              const token =
                                datalog.headers.get('Authorization');
                              const role = datalog.headers.get('role');
                              const profile = datalog.body.message.profile;
                              const authUser = {
                                EmailAddress: emailAddress,
                                RoleName: role,
                                id: '',
                                firstName: profile.name,
                                lastName:
                                  profile.surname === null
                                    ? ' '
                                    : profile.surname,
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
                              this.uiService.LoadingEnd();
                              // this.Messages.AddMessage('successfully' + ' role =' + role, 'alert-success');
                              if (
                                authUser.RoleName ===
                                this.sessionService.permission.getService
                              ) {
                                this.router.navigate(['Notification']);
                              }
                              if (
                                authUser.RoleName ===
                                this.sessionService.permission.provider
                              ) {
                                this.router.navigate(['ServiceUserProfile']);
                              }
                            },
                            (error) => {
                              this.uiService.LoadingEnd();
                              const statusError =
                                this.service.globalStatusError();
                              if (statusError === '409') {
                                this.Messages.AddMessage(
                                  'no such email',
                                  'alert-danger'
                                );
                              } else if (statusError === '401') {
                                this.Messages.AddMessage(
                                  'wrong password',
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
                      },
                      (error) => {
                        this.uiService.LoadingEnd();
                        this.Messages.AddMessage(
                          this.service.globalMessageError(),
                          'alert-danger'
                        );
                        return;
                      }
                    );
                },
                (error) => {
                  this.uiService.LoadingEnd();
                  const statusError = this.service.globalStatusError();
                  this.Messages.AddMessage(
                    this.service.globalMessageError(),
                    'alert-danger'
                  );
                  return;
                }
              );
          }
        },
        (error) => {
          this.uiService.LoadingEnd();
          this.Messages.AddMessage(
            this.service.globalMessageError(),
            'alert-danger'
          );
          return;
        }
      );
  }
  // passwordConfirmationValidator(control: FormControl): { [s: string]: boolean } {
  //   const inpPassword: any = document.querySelector('[formControlName="newPassword"]');
  //   if (control.value !== inpPassword.value) {
  //     return { passwordConfirm : true};
  //   }
  //   return null;
  // }
  onNewPasswordChange(searchValue: string): void {
    const inpPassword: any = document.querySelector(
      '[formControlName="passwordConfirm"]'
    );
    if (inpPassword.value !== '') {
      if (searchValue !== inpPassword.value) {
        passwordErrorHide('block');
        passwordConfirmationErrorHide('block');
        this.validatorPassword = false;
      } else {
        passwordErrorHide('none');
        passwordConfirmationErrorHide('none');
        this.validatorPassword = true;
      }
    } else {
      this.validatorPassword = false;
    }
    // console.log(searchValue);
    // console.log(inpPassword.value);
  }
  onPasswordConfirmChange(searchValue: string): void {
    const inpPassword: any = document.querySelector(
      '[formControlName="newPassword"]'
    );
    if (inpPassword.value !== '') {
      if (searchValue !== inpPassword.value) {
        passwordConfirmationErrorHide('block');
        passwordErrorHide('none');
        this.validatorPassword = false;
      } else {
        passwordConfirmationErrorHide('none');
        passwordErrorHide('none');
        this.validatorPassword = true;
      }
    } else {
      this.validatorPassword = false;
    }
    // console.log(searchValue);
    // console.log(inpPassword.value);
  }
  verificationData(control: FormControl): { [s: string]: boolean } {
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'
    );
    const specialСharacters = new RegExp(
      '^(?=.*[-?!@#{}$%^&*=><:;+.?@|~,^[\'"`])(?=.{8,})'
    );
    // const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
    if (control.value.length < 8) {
      return { newPassword: true };
    }
    if (!strongRegex.test(control.value)) {
      return { newPassword: true };
    } else {
      // check special characters
      if (!specialСharacters.test(control.value)) {
        if (control.value.indexOf('\\') !== -1) {
          return null;
        }
        if (control.value.indexOf(']') !== -1) {
          return null;
        }
        return { newPassword: true };
      } else {
        // control.value
      }
    }
    return null;
  }
  closeForm() {
    this.router.navigate(['LogIn']);
  }
  transformHTML(value) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  filledWithSpacesValidator(control: FormControl): { [s: string]: boolean } {
    // const inpPassword: any = document.querySelector('[formControlName="newPassword"]');
    const usValue = (control.value || '').trim();
    if (usValue === '') {
      return { Name: true };
    }
    return null;
  }
}
