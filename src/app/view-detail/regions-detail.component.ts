import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Region} from '../model/Region';
import {UiService} from '../services/ui.service';
import {AuthenticationService} from '../services/SessionStorage/authentication.service';
import {ServerService} from '../services/server.service';
import {SessionService} from '../services/session.service';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {SelectedRegionsText} from '../language/general-language';
import {LanguageName} from '../language/language-name';

@Component({
  selector: 'app-regions-detail',
  templateUrl: './regions-detail.component.html',
  styleUrls: ['./regions-detail.component.css']
})
export class RegionsDetailComponent implements OnInit {
  @Input() countryId: number;
  public selectedRegionsText: LanguageName = SelectedRegionsText;
  /** list of regions */
  public regions: Region[] = [];
  public selRegion: Region[] = [];
  // Messages
  @ViewChild(MessagesComponent, {static: true}) Messages: MessagesComponent;


  constructor(public service: ServerService ,
              public sessionService: SessionService ,
              public auService: AuthenticationService,
              public uiService: UiService) { }

  ngOnInit() {
    if (this.regions.length === 0) {
      for (const counRegions of this.sessionService.countryRegions) {
        if (counRegions.country.id === this.countryId) {
          const se = this.selRegion.find(x => x.id === counRegions.region.id);
          if (se === undefined) {
            if (counRegions.region) {
              this.selRegion.push(counRegions.region);
            }
          }
        }
      }
      this.selRegion.sort((a, b) => (a.name > b.name) ? 1 : -1);
    }
  }
}
