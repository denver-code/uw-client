import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import {Country} from '../model/Country';
import {SessionService} from '../services/session.service';
import {SelectedCountriesText, FindCountryText, NoEntriesFoundLabelText} from '../language/general-language';
import {LanguageName} from '../language/language-name';

@Component({
  selector: 'app-country-multiple-selection',
  templateUrl: './country-multiple-selection.component.html',
  styleUrls: ['./country-multiple-selection.component.css']
})
export class CountryMultipleSelectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() selectEvent: any;
  public selectedCountriesText: LanguageName = SelectedCountriesText;
  public findCountryText: LanguageName = FindCountryText;
  public noEntriesFoundLabelText: LanguageName = NoEntriesFoundLabelText;
  /** list of countrys */
  protected countrys: Country[] = [];
  /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  /** list of countrys filtered by search keyword */
  public filteredBanksMulti: ReplaySubject<Country[]> = new ReplaySubject<Country[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();


  constructor(public sessionService: SessionService) { this.selectEvent = new EventEmitter(); }

  ngOnInit() {
  }

  databind(con: Country[]) {
    this.countrys = con;
    // set initial selection
    // this.bankMultiCtrl.setValue([this.countrys[10], this.countrys[11]]);
    // this.bankMultiCtrl.setValue([]);

    // load the initial bank list
    this.filteredBanksMulti.next(this.countrys.slice());

    // listen for search field value changes
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });
  }
  dataValue(selCountry: Country[]) {
    // const selCountry: Country[] = [];
    // console.log(sel);
    // for (const selId of sel) {
    //   const se = this.countrys.find(x => x.id === selId);
    //   // console.log(se);
    //   if (se !== undefined) {
    //     selCountry.push(se);
    //   }
    // }
    if (this.bankMultiCtrl.value === null) {
      this.bankMultiCtrl.setValue(selCountry);
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
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: Country, b: Country) => a && b && a.id === b.id;
      });
  }

  protected filterBanksMulti() {
    if (!this.countrys) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.countrys.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the countrys
    this.filteredBanksMulti.next(
      this.countrys.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  countrysChange(ev: any) {
    // const coun = this.sessionService.PassCountryAll.filter(bank => bank.id === this.countryId);
    // if (coun.length === 0) {
    //   this.sessionService.PassCountryAll.push(this.country);
    // }
    this.bankMultiCtrl.value.forEach( value => {
      const coun = this.sessionService.PassCountryAll.filter(bank => bank.id === value.id);
      if (coun.length === 0) {
        this.sessionService.PassCountryAll.push({ id: value.id , regions: []});
      }
    });
    const delCount = [];
    this.sessionService.PassCountryAll.forEach( value => {
       const coun = this.bankMultiCtrl.value.filter(bank => bank.id === value.id);
       if (coun.length === 0) {
         delCount.push(value);
       }
    });
    delCount.forEach( value => {
      const index = this.sessionService.PassCountryAll.findIndex(x => (x !== null && x.id !== 'undefined') && x.id === value.id);
      if (index > -1) {
        // console.log('Del');
        // console.log(value);
        delete  this.sessionService.PassCountryAll[index];
        const passCountryAll = [];
        for (let i = 0; i < this.sessionService.PassCountryAll.length; i++) {
          if (this.sessionService.PassCountryAll[i]) {
            passCountryAll.push(this.sessionService.PassCountryAll[i]);
          }
        }
        this.sessionService.PassCountryAll = passCountryAll;
      }
    });
    // console.log('Del-m');
    // console.log(this.sessionService.PassCountryAll);
    this.selectEvent.emit({
      value: this.bankMultiCtrl.value
    });
    // const selectionEventInformation = new DataSelectionEventInformation();
    // selectionEventInformation.value = this.countryCtrl.value;
    // selectionEventInformation.SelectionEventType = SelectionEventType.SelectionChanged;
    // this.selectEvent.emit({
    //   value: selectionEventInformation
    // });
  }
}
