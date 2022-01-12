import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SessionService} from '../services/session.service';
import {MessagesComponent} from '../Shared/messages/messages.component';

@Component({
  selector: 'app-leaving-feedback',
  templateUrl: './leaving-feedback.component.html',
  styleUrls: ['./leaving-feedback.component.css']
})
export class LeavingFeedbackComponent implements OnInit {
  currentRate = 3;
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  settingsFrm: FormGroup;
  constructor(public sessionService: SessionService,
              public router: Router,
              public fb: FormBuilder) { }

  ngOnInit() {
    if (this.sessionService.IsAuthenticatedPage('LeavingFeedback')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  StartPage() {
    this.settingsFrm = this.fb.group({
      description: new FormControl('', [Validators.required])
    });
  }
  onSubmit(formData: any) {
    const fd = formData.value;
    console.log(fd);
    this.router.navigate(['ServiceUserProfile']);
  }

}
