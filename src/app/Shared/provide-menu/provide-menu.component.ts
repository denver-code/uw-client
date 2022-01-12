import { Component, ElementRef, ViewChild, Input, Output, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {  RequestsText , ChatsText} from '../../language/provide-menu';
import {PersonalData} from '../../language/general-language';
import {LanguageName} from '../../language/language-name';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-provide-menu',
  templateUrl: 'provide-menu.component.html',
  styleUrls: ['provide-menu.component.css']
})

export class ProvideMenuComponent implements OnInit {
  @Input() tabIndex: number;
  public personalDataText: LanguageName = PersonalData;
  public myRequestsText: LanguageName = RequestsText;
  public myChatsText: LanguageName = ChatsText;
  constructor(public router: Router,
              public sessionService: SessionService,
              public fb: FormBuilder) {
  }
  ngOnInit() {
  }
  personalData() {
    this.router.navigate(['ViewProvideProfile', -1]);
  }
  notification() {
    this.router.navigate(['ServiceHome']);
  }
  myChats() {
    this.router.navigate(['ProviderChats']);
  }
}
