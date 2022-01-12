import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../services/session.service';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {Global} from '../Shared/global';
import {ServerService} from '../services/server.service';
import {UiService} from '../services/ui.service';
import * as _moment from 'moment';
import {LanguageName} from '../language/language-name';
import {
  ContactUsText, EmailRequiredText,
  InvalidEmailFormatText, SendText, PleaseDescriptionText, DescriptionText, EmailText, FeedbackIsSuccessfullyText
} from '../language/general-language';
const moment =  _moment;

@Component({
  selector: 'app-write-us-provider',
  templateUrl: './write-us-provider.component.html',
  styleUrls: ['./write-us-provider.component.css']
})
export class WriteUsProviderComponent implements OnInit {

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
  public tabIndex: number;
  constructor(public service: ServerService ,
              public sessionService: SessionService ,
              public uiService: UiService,
              public fb: FormBuilder ,
              public router: Router) { this.tabIndex = 0; }

  ngOnInit() {
    if (this.sessionService.IsAuthenticatedPage('WriteUsProvider')) {
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
    // console.log(fd);
    this.uiService.LoadingStart();
    const subjectText = 'Feedback, ' + moment().format('MMM DD YYYY');
    // console.log(subjectText);
    this.service.sendEmail(`sendemail/help_send`, {email: emailAddress, subject: subjectText, description: descriptionT}).subscribe(
      dataEmail => {
        // Success
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
