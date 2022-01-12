import {Component, OnInit, ViewChild} from '@angular/core';
import {TypeService} from '../model/TypeService';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {CountryMultipleSelectionComponent} from '../multiple-selection/country-multiple-selection.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Country} from '../model/Country';
// import {ServicesMultipleSelectionComponent} from '../multiple-selection/services-multiple-selection.component';
import {UiService} from '../services/ui.service';
import {AuthenticationService} from '../services/SessionStorage/authentication.service';
import {ServerService} from '../services/server.service';
import {SessionService} from '../services/session.service';
import {ActivatedRoute, Router} from '@angular/router';
import {
  CloseText,
  CompanySizeText,
  EmailText,
  NameText,
  ServicesProvidedText,
  PhoneNumberText,
  EditText,
  EmailRequiredText,
  NameRequiredText,
  InvalidEmailFormatText, BackText
} from '../language/general-language';
import {TaxText, ReceiveEmailAboutHTML, TaxNumberText} from '../language/edit-provide-profile';
import {LanguageName} from '../language/language-name';
import {DomSanitizer} from '@angular/platform-browser';
import {ServicesDetailComponent} from '../view-detail/services-detail.component';
import {CountryDetailComponent} from '../view-detail/country-detail.component';
import {Subscription} from 'rxjs';
import {ChatColumn} from '../model/ChatColumn';

@Component({
  selector: 'app-view-provide-profile',
  templateUrl: './view-provide-profile.component.html',
  styleUrls: ['./view-provide-profile.component.css']
})
export class ViewProvideProfileComponent implements OnInit {
  // params query url
  private routeSubscription: Subscription;
  editProfileFrm: FormGroup;
  hide = true;
  hideCon = true;
  public chatId: number;
  public chat: ChatColumn;
  public typeServices: TypeService[] = [];
  public provideId: number;
  public tabIndex: number;
  // public countryRegions: CountryRegion[] = [];
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  // Сountry Selection
  @ViewChild(CountryDetailComponent, {static: false}) СountrySelection: CountryDetailComponent;
  @ViewChild(ServicesDetailComponent, {static: false}) ServicesSelection: ServicesDetailComponent;
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
  public editText: LanguageName = EditText;
  public nameRequiredText: LanguageName = NameRequiredText;
  public emailRequiredText: LanguageName = EmailRequiredText;
  public invalidEmailFormatText: LanguageName = InvalidEmailFormatText;
  public taxNumberText: LanguageName = TaxNumberText;
  public backText: LanguageName = BackText;
  constructor(public service: ServerService ,
              public router: Router ,
              public sessionService: SessionService,
              public auService: AuthenticationService,
              public uiService: UiService,
              public sanitizer: DomSanitizer,
              public fb: FormBuilder,
              public route: ActivatedRoute) {
    this.routeSubscription = route.params.subscribe(params => this.chatId = Number(params['id']));
    this.tabIndex = 2;
  }

  ngOnInit() {
    this.sessionService.PassCountryAll = [];
    this.sessionService.countryRegions = [];
    this.sessionService.setRoleRequest(this.sessionService.permission.provider);
    this.editProfileFrm = this.fb.group({
      Name: new FormControl('', []),
      CompanySize: new FormControl('', []),
      emailAddress: new FormControl('', []),
      Tax: new FormControl('', []),
      PhoneNumber: new FormControl('', []),
      agree: new FormControl ('', [])
    });
    if (this.sessionService.IsAuthenticatedPage('ViewProvideProfile')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  StartPage() {
    // console.log(this.chatId);
    if ( this.sessionService.AuthorizedUser.RoleName === this.sessionService.permission.provider) {
      this.StartProvider();
    }
    if ( this.sessionService.AuthorizedUser.RoleName === this.sessionService.permission.getService){
      this.StartGetService();
    }
  }
  StartProvider() {
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
            this.ServicesSelection.dataValue(this.selService);
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
  StartGetService() {
    // this.provideId = this.sessionService.getViewProvideId();
    //
    this.service.httpPost(`notification/chat`, {id: this.chatId }).subscribe(
      dataChat => {
        // Success
        if (dataChat.body.message.chat.length > 0) {
          this.chat = dataChat.body.message.chat[0];
          this.provideId = this.chat.provide.id;
          // console.log(this.chat);
          this.service.httpPost(`user/profile_provide_id`, {id: this.provideId}).subscribe(
            profileData => {
              // Success
              const profile = profileData.body.message.profile[0];
              // console.log(profile);
              const username = profile.name;
              const userAddress = profile.email;
              const userPhone = profile.phone;
              const companySize = profile.companySize;
              const tax = profile.tax;
              const receiveEmail = profile.receiveEmail;
              this.editProfileFrm.reset({Name: username,
                emailAddress: userAddress, PhoneNumber: userPhone, CompanySize: companySize, Tax: tax, agree: receiveEmail});
              this.service.httpPost(`country_region/user_country_region`, {id: this.provideId}).subscribe(
                data => {
                  // Success
                  this.sessionService.countryRegions = data.body.message.regions;
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
              this.service.httpPost(`services_selection/user_services_id`, {id: this.provideId}).subscribe(
                dataService => {
                  // console.log(dataService.body.message.services);
                  for (const servic of dataService.body.message.services) {
                    this.selService.push(servic.service);
                    this.selectionServices.push(servic.service.id);
                  }
                  this.ServicesSelection.dataValue(this.selService);
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
      },
      error => {
        this.uiService.LoadingEnd();
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        return;
      }
    );
  }
  countrysLoad(id: number) {
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
  }
  onSubmit(formData: any) {
  }

  closeForm() {
    this.router.navigate(['ServiceHome']);
  }
  editProvideProfile() {
    this.router.navigate(['EditProvideProfile']);
  }
  transformHTML(value) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  backChats() {
    if (this.sessionService.backChatId !== 0) {
      this.router.navigate(
        ['chat', this.sessionService.backChatId],
        {
          queryParams: {
            // 'appNo': "userid"
            // 'price': myItem.price
          }
        }
      );
    } else {
      this.router.navigate(['MyChats']);
    }
  }
}
