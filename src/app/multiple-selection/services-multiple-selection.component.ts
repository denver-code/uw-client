import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import {TypeService} from '../model/TypeService';
import { SelectedServicesText, FindServicesText, NoEntriesFoundLabelText} from '../language/general-language';
import {LanguageName} from '../language/language-name';
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-services-multiple-selection',
  templateUrl: './services-multiple-selection.component.html',
  styleUrls: ['./services-multiple-selection.component.css']
})
export class ServicesMultipleSelectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() selectEvent: any;
  public selectedServicesText: LanguageName = SelectedServicesText;
  public findServicesText: LanguageName = FindServicesText;
  public noEntriesFoundLabelText: LanguageName = NoEntriesFoundLabelText;
  /** list of banks */
  public typeServices: TypeService[] = [];

  /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  /** list of typeServices filtered by search keyword */
  public filteredBanksMulti: ReplaySubject<TypeService[]> = new ReplaySubject<TypeService[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();


  constructor(public sessionService: SessionService) { this.selectEvent = new EventEmitter(); }

  ngOnInit() {
  }

  databind(con: TypeService[]) {
    this.typeServices = con;
    // set initial selection
    // this.bankMultiCtrl.setValue([this.typeServices[1], this.typeServices[2]]);
    this.bankMultiCtrl.setValue([]);
    // load the initial bank list
    this.filteredBanksMulti.next(this.typeServices.slice());

    // listen for search field value changes
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });
  }
  dataValue(selService: TypeService[]) {
    // const selService: TypeService[] = [];
    // for (const selId of sel) {
    //   const se = this.typeServices.find(x => x.id === selId);
    //   // console.log(se);
    //   if (se !== undefined) {
    //     selService.push(se);
    //   }
    // }
    this.bankMultiCtrl.setValue(selService);
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
        this.multiSelect.compareWith = (a: TypeService, b: TypeService) => a && b && a.id === b.id;
      });
  }

  protected filterBanksMulti() {
    if (!this.typeServices) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.typeServices.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the typeServices
    this.filteredBanksMulti.next(
      this.typeServices.filter(bank => bank['name' + this.sessionService.activeLanguage].toLowerCase().indexOf(search) > -1)
    );
  }

  servicesChange(ev: any) {
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
