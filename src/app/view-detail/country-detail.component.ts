import {Component, OnInit} from '@angular/core';

import {Country} from '../model/Country';
import {SessionService} from '../services/session.service';
import {SelectedCountriesText} from '../language/general-language';
import {LanguageName} from '../language/language-name';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.css']
})
export class CountryDetailComponent implements OnInit {
  public selectedCountriesText: LanguageName = SelectedCountriesText;
  /** list of countrys */
  public countrys: Country[] = [];
  constructor(public sessionService: SessionService) { }

  ngOnInit() {
  }
  dataValue(selCountry: Country[]) {
    this.countrys = selCountry;
  }
}
