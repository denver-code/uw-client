import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {SessionService} from '../services/session.service';
import {AuthenticationService} from '../services/SessionStorage/authentication.service';
import {Country} from '../model/Country';
import {City} from '../model/City';
import {TypeService} from '../model/TypeService';
import {Region} from '../model/Region';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import {ServerService} from '../services/server.service';
import {Global} from '../Shared/global';
import {Subscription} from 'rxjs';
import {NotificationColumn} from '../model/NotificationColumn';
import {UiService} from '../services/ui.service';
import {СountrySelectionComponent} from './selection/country-selection.component';
import {RegionsSelectionComponent} from './selection/regions-selection.component';
import {ServicesSelectionComponent} from './selection/services-selection.component';
import {DataSelectionEventInformation, SelectionEventType} from '../Shared/selection.core';
import {CancelText, CityText, CountryText, DateText, PublishText,
  RegionText, PleaseDescriptionText, DescriptionText} from '../language/general-language';
import {LanguageName} from '../language/language-name';
import {RequestTitleText, TypeServiceText, RequestTitleRequiredText, RequestNameText} from '../language/view-notification';
import {CitiesSelectionComponent} from './selection/cities-selection.component';
const moment =  _moment;

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.css'],
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
export class AddNotificationComponent implements OnInit {
  // params query url
  private routeSubscription: Subscription;
  // private querySubscription: Subscription;
  public id: number;
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  // Сountry Selection
  @ViewChild(СountrySelectionComponent, {static: false}) СountrySelection: СountrySelectionComponent;
  @ViewChild(RegionsSelectionComponent, {static: false}) RegionsSelection: RegionsSelectionComponent;
  @ViewChild(ServicesSelectionComponent, {static: false}) ServicesSelection: ServicesSelectionComponent;
  @ViewChild(CitiesSelectionComponent, {static: false}) CitiesSelection: CitiesSelectionComponent;

