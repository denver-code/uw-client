import { Component, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UploadFileText, ClearText} from '../../language/upload-file';
import {LanguageName} from '../../language/language-name';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.css']
})

export class UploadComponent {
  @Output() dataEvent: any;
  form: FormGroup;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  public uploadBtn = false;
  public uploadFileText: LanguageName = UploadFileText;
  public clearText: LanguageName = ClearText;
  constructor(public fb: FormBuilder,
              public sessionService: SessionService) {
    this.dataEvent = new EventEmitter();
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      upload: null
    });
  }
  onFileChange(event: any) {
    const reader = new FileReader();
    if ( event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('upload').setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as string).split(',')[1]
        })
        this.uploadBtn = true;
        this.dataEvent.emit({
          value: 'Change'
        });
      };

    }
  }
  FileChangeValue() {
    return this.form.value;
  }
  FileDescriptionValue(){
    const message = (document.getElementById('fileDescription') as HTMLInputElement).value;
    return message;
  }
  clear() {
    this.form.get('upload').setValue(null);
    this.fileInput.nativeElement.value = '';
    this.uploadBtn = false;
  }
  clearFile() {
    this.clear();
    this.dataEvent.emit({
      value: 'Clear'
    });
  }
  uploadFile() {
    this.uploadBtn = false;
    this.dataEvent.emit({
      value: 'Upload'
    });
  }
}
