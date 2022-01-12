import {Component, OnInit, ViewChild} from '@angular/core';
import {TypeService} from '../model/TypeService';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {CountryMultipleSelectionComponent} from '../multiple-selection/country-multiple-selection.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Country} from '../model/Country';
import {ServicesMultipleSelectionComponent} from '../multiple-selection/services-multiple-selection.component';
import {UiService} from '../services/ui.service';
import {AuthenticationService} from '../services/SessionStorage/authentication.service';
import {ServerService} from '../services/server.service';
import {SessionService} from '../services/session.service';
import {Router} from '@angular/router';
import {
  CloseText,
  CompanySizeText,
  EmailText,
  NameText,
  ServicesProvidedText,
  PhoneNumberText,
  SaveText,
  EmailRequiredText,
  NameRequiredText,
  InvalidEmailFormatText, UserExistsText, UpdateSuccessText
} from '../language/general-language';
import {TaxText, ReceiveEmailAboutHTML, TaxNumberText} from '../language/edit-provide-profile';
import {LanguageName} from '../language/language-name';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-edit-provide-profile',
  templateUrl: './edit-provide-profile.component.html',
  styleUrls: ['./edit-provide-profile.component.css']
})
export class EditProvideProfileComponent implements OnInit {
  editProfileFrm: FormGroup;
  hide = true;
  hideCon = true;
  public typeServices: TypeService[] = [];
  // public countryRegions: CountryRegion[] = [];
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  // Сountry Selection
  @ViewChild(CountryMultipleSelectionComponent, {static: false}) СountrySelection: CountryMultipleSelectionComponent;
  @ViewChild(ServicesMultipleSelectionComponent, {static: false}) ServicesSelection: ServicesMultipleSelectionComponent;
  public countrys: Country[] = [];
  public selectionCountrys: number[] = [];
  public selectionServices: number[] = [];
  public selService: TypeService[] = [];
  public servicesProvidedText: LanguageName = ServicesProvidedText;
  public closeText: LanguageName = CloseText;
  public nameText: LanguageName = NameText;
  public emailText: LanguageName = EmailText;
  public companySizeText: LanguageName = CompanySizeText;
  public phoneNumberText: LanguageName = PhoneNumberText;
  public taxText: LanguageName = TaxText;
  public receiveEmailAboutHTML: LanguageName = ReceiveEmailAboutHTML;
  public saveText: LanguageName = SaveText;
  public nameRequiredText: LanguageName = NameRequiredText;
  public emailRequiredText: LanguageName = EmailRequiredText;
  public invalidEmailFormatText: LanguageName = InvalidEmailFormatText;
  public taxNumberText: LanguageName = TaxNumberText;
  public userExistsText: LanguageName = UserExistsText;
  public updateSuccessTextText: LanguageName = UpdateSuccessText;
  constructor(public service: ServerService ,
              public router: Router ,
              public sessionService: SessionService,
              public auService: AuthenticationService,
              public uiService: UiService,
              public sanitizer: DomSanitizer,
              public fb: FormBuilder) { }
  ngOnInit() {
    this.sessionService.PassCountryAll = [];
    this.sessionService.countryRegions = [];
    this.sessionService.setRoleRequest(this.sessionService.permission.provider);
    this.editProfileFrm = this.fb.group({
      Name: new FormControl('', [Validators.required, this.filledWithSpacesValidator]),
      CompanySize: new FormControl('', []),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      Tax: new FormControl('', []),
      PhoneNumber: new FormControl('', []),
      agree: new FormControl ('', [])
      // agree: new FormControl ('', [(control) => {
      //     return  !control.value ? { required: false } : null;
      //   }]
      // )
    });
    if (this.sessionService.IsAuthenticatedPage('EditProvideProfile')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  StartPage() {
    this.service.httpGet(`user/profile_provide`, {}).subscribe(
      profileData => {
        // Success
        const profile = profileData.body.message.profile;
        const username = profile.name;
        const userAddress = profile.email;
        const userPhone = profile.phone;
        const companySize = profile.companySize;
        const tax = profile.tax;
        const receiveEmail = profile.receiveEmail;
        this.editProfileFrm.reset({Name: username,
          emailAddress: userAddress, PhoneNumber: userPhone, CompanySize: companySize, Tax: tax, agree: receiveEmail});
        this.service.httpPost(`country_region/user`, {}).subscribe(
          data => {
            // Success
            this.sessionService.countryRegions = data.body.message.regions;
            // console.log(this.sessionService.countryRegions);
            this.countrysLoad(1);
            // this.uiService.LoadingEnd();
            // this.Messages.AddMessage('update success', 'alert-success');
          },
          error => {
            // this.uiService.LoadingEnd();
            this.Messages.AddMessage(this.service.globalMessageError() + ' UserError: ' + this.service.globalUserError(), 'alert-danger');
            //   this.router.navigate(['error']);
            return;
          }
        );
        // service load
        this.service.httpPost(`services_selection/user_services`, {}).subscribe(
          dataService => {
            // console.log(dataService.body.message.services);
            for (const servic of dataService.body.message.services) {
              this.selService.push(servic.service);
              this.selectionServices.push(servic.service.id);
            }
            this.service.httpGetSelect(`service/all`, {}).subscribe(
              servicesData => {
                // Success
                this.typeServices  = servicesData.body.message.services;
                this.selService.sort((a, b) => (a.nameEN > b.nameEN) ? 1 : -1)
                this.ServicesSelection.databind(this.typeServices);
                this.ServicesSelection.dataValue(this.selService);
              },
              error => {
                this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
                //   this.router.navigate(['error']);
                return;
              }
            );
            // Success
            // this.sessionService.countryRegions = data.body.message.regions;
            // console.log(this.sessionService.countryRegions);
            // this.countrysLoad(1);
            // this.uiService.LoadingEnd();
            // this.Messages.AddMessage('update success', 'alert-success');
          },
          error => {
            // this.uiService.LoadingEnd();
            this.Messages.AddMessage(this.service.globalMessageError() + ' UserError: ' + this.service.globalUserError(), 'alert-danger');
            //   this.router.navigate(['error']);
            return;
          }
        );
      },
      error => {
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        //   this.router.navigate(['error']);
        return;
      }
    );

  }
  countrysLoad(id: number) {
    this.service.httpGetSelect(`country/all`, {}).subscribe(
      countryData => {
        // Success
        this.countrys  = countryData.body.message.countrys;
        this.СountrySelection.databind(this.countrys);
        if (id !== -1) {
          const selCountry: Country[] = [];
          for (const counRegions of this.sessionService.countryRegions) {
            const se = selCountry.find(x => x.id === counRegions.country.id);
            if (se === undefined) {
              selCountry.push(counRegions.country);
              this.sessionService.PassCountryAll.push(counRegions.country);
            }
          }
          selCountry.sort((a, b) => (a.name > b.name) ? 1 : -1)
          this.СountrySelection.dataValue(selCountry);
        }
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
    const emailAddress = (fd.emailAddress || '').trim();
    const usName = (fd.Name || '').trim();
    const usCompanySize = (fd.CompanySize || '').trim();
    const usPhoneNumber = (fd.PhoneNumber || '').trim();
    const usTax = (fd.Tax || '').trim();
    if ( this.sessionService.PassCountryAll.length > 0) {
      if (this.selectionServices.length > 0) {
        this.uiService.LoadingStart();
        this.service.httpPost(`user/check_email_role`, {email: emailAddress, role_request: this.sessionService.getRoleRequest()}).subscribe(
          dataCheckEmail => {
            if (dataCheckEmail.body.message.exist) {
              this.uiService.LoadingEnd();
              this.Messages.AddMessage(this.userExistsText[this.sessionService.activeLanguage], 'alert-danger');
              return;
            } else {
              console.log('OK');
              this.service.httpPost(`user/update_provide`, {name: usName ,
                email: emailAddress, companySize: usCompanySize,
                phone: usPhoneNumber, tax: usTax, receiveEmail: fd.agree, countris: this.sessionService.PassCountryAll,
                services: this.selectionServices, language: this.sessionService.activeLanguage}).subscribe(
                data => {
                  // Success
                  this.sessionService.AuthorizedUser.EmailAddress = emailAddress;
                  this.sessionService.AuthorizedUser.firstName = usName;
                  this.uiService.LoadingEnd();
                  const authUser = {
                    EmailAddress: emailAddress,
                    RoleName: this.sessionService.permission.provider,
                    id: '',
                    firstName: usName,
                    lastName: '',
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
      } else {
        this.Messages.AddMessage('select services', 'alert-danger');
      }
    } else {
      this.Messages.AddMessage('select a country', 'alert-danger');
    }
  }
  countryEvent(countryEvent: any) {
    this.selectionCountrys = [];
    countryEvent.value.forEach((element) => {
      this.selectionCountrys.push(element.id);
    });
  }
  servicesEvent(servicesEvent: any) {
    this.selectionServices = [];
    servicesEvent.value.forEach((element) => {
      this.selectionServices.push(element.id);
    });
  }
  closeForm() {
    this.router.navigate(['ServiceHome']);
  }
  invalidFrm() {
     let invalid = false;
     if ( this.editProfileFrm.invalid ) {
       invalid = this.editProfileFrm.invalid;
       return invalid;
     }
     if ( this.selectionServices.length === 0) {
       invalid = true;
       return invalid;
     }
     if ( this.sessionService.PassCountryAll.length === 0) {
       invalid = true;
       return invalid;
     }
     return invalid;
  }

  filledWithSpacesValidator(control: FormControl): { [s: string]: boolean } {
    // const inpPassword: any = document.querySelector('[formControlName="newPassword"]');
    const usValue = (control.value || '').trim();
    if (usValue === '') {
      return { Name : true};
    }
    return null;
  }

  transformHTML(value) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