  public notification: NotificationColumn;
  date = new FormControl(moment());
  public typeServices: TypeService[] = [];
  public selectedTypeServices = 0;
  public lanName = 'nameEN';
  public countrys: Country[] = [];
  public selectedCountrys = 0;
  public citys: City[] = [];
  public selectedCity = 0;
  public regions: Region[] = [];
  public selectedRegion = 0;
  settingsFrm: FormGroup;
  disableSelectCity = new FormControl(true);
  public cancelText: LanguageName = CancelText;
  public publishText: LanguageName = PublishText;
  public dateText: LanguageName = DateText;
  public countryText: LanguageName = CountryText;
  public cityText: LanguageName = CityText;
  public regionText: LanguageName = RegionText;
  public requestTitleText: LanguageName = RequestTitleText;
  public typeServiceText: LanguageName = TypeServiceText;
  public requestTitleRequiredText: LanguageName = RequestTitleRequiredText;
  public requestNameText: LanguageName = RequestNameText;
  public pleaseDescriptionText: LanguageName = PleaseDescriptionText;
  public descriptionText: LanguageName = DescriptionText;
  constructor(
    public router: Router ,
    public service: ServerService ,
    public sessionService: SessionService ,
    public auService: AuthenticationService,
    public uiService: UiService,
    private adapter: DateAdapter<any>,
    public fb: FormBuilder,
    public route: ActivatedRoute
  ) {
    this.routeSubscription = route.params.subscribe(params => this.id = parseInt(params['id']));
    // this.querySubscription = route.queryParams.subscribe(
    //   (queryParam: any) => {
    //     this.appNo = queryParam['appNo'];
    //   }
    // );
  }
  ngOnInit() {
    this.notification = {id: 0, name: '', description: '',
      createdAt: '', updatedAt: ''};
    this.settingsFrm = this.fb.group({
      nName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
    if (this.sessionService.IsAuthenticatedPage('add-notification')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  DatepickerEvent(elName: string, event: MatDatepickerInputEvent<Date>) {
    setTimeout(function explode() {
      document.getElementById(elName).focus();
    }, 100);
  }
  StartPage() {
    const len = this.sessionService.getActiveLanguage();
    if (len !== 'ZN'){
      this.adapter.setLocale(len);
    } else {
      this.adapter.setLocale('zh_CN');
    }
    this.lanName = 'name' + this.sessionService.getActiveLanguage();
    this.service.httpGet(`service/all`, {}).subscribe(
      servicesData => {
        // Success
        this.typeServices  = servicesData.body.message.services;
        // ServicesSelection
        this.ServicesSelection.databind(this.typeServices);
        this.ServicesSelection.dataValue(this.selectedTypeServices);
      },
      error => {
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        //   this.router.navigate(['error']);
        return;
      }
    );

    if (this.id !== 0 ) {
      this.service.httpPost(`user/notification`, {id: this.id}).subscribe(
        data => {
          // Success
          this.notification = data.body.message.notification;
          this.date = new FormControl(moment(this.notification.createdAt));
          this.settingsFrm.reset({nName: this.notification.name, description: this.notification.description});
          if (data.body.message.notification.country != null) {
            this.selectedCountrys = data.body.message.notification.country.id;
            this.countrysLoad(this.selectedCountrys);
            this.RegionsSelection.disableSelect = new FormControl(false);
            this.regionsLoad(this.selectedCountrys);
            if (data.body.message.notification.region != null) {
              this.selectedRegion = data.body.message.notification.region.id;
              // this.disableSelectCity = new FormControl(false);
              this.CitiesSelection.disableSelect = new FormControl(false);
              this.citysLoad(this.selectedCountrys, this.selectedRegion);
              if (data.body.message.notification.city != null) {
                this.selectedCity = data.body.message.notification.city.id;
              }
            }
          }
          if (data.body.message.notification.service != null) {
            this.selectedTypeServices = data.body.message.notification.service.id;
            this.ServicesSelection.dataValue(this.selectedTypeServices);
          }
          // service
          // this.selectedRegion
        },
        error => {
          this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
          return;
        }
      );
    } else {
      this.countrysLoad(0);
    }
  }
  CanselAnnouncement() {
    this.router.navigate(['Notification']);
  }
  onSubmit(formData: any) {
    const fd = formData.value;
    const nName = fd.nName;
    const nDescription = fd.description;
    if (this.id === 0 ) {
      this.service.httpPost(`customer/addnotification`, {name :  nName, description: nDescription,
        country: this.selectedCountrys, city: this.selectedCity,
        region: this.selectedRegion, service: this.selectedTypeServices}).subscribe(
        data => {
          this.router.navigate(['Notification']);
        },
        error => {
          // const statusError = this.service.globalStatusError();
          this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
          return;
        }
      );
    }
    if (this.id !== 0 ) {
      this.service.httpPost(`customer/updatenotification`, {id: this.id, name :  nName, description: nDescription,
        country: this.selectedCountrys, city: this.selectedCity,
        region: this.selectedRegion, service: this.selectedTypeServices}).subscribe(
        data => {
          this.router.navigate(['Notification']);
        },
        error => {
          // const statusError = this.service.globalStatusError();
          this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
          return;
        }
      );
    }
  }
  citysLoad(cnid: number, regId: number) {
    this.uiService.LoadingStart();
    this.service.httpPost(`citys/country`, { countryId :  cnid, regionId : regId}).subscribe(
      cityData => {
        // Success
        this.uiService.LoadingEnd();
        this.citys  = cityData.body.message.сitys;
        if (this.citys.length === 0) {
          this.CitiesSelection.disableSelect = new FormControl(true);
        }
        this.CitiesSelection.databind(this.citys);
        if (regId !== 0) {
          this.CitiesSelection.dataValue(this.selectedCity);
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
    this.uiService.LoadingStart();
    this.service.httpGet(`country/all`, {}).subscribe(
      countryData => {
        // Success
        this.uiService.LoadingEnd();
        this.countrys  = countryData.body.message.countrys;
        this.СountrySelection.databind(this.countrys);
        if (id !== 0) {
          this.СountrySelection.dataValue(id);
        }
      },
      error => {
        this.uiService.LoadingEnd();
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        //   this.router.navigate(['error']);
        return;
      }
    );
  }
  regionsLoad(id: number) {
    this.uiService.LoadingStart();
    this.service.httpPost(`regions/country`, { id :  id}).subscribe(
      regionData => {
        // Success
        this.regions  = regionData.body.message.regions;
        this.uiService.LoadingEnd();
        if (this.regions.length === 0) {
          this.RegionsSelection.disableSelect = new FormControl(true);
        }
        this.RegionsSelection.databind(this.regions);
        if (id !== 0) {
          this.RegionsSelection.dataValue(this.selectedRegion);
        }
      },
      error => {
        this.uiService.LoadingEnd();
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        //   this.router.navigate(['error']);
        return;
      }
    );
  }
  countryEvent(countryEvent: any) {
    const selectionEvent: DataSelectionEventInformation = countryEvent.value;
    if (selectionEvent.SelectionEventType === SelectionEventType.SelectionChanged ) {
      const sCountry = selectionEvent.value as Country;
      this.selectedCountrys = sCountry.id;
      // console.log(this.selectedCountrys);
      if (this.selectedCountrys as number > 0) {
        this.citys = [];
        this.selectedCity = 0;
        this.regions = [];
        this.selectedRegion = 0;
        // this.disableSelect = new FormControl(false);
        this.RegionsSelection.disableSelect = new FormControl(true);
        // this.disableSelectCity = new FormControl(true);
        // this.citysLoad(this.selectedCountrys);
        this.CitiesSelection.databind(this.citys);
        this.CitiesSelection.dataValue(this.selectedCity);
        this.CitiesSelection.disableSelect = new FormControl(true);
        this.regionsLoad(this.selectedCountrys);
      }
    }
  }
  regionsEvent(countryEvent: any) {
    const selectionEvent: DataSelectionEventInformation = countryEvent.value;
    if (selectionEvent.SelectionEventType === SelectionEventType.SelectionChanged ) {
      this.selectedRegion = selectionEvent.value.id;
      // console.log(this.selectedRegion);
      // const sCountry = selectionEvent.value as Country;
      // this.selectedCountrys = sCountry.id;
      // // console.log(this.selectedCountrys);
      if (this.selectedCountrys as number > 0) {
      this.citys = [];
      this.selectedCity = 0;
      //   this.regions = [];
      //   this.selectedRegion = 0;
      //   this.disableSelect = new FormControl(false);
      // this.disableSelectCity = new FormControl(false);
      this.CitiesSelection.disableSelect = new FormControl(false);
      this.citysLoad(this.selectedCountrys, this.selectedRegion );
      }
    }
  }
  citiesEvent(countryEvent: any) {
    const selectionEvent: DataSelectionEventInformation = countryEvent.value;
    if (selectionEvent.SelectionEventType === SelectionEventType.SelectionChanged ) {
      this.selectedCity = selectionEvent.value.id;
    }
  }
  servicesEvent(countryEvent: any) {
    const selectionEvent: DataSelectionEventInformation = countryEvent.value;
    if (selectionEvent.SelectionEventType === SelectionEventType.SelectionChanged ) {
       // console.log(selectionEvent.value.id);
       this.selectedTypeServices = selectionEvent.value.id;
    }
  }
  public navEvent(event: any){
    this.lanName = 'name' + event.value;
    // this.adapter.setLocale(event.value);
    if (event.value !== 'ZN'){
      this.adapter.setLocale(event.value);
    } else {
      this.adapter.setLocale('zh_CN');
    }
  }
}
