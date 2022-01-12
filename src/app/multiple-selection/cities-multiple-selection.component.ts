import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import {UiService} from '../services/ui.service';
import {AuthenticationService} from '../services/SessionStorage/authentication.service';
import {ServerService} from '../services/server.service';
import {SessionService} from '../services/session.service';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {City} from '../model/City';
import {PassRegion} from '../model/pass/PassRegion';
import {PassCountry} from '../model/pass/PassCountry';
import {NoEntriesFoundLabelText, SelectedCitiesText} from '../language/general-language';
import {LanguageName} from '../language/language-name';

@Component({
  selector: 'app-cities-multiple-selection',
  templateUrl: './cities-multiple-selection.component.html',
  styleUrls: ['./cities-multiple-selection.component.css']
})
export class CitiesMultipleSelectionComponent implements OnInit, AfterViewInit, OnDestroy {
  /** list of cities */
  @Input() countryId: number;
  @Input() regionId: number;
  public selectedCitiesText: LanguageName = SelectedCitiesText;
  public noEntriesFoundLabelText: LanguageName = NoEntriesFoundLabelText;
  public cities: City[];
  public country: PassCountry = { id: -1 , regions: []};
  public region: PassRegion = {id: -1 , cities: []};
  /** control for the selected bank for multi-selection */
  public cityMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public cityMultiFilterCtrl: FormControl = new FormControl();

  /** list of cities filtered by search keyword */
  public filteredCitiesMulti: ReplaySubject<City[]> = new ReplaySubject<City[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  public onDestroy = new Subject<void>();
  // Messages
  @ViewChild(MessagesComponent, {static: true}) Messages: MessagesComponent;

  constructor(public service: ServerService ,
              public sessionService: SessionService ,
              public auService: AuthenticationService,
              public uiService: UiService) { }

  ngOnInit() {
    if (this.region.id === -1) {
      this.uiService.LoadingStart();
      this.service.httpPostSelect(`citys/country`, { countryId : this.countryId, regionId : this.regionId}).subscribe(
        cityData => {
          // Success
          this.cities  = cityData.body.message.сitys;
          this.uiService.LoadingEnd();
          // set initial selection
          // this.cityMultiCtrl.setValue([this.cities[10], this.cities[11], this.cities[12]]);
          const selCitis: City[] = [];
          for (const counRegions of this.sessionService.countryRegions) {
            if (counRegions.region !== null) {
              // console.log(counRegions.region);
              if (counRegions.region.id === this.regionId) {
                if (counRegions.city) {
                  const se = selCitis.find(x => x.id === counRegions.city.id);
                  if (se === undefined) {
                    selCitis.push(counRegions.city);
                    // console.log(counRegions.city);
                    if (counRegions.city) {
                      this.citiesAdd(counRegions.city);
                    }
                  }
                }
              }
            }
          }
          selCitis.sort((a, b) => (a.name > b.name) ? 1 : -1)
          if (this.cityMultiCtrl.value === null) {
            this.cityMultiCtrl.setValue(selCitis);
          }
          // load the initial bank list
          this.filteredCitiesMulti.next(this.cities.slice());

          // listen for search field value changes
          this.cityMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.filterBanksMulti();
            });
        },
        error => {
          this.uiService.LoadingEnd();
          this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
          return;
        }
      );
    }
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredCitiesMulti
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: City, b: City) => a && b && a.id === b.id;
      });
  }

  protected filterBanksMulti() {
    if (!this.cities) {
      return;
    }
    // get the search keyword
    let search = this.cityMultiFilterCtrl.value;
    if (!search) {
      this.filteredCitiesMulti.next(this.cities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the cities
    this.filteredCitiesMulti.next(
      this.cities.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }
  citiesAdd(selCitis: City) {
    if (this.country.id === -1) {
      const coun = this.sessionService.PassCountryAll.filter(c => c.id === this.countryId);
      if (coun.length > 0) {
        if (coun[0].regions !== undefined) {
          const  reg = coun[0].regions.filter(r => r.id === this.regionId);
          if (reg.length > 0) {
            if (reg[0].cities !== undefined) {
              reg[0].cities.push(selCitis.id);
            }
            // console.log(reg[0]);
          }
        }

      }
    }
  }
  citiesChange(ev: any) {
    if (this.country.id === -1) {
      const coun = this.sessionService.PassCountryAll.filter(c => c.id === this.countryId);
      if (coun.length > 0) {
        this.country = coun[0];
        const  reg = this.country.regions.filter(r => r.id === this.regionId);
        if (reg.length > 0) {
          this.region = reg[0];
        }
      }
    }
    this.region.cities = [];
    this.cityMultiCtrl.value.forEach( value => {
      this.region.cities.push(value.id);
    });
    // console.log(this.sessionService.PassCountryAll);
    // this.country.regions = [];
    // this.regionMultiCtrl.value.forEach( value => {
    //   const region: PassRegion = {id: value.id, cities: []}; // : PassRegion = {id: value.id, cities: []};
    //   this.country.regions.push(region);
    // });
    // console.log(this.sessionService.PassCountryAll);
    // this.selectEvent.emit({
    //   value: this.bankMultiCtrl.value
    // });
    // const selectionEventInformation = new DataSelectionEventInformation();
    // selectionEventInformation.value = this.countryCtrl.value;
    // selectionEventInformation.SelectionEventType = SelectionEventType.SelectionChanged;
    // this.selectEvent.emit({
    //   value: selectionEventInformation
    // });
  }

}
