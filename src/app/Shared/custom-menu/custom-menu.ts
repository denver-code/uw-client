import { Component, ElementRef, ViewChild, Input, Output, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { MyRequests , MyChats} from '../../language/custom-menu';
import {PersonalData} from '../../language/general-language';
import {LanguageName} from '../../language/language-name';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-custom-menu',
  templateUrl: 'custom-menu.html',
  styleUrls: ['custom-menu.css']
})

export class CustomMenuComponent implements OnInit {
  @Input() tabIndex: number;
  public personalDataText: LanguageName = PersonalData;
  public myRequestsText: LanguageName = MyRequests;
  public myChatsText: LanguageName = MyChats;
  constructor(public router: Router,
              public sessionService: SessionService,
              public fb: FormBuilder) {
  }
  ngOnInit() {
  }
  personalData() {
    this.router.navigate(['EditProfile']);
  }
  notification() {
    this.router.navigate(['Notification']);
  }
  myChats() {
    this.router.navigate(['MyChats']);
  }
}
