import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import {Region} from '../model/Region';
import {UiService} from '../services/ui.service';
import {AuthenticationService} from '../services/SessionStorage/authentication.service';
import {ServerService} from '../services/server.service';
import {SessionService} from '../services/session.service';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {PassCountry} from '../model/pass/PassCountry';
import {PassRegion} from '../model/pass/PassRegion';
import {SelectedRegionsText, FindRegionText, NoEntriesFoundLabelText} from '../language/general-language';
import {LanguageName} from '../language/language-name';

@Component({
  selector: 'app-regions-multiple-selection',
  templateUrl: './regions-multiple-selection.component.html',
  styleUrls: ['./regions-multiple-selection.component.css']
})
export class RegionsMultipleSelectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() countryId: number;
  public selectedRegionsText: LanguageName = SelectedRegionsText;
  public findRegionText: LanguageName = FindRegionText;
  public noEntriesFoundLabelText: LanguageName = NoEntriesFoundLabelText;
  public country: PassCountry = { id: -1 , regions: []};
  /** list of regions */
  public regions: Region[] = [];
  /** control for the selected bank for multi-selection */
  public regionMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public regionMultiFilterCtrl: FormControl = new FormControl();

  /** list of regions filtered by search keyword */
  public filteredRegionsMulti: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();
  // Messages
  @ViewChild(MessagesComponent, {static: true}) Messages: MessagesComponent;


  constructor(public service: ServerService ,
              public sessionService: SessionService ,
              public auService: AuthenticationService,
              public uiService: UiService) { }

  ngOnInit() {
    // set initial selection
    this.country.id = this.countryId;
    if (this.regions.length === 0) {
      this.service.httpPostSelect(`regions/country`, { id :  this.countryId}).subscribe(
        regionData => {
          // Success
          this.regions  = regionData.body.message.regions;
          this.uiService.LoadingEnd();
          // return this.regions;
          // this.selectEvent.emit({
          //   value: this.bankMultiCtrl.value
          // });
          // this.regionMultiCtrl.setValue([this.regions[11], this.regions[12]]);
          //
          const selRegion: Region[] = [];
          for (const counRegions of this.sessionService.countryRegions) {
            if (counRegions.country.id === this.countryId) {
              const se = selRegion.find(x => x.id === counRegions.region.id);
              if (se === undefined) {
                if (counRegions.region) {
                  selRegion.push(counRegions.region);
                  if (counRegions.region) {
                    this.addRegions(counRegions.region);
                  }
                }
              }
            }
          }
          selRegion.sort((a, b) => (a.name > b.name) ? 1 : -1)
          if (this.regionMultiCtrl.value === null) {
            this.regionMultiCtrl.setValue(selRegion);
          }
          // load the initial bank list
          this.filteredRegionsMulti.next(this.regions.slice());

          // listen for search field value changes
          this.regionMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.filterBanksMulti();
            });
        },
        error => {
          console.log(error);
          this.uiService.LoadingEnd();
          this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
          //   this.router.navigate(['error']);
          this.regions = [];
          // this.selectEvent.emit({
          //   value: error
          // });
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
    this.filteredRegionsMulti
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: Region, b: Region) => a && b && a.id === b.id;
      });
  }

  protected filterBanksMulti() {
    if (!this.regions) {
      return;
    }
    // get the search keyword
    let search = this.regionMultiFilterCtrl.value;
    if (!search) {
      this.filteredRegionsMulti.next(this.regions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the regions
    this.filteredRegionsMulti.next(
      this.regions.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }
  addRegions(region: Region) {
    const coun = this.sessionService.PassCountryAll.filter(bank => bank.id === this.countryId);
    if (coun.length > 0) {
      const regionS: PassRegion = {id: region.id, cities: []};
      if (coun[0].regions === undefined) {
        coun[0].regions = [];
      }
      coun[0].regions.push(regionS);
    }
  }
  regionsChange(ev: any) {
    this.country.regions = [];
    this.regionMultiCtrl.value.forEach( value => {
        const region: PassRegion = {id: value.id, cities: []}; // : PassRegion = {id: value.id, cities: []};
        this.country.regions.push(region);
    });
    // ==!!
    const coun = this.sessionService.PassCountryAll.filter(bank => bank.id === this.countryId);
    if (coun.length === 0) {
      this.sessionService.PassCountryAll.push(this.country);
    } else {
      coun[0].regions = this.country.regions;
      this.country = coun[0];
    }
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
