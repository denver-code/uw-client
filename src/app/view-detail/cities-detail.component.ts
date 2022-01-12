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
import {SelectedCitiesText} from '../language/general-language';
import {LanguageName} from '../language/language-name';

@Component({
  selector: 'app-cities-detail',
  templateUrl: './cities-detail.component.html',
  styleUrls: ['./cities-detail.component.css']
})
export class CitiesDetailComponent implements OnInit {
  /** list of cities */
  @Input() countryId: number;
  @Input() regionId: number;
  public selectedCitiesText: LanguageName = SelectedCitiesText;
  public selCitis: City[] = [];
  // Messages
  @ViewChild(MessagesComponent, {static: true}) Messages: MessagesComponent;

  constructor(public service: ServerService ,
              public sessionService: SessionService ,
              public auService: AuthenticationService,
              public uiService: UiService) { }

  ngOnInit() {
      for (const counRegions of this.sessionService.countryRegions) {
        if (counRegions.region !== null) {
          // console.log(counRegions.region);
          if (counRegions.region.id === this.regionId) {
            if (counRegions.city) {
              const se = this.selCitis.find(x => x.id === counRegions.city.id);
              if (se === undefined) {
                this.selCitis.push(counRegions.city);
              }
            }
          }
        }
      }
      this.selCitis.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }
}
