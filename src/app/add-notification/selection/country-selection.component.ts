import { AfterViewInit, Component, Output,  EventEmitter , OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Country} from '../../model/Country';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {DataSelectionEventInformation, SelectionEventType} from '../../Shared/selection.core';
import {LanguageName} from '../../language/language-name';
import {FindCountryText, NoEntriesFoundLabelText} from '../../language/general-language';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-country-selection',
  templateUrl: './country-selection.component.html',
  styleUrls: ['./country-selection.component.css']
})
export class СountrySelectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() selectEvent: any;
  /** list of countrys */

  public countrys: Country[] = [];
  public findCountryText: LanguageName = FindCountryText;
  public noEntriesFoundLabelText: LanguageName = NoEntriesFoundLabelText;
  /** control for the selected country */
  public countryCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public countryFilterCtrl: FormControl = new FormControl();

  /** list of countrys filtered by search keyword */
  public filteredCountrys: ReplaySubject<Country[]> = new ReplaySubject<Country[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();


  constructor(public sessionService: SessionService) { this.selectEvent = new EventEmitter(); }

  ngOnInit() {
  }

  databind(con: Country[]) {
    this.countrys = con;
    // set initial selection
    // this.countryCtrl.setValue(this.countrys[10]);
    // load the initial bank list
    this.filteredCountrys.next(this.countrys.slice());

    // listen for search field value changes
    this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterCountrys();
      });
  }

  dataValue(index: number) {
    if (index !== -1) {
      const se = this.countrys.find(x => x.id === index);
      this.countryCtrl.setValue(se);
      // console.log(se);
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
   * Sets the initial value after the filteredCountrys are loaded initially
   */
  protected setInitialValue() {
    this.filteredCountrys
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredCountrys are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Country, b: Country) => a && b && a.id === b.id;
      });
  }

  protected filterCountrys() {
    if (!this.countrys) {
      return;
    }
    // get the search keyword
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCountrys.next(this.countrys.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Countrys
    this.filteredCountrys.next(
      this.countrys.filter(bank1 => bank1.name.toLowerCase().indexOf(search) > -1)
    );
  }
  countrysChange(ev: any) {
    // console.log(this.countryCtrl.value);
    const selectionEventInformation = new DataSelectionEventInformation();
    selectionEventInformation.value = this.countryCtrl.value;
    selectionEventInformation.SelectionEventType = SelectionEventType.SelectionChanged;
    this.selectEvent.emit({
      value: selectionEventInformation
    });
  }

}
