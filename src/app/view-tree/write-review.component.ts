import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../services/session.service';
import {LanguageName} from '../language/language-name';
import {CloseText, DescriptionText, PublishText, RateText} from '../language/general-language';

@Component({
  selector: 'app-write-review',
  templateUrl: 'write-review.component.html',
  styleUrls: ['write-review.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WriteReviewComponent implements OnInit {
  currentRate = 0;
  errorRate = false;
  settingsFrm: FormGroup;
  public closeText: LanguageName = CloseText;
  public publishText: LanguageName = PublishText;
  public rateText: LanguageName = RateText;
  public descriptionText: LanguageName = DescriptionText;
  constructor(
    public sessionService: SessionService,
    public router: Router,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<WriteReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    this.settingsFrm = this.fb.group({
      description: new FormControl('', [])
    });
  }
  onSubmit(formData: any) {
    const fd = formData.value;
    if (this.currentRate !== 0) {
      this.errorRate = false;
      this.sessionService.reviewsTreeSelDescription = fd.description;
      this.sessionService.reviewsTreeSelRate = this.currentRate;
    } else {
      this.errorRate = true;
    }
    // this.router.navigate(['ServiceUserProfile']);
  }
}
