import { AfterViewInit, Component, Output,  EventEmitter , OnDestroy, OnInit, ViewChild } from '@angular/core';
import {City} from '../../model/City';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {DataSelectionEventInformation, SelectionEventType} from '../../Shared/selection.core';
import {LanguageName} from '../../language/language-name';
import {FindCitiesText, NoEntriesFoundLabelText} from '../../language/general-language';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-cities-selection',
  templateUrl: './cities-selection.component.html',
  styleUrls: ['./cities-selection.component.css']
})
export class CitiesSelectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() selectEvent: any;
  /** list of citys */
  disableSelect = new FormControl(true);
  public findCityText: LanguageName = FindCitiesText;
  public noEntriesFoundLabelText: LanguageName = NoEntriesFoundLabelText;
  public citys: City[] = [];
  /** control for the selected city */
  public cityCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public cityFilterCtrl: FormControl = new FormControl();

  /** list of citys filtered by search keyword */
  public filteredCountrys: ReplaySubject<City[]> = new ReplaySubject<City[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();


  constructor(public sessionService: SessionService) { this.selectEvent = new EventEmitter(); }

  ngOnInit() {
  }

  databind(con: City[]) {
    this.citys = con;
    this.disableSelect = new FormControl(false);
    // set initial selection
    // this.cityCtrl.setValue(this.regions[10]);
    // load the initial bank list
    this.filteredCountrys.next(this.citys.slice());

    // listen for search field value changes
    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterCountrys();
      });
  }

  dataValue(index: number) {
    if (index !== -1) {
      const se = this.citys.find(x => x.id === index);
      this.cityCtrl.setValue(se);
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
        this.singleSelect.compareWith = (a: City, b: City) => a && b && a.id === b.id;
      });
  }

  protected filterCountrys() {
    if (!this.citys) {
      return;
    }
    // get the search keyword
    let search = this.cityFilterCtrl.value;
    // console.log(search);
    if (!search) {
      this.filteredCountrys.next(this.citys.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Countrys
    this.filteredCountrys.next(
      this.citys.filter(bank1 => bank1.name.toLowerCase().indexOf(search) > -1)
    );
  }
  citysChange(ev: any) {
    // console.log(this.cityCtrl.value);
    const selectionEventInformation = new DataSelectionEventInformation();
    selectionEventInformation.value = this.cityCtrl.value;
    selectionEventInformation.SelectionEventType = SelectionEventType.SelectionChanged;
    this.selectEvent.emit({
      value: selectionEventInformation
    });
  }

}
