import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TypeService} from '../model/TypeService';
import { SelectedServicesText} from '../language/general-language';
import {LanguageName} from '../language/language-name';
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-services-detail',
  templateUrl: './services-detail.component.html',
  styleUrls: ['./services-detail.component.css']
})
export class ServicesDetailComponent implements OnInit {
  public selectedServicesText: LanguageName = SelectedServicesText;
  public typeServices: TypeService[] = [];

  constructor(public sessionService: SessionService) {  }

  ngOnInit() {
  }
  dataValue(selService: TypeService[]) {
    this.typeServices = selService;
  }
}
