import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SessionService} from '../../services/session.service';
import {LanguageName} from '../../language/language-name';
import {CloseText} from '../../language/general-language';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: 'dialog-confirmation.component.html',
  styleUrls: ['dialog-confirmation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogConfirmationComponent {
  public closeText: LanguageName = CloseText;

  constructor(
    public sessionService: SessionService,
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

}
