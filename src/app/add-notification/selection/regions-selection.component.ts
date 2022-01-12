import { AfterViewInit, Component, Output,  EventEmitter , OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Region} from '../../model/Region';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {DataSelectionEventInformation, SelectionEventType} from '../../Shared/selection.core';
import {LanguageName} from '../../language/language-name';
import {FindRegionText , NoEntriesFoundLabelText} from '../../language/general-language';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-regions-selection',
  templateUrl: './regions-selection.component.html',
  styleUrls: ['./regions-selection.component.css']
})
export class RegionsSelectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() selectEvent: any;
  /** list of regions */
  disableSelect = new FormControl(true);
  public findRegionText: LanguageName = FindRegionText;
  public noEntriesFoundLabelText: LanguageName = NoEntriesFoundLabelText;
  public regions: Region[] = [];
  /** control for the selected region */
  public regionCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public regionFilterCtrl: FormControl = new FormControl();

  /** list of regions filtered by search keyword */
  public filteredCountrys: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();


  constructor(public sessionService: SessionService) { this.selectEvent = new EventEmitter(); }

  ngOnInit() {
  }

  databind(con: Region[]) {
    this.regions = con;
    this.disableSelect = new FormControl(false);
    // set initial selection
    // this.regionCtrl.setValue(this.regions[10]);
    // load the initial bank list
    this.filteredCountrys.next(this.regions.slice());

    // listen for search field value changes
    this.regionFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterCountrys();
      });
  }

  dataValue(index: number) {
    if (index !== -1) {
      const se = this.regions.find(x => x.id === index);
      this.regionCtrl.setValue(se);
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
        this.singleSelect.compareWith = (a: Region, b: Region) => a && b && a.id === b.id;
      });
  }

  protected filterCountrys() {
    if (!this.regions) {
      return;
    }
    // get the search keyword
    let search = this.regionFilterCtrl.value;
    if (!search) {
      this.filteredCountrys.next(this.regions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Countrys
    this.filteredCountrys.next(
      this.regions.filter(bank1 => bank1.name.toLowerCase().indexOf(search) > -1)
    );
  }
  regionsChange(ev: any) {
    // console.log(this.regionCtrl.value);
    const selectionEventInformation = new DataSelectionEventInformation();
    selectionEventInformation.value = this.regionCtrl.value;
    selectionEventInformation.SelectionEventType = SelectionEventType.SelectionChanged;
    this.selectEvent.emit({
      value: selectionEventInformation
    });
  }

}
