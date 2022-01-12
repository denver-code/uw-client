import { Component, OnInit, ViewChild } from '@angular/core';
// import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SessionService} from '../services/session.service';
import {AuthenticationService} from '../services/SessionStorage/authentication.service';
import {UploadComponent} from '../Shared/upload/upload.component';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {Global} from '../Shared/global';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE} from '@angular/material/core';

import {GenderColumn} from '../model/GenderColumn';
import {ServerService} from '../services/server.service';
import {
  NameText, EmailText, PhoneNumberText, SurnameText, EmailRequiredText, InvalidEmailFormatText,
  NameRequiredText, SurnameRequiredText, UserExistsText, UpdateSuccessText
} from '../language/general-language';
import {LanguageName} from '../language/language-name';
import {DateBirthText, GenderText, SkypeText,
  FacebookText, LinkedInText, TwitterText, InstagramText, TelegramText,
  ViberText, WhatsAppText, SaveChangesText, GenderList} from '../language/edit-profile-request';
import {UiService} from '../services/ui.service';
const moment =  _moment;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class EditProfileComponent implements OnInit {
  public tabIndex: number;
  date = new FormControl(moment());
  editProfileFrm: FormGroup;
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  // Upload
  @ViewChild(UploadComponent, {static: false}) Upload: UploadComponent;
  public genderList: GenderColumn[] = GenderList;
  public selectedGender = 1;
  // fileName: string;
  // selectedFile: boolean = false;
  public nameText: LanguageName = NameText;
  public emailText: LanguageName = EmailText;
  public phoneNumberText: LanguageName = PhoneNumberText;
  public surnameText: LanguageName = SurnameText;
  // public allChangesText: LanguageName = AllChangesText;
  public dateBirthText: LanguageName = DateBirthText;
  public genderText: LanguageName = GenderText;
  public skypeText: LanguageName = SkypeText;
  public facebookText: LanguageName = FacebookText;
  public linkedInText: LanguageName = LinkedInText;
  public twitterText: LanguageName = TwitterText;
  public instagramText: LanguageName = InstagramText;
  public telegramText: LanguageName = TelegramText;
  public viberText: LanguageName = ViberText;
  public whatsAppText: LanguageName = WhatsAppText;
  public saveChangesText: LanguageName = SaveChangesText;
  public emailRequiredText: LanguageName = EmailRequiredText;
  public invalidEmailFormatText: LanguageName = InvalidEmailFormatText;
  public nameRequiredText: LanguageName = NameRequiredText;
  public surnameRequiredText: LanguageName = SurnameRequiredText;
  public userExistsText: LanguageName = UserExistsText;
  public updateSuccessTextText: LanguageName = UpdateSuccessText;
  constructor(public service: ServerService ,
              public router: Router ,
              public sessionService: SessionService ,
              public auService: AuthenticationService,
              public uiService: UiService,
              private adapter: DateAdapter<any>,
              public fb: FormBuilder) {
    this.tabIndex = 1;
  }
  ngOnInit() {
    const len = this.sessionService.getActiveLanguage();
    if (len !== 'ZN'){
      this.adapter.setLocale(len);
    } else {
      this.adapter.setLocale('zh_CN');
    }
    this.editProfileFrm = this.fb.group({
      Name: new FormControl('', [Validators.required, this.filledWithSpacesValidator]),
      Surname: new FormControl('', [Validators.required, this.filledWithSpacesValidator]),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      dateOfbirth: new FormControl('', []),
      MobilePhone: new FormControl('', []),
      Six: new FormControl('', []),
      Skype: new FormControl('', []),
      Facebook: new FormControl('', []),
      Twitter: new FormControl('', []),
      LinkedIn: new FormControl('', []),
      Telegram: new FormControl('', []),
      Instagram: new FormControl('', []),
      Viber: new FormControl('', []),
      WhatsApp: new FormControl('', [])
    });
    if (this.sessionService.IsAuthenticatedPage('EditProfile')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  StartPage() {
    this.service.httpGet(`user/profile`, {}).subscribe(
      profileData => {
        // Success
        const profile = profileData.body.message.profile;
        const username = profile.name;
        const userSurname = profile.surname;
        const userAddress = profile.email;
        const userPhone = profile.phone;
        const userSkype = profile.skype;
        const userFacebook = profile.facebook;
        const userTwitter = profile.twitter;
        const userLinkedin = profile.linkedin;
        const userTelegram = profile.telegram;
        const userInstagram = profile.instagram;
        const userViber = profile.viber;
        const userWhatsapp = profile.whatsapp;
        this.selectedGender = profile.gender;
        if (profile.birthDate !== null ) {
          this.date = new FormControl(moment(profile.birthDate));
        }
        this.editProfileFrm.reset({Name: username, Surname: userSurname,
          emailAddress: userAddress, MobilePhone: userPhone, Skype: userSkype,
          Facebook: userFacebook, Twitter: userTwitter, LinkedIn: userLinkedin,
          Telegram: userTelegram, Instagram: userInstagram, Viber: userViber, WhatsApp: userWhatsapp });
      },
      error => {
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        //   this.router.navigate(['error']);
        return;
      }
    );
  }
  onSubmit(formData: any) {
    const fd = formData.value;
    const uName =  (fd.Name || '').trim();
    const uSurname =  (fd.Surname || '').trim();
    const emailAddress = (fd.emailAddress || '').trim();
    const uMobilePhone = (fd.MobilePhone || '').trim();
    const uSkype = (fd.Skype || '').trim();
    const uFacebook = (fd.Facebook || '').trim();
    const uTwitter = (fd.Twitter || '').trim();
    const uLinkedIn = (fd.LinkedIn || '').trim();
    const uTelegram = (fd.Telegram || '').trim();
    const uInstagram = (fd.Instagram || '').trim();
    const uViber = (fd.Viber || '').trim();
    const uWhatsApp = (fd.WhatsApp || '').trim();
    // const dateOfbirth = fd.dateOfbirth;
    let birthDate = '';
    if (this.date.value) {
      const march = moment(this.date.value);
      march.locale('EN');
      birthDate =  march.format('MM.DD.YYYY');
    }
    this.uiService.LoadingStart();
    this.service.httpPost(`user/check_email_role`, {email: emailAddress, role_request: this.sessionService.getRoleRequest()}).subscribe(
      dataCheckEmail => {
        if (dataCheckEmail.body.message.exist) {
          this.uiService.LoadingEnd();
          this.Messages.AddMessage(this.userExistsText[this.sessionService.activeLanguage], 'alert-danger');
          return;
        } else {
          // console.log('OK');
          this.service.httpPost(`user/update`, {name: uName , surname: uSurname,
            email: emailAddress, birth_date: birthDate,
            phone: uMobilePhone, gender: this.selectedGender, skype: uSkype, facebook: uFacebook, twitter: uTwitter,
            linkedin: uLinkedIn, telegram: uTelegram, instagram: uInstagram,
            viber: uViber, whatsapp: uWhatsApp, language: this.sessionService.activeLanguage }).subscribe(
            data => {
              this.uiService.LoadingEnd();
              // Success
              this.sessionService.AuthorizedUser.EmailAddress = emailAddress;
              this.sessionService.AuthorizedUser.firstName = uName;
              this.sessionService.AuthorizedUser.lastName = uSurname;
              const authUser = {
                EmailAddress: emailAddress,
                RoleName: this.sessionService.permission.getService,
                id: '',
                firstName: uName,
                lastName: uSurname,
                name: '',
                photoUrl: '',
                provider: ''
              };
              this.sessionService.setAuthorizeUser(authUser);
              this.Messages.AddMessage(this.updateSuccessTextText[this.sessionService.activeLanguage], 'alert-success');
            },
            error => {
              this.uiService.LoadingEnd();
              this.Messages.AddMessage(this.service.globalMessageError() + ' UserError: ' + this.service.globalUserError(), 'alert-danger');
              //   this.router.navigate(['error']);
              return;
            }
          );
        }
      },
      error => {
        this.uiService.LoadingEnd();
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        return;
      }
    );
  }
  DatepickerEvent(elName: string, event: MatDatepickerInputEvent<Date>) {
    setTimeout(function explode() {
      document.getElementById(elName).focus();
    }, 100);
  }
  filledWithSpacesValidator(control: FormControl): { [s: string]: boolean } {
    // const inpPassword: any = document.querySelector('[formControlName="newPassword"]');
    const usValue = (control.value || '').trim();
    if (usValue === '') {
      return { Name : true};
    }
    return null;
  }
  public navEvent(event: any){
    // 'en-GB' event.value zh_CN
    if (event.value !== 'ZN'){
      this.adapter.setLocale(event.value);
    } else {
      this.adapter.setLocale('zh_CN');
    }

    // this.adapter.
    // useValue
    // const dateN = this.date.value.format('MM.DD.YYYY');
    // this.adapter. format(dateN, 'MM.DD.YYYY');
  }
}
