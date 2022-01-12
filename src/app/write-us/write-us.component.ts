import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../services/session.service';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {Global} from '../Shared/global';
import {ServerService} from '../services/server.service';
import {UiService} from '../services/ui.service';
import {ContactUsText, EmailRequiredText, InvalidEmailFormatText,
  PleaseDescriptionText, SendText, DescriptionText, EmailText, FeedbackIsSuccessfullyText} from '../language/general-language';
import {LanguageName} from '../language/language-name';
import * as _moment from 'moment';
const moment =  _moment;

@Component({
  selector: 'app-write-us',
  templateUrl: './write-us.component.html',
  styleUrls: ['./write-us.component.css']
})
export class WriteUsComponent implements OnInit {
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  myAssistanceFrm: FormGroup;
  public contactUsText: LanguageName = ContactUsText;
  public sendText: LanguageName = SendText;
  public emailRequiredText: LanguageName = EmailRequiredText;
  public invalidEmailFormatText: LanguageName = InvalidEmailFormatText;
  public pleaseDescriptionText: LanguageName = PleaseDescriptionText;
  public descriptionText: LanguageName = DescriptionText;
  public emailText: LanguageName = EmailText;
  public feedbackIsSuccessfullyText: LanguageName = FeedbackIsSuccessfullyText;
  constructor(public service: ServerService ,
              public sessionService: SessionService ,
              public uiService: UiService,
              public fb: FormBuilder ,
              public router: Router) { }

  ngOnInit() {
    if (this.sessionService.IsAuthenticatedPage('WriteUs')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }
  StartPage() {
    this.myAssistanceFrm = this.fb.group({
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      // theme: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }
  onSubmit(formData: any) {
    const fd = formData.value;
    const emailAddress = fd.emailAddress;
    // const theme = fd.theme;
    const descriptionT = fd.description;
    const subjectText = 'Feedback, ' + moment().format('MMM DD YYYY');
    // console.log(fd);
    this.uiService.LoadingStart();
    this.service.sendEmail(`sendemail/help_send`, {email: emailAddress, subject: subjectText, description: descriptionT}).subscribe(
      dataEmail => {
        // Success
        console.log(dataEmail);
        this.uiService.LoadingEnd();
        this.Messages.AddMessage(this.feedbackIsSuccessfullyText[this.sessionService.activeLanguage], 'alert-success');
        this.myAssistanceFrm.reset();
      },
      error => {
        this.uiService.LoadingEnd();
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        return;
      }
    );
  }
}
