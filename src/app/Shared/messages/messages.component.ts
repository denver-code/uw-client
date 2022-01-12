import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.component.html'
})

export class MessagesComponent {
  messagesForm: FormGroup;
  messageBox: any;
  typeMessage: any;
  messageHeader: any;

  constructor(private formBuilder: FormBuilder) {
    this.messageBox = [];
    this.typeMessage = [];
    this.messageHeader = [];
    this.messagesForm = formBuilder.group({
      messages: formBuilder.array([])
    });
  }

  AddMessage(text: string, type: string): boolean {
    this.messageBox.push(text);
    this.typeMessage.push(type);
    if (type === 'alert-success') {
      this.messageHeader.push('');
    } else if (type === 'alert-warning') {
      this.messageHeader.push('Warning!');
    } else if (type === 'alert-danger') {
      this.messageHeader.push('Error!');
    } else {
      this.messageHeader.push('Info!');
    }

    (<FormArray> this.messagesForm.controls['messages']).push(new FormControl(''));
    return true;
  }

  ClearMessage(): boolean {
    this.messageBox = [];
    this.typeMessage = [];
    this.messageHeader = [];
    this.messagesForm = this.formBuilder.group({
      messages: this.formBuilder.array([])
    });
    return true;
  }
}
