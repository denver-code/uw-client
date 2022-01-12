import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SessionService} from '../../services/session.service';
import {LanguageName} from '../../language/language-name';
import {CloseText} from '../../language/general-language';

@Component({
  selector: 'app-dialog-messages',
  templateUrl: 'dialog-messages.component.html',
  styleUrls: ['dialog-messages.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogMessagesComponent {
  public closeText: LanguageName = CloseText;

  constructor(
    public sessionService: SessionService,
    public dialogRef: MatDialogRef<DialogMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

}
