import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

// import { Action } from './shared/model/action';
import { Event } from './shared/model/Event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { SessionService } from '../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesComponent } from '../Shared/messages/messages.component';
import { UploadComponent } from '../Shared/upload/upload.component';
import { Subscription } from 'rxjs';
import { ServerService } from '../services/server.service';
import { TransactionalInformation } from '../entities/TransactionalInformation.entity';
import { ChatColumn } from '../model/ChatColumn';
import { NotificationColumn } from '../model/NotificationColumn';
import { MessagesChat } from './shared/model/messages-chat';
import { UiService } from '../services/ui.service';
// This is required
import { DomSanitizer } from '@angular/platform-browser';
import { LanguageName } from '../language/language-name';
import { BackText, CancelText } from '../language/general-language';
import {
  SendMessageText,
  AgreementText,
  RenouncementText,
  CompleteText,
  RefusalText,
  ToSendText,
} from '../language/сhat';

@Component({
  selector: 'app-tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  // params query url
  private routeSubscription: Subscription;
  // private querySubscription: Subscription;
  public id: number;
  // action = Action;
  user: User;
  // messages: Message[] = [];
  messagesChat: MessagesChat[] = [];
  messageContent: string;
  ioConnection: any;
  // Messages
  @ViewChild(MessagesComponent, { static: false }) Messages: MessagesComponent;
  // Upload
  @ViewChild(UploadComponent, { static: false }) Upload: UploadComponent;
  public chat: ChatColumn;
  interlocutor: string;
  chatlength: number;
  agreementBtn: boolean;
  completeBtn: boolean;
  public sendMessageText: LanguageName = SendMessageText;
  public agreementText: LanguageName = AgreementText;
  public renouncementText: LanguageName = RenouncementText;
  public cancelText: LanguageName = CancelText;
  public completeText: LanguageName = CompleteText;
  public refusalText: LanguageName = RefusalText;
  public toSendText: LanguageName = ToSendText;
  public backText: LanguageName = BackText;
  constructor(
    public service: ServerService,
    public socketService: SocketService,
    public router: Router,
    public sessionService: SessionService,
    public uiService: UiService,
    public sanitizer: DomSanitizer,
    public route: ActivatedRoute
  ) {
    this.routeSubscription = route.params.subscribe(
      (params) => (this.id = parseInt(params['id']))
    );
  }

  ngOnInit(): void {
    this.interlocutor = '';
    this.chatlength = 0;
    this.agreementBtn = true;
    this.completeBtn = true;
    let notification: NotificationColumn;
    notification = {
      id: 0,
      name: '',
      description: '',
      chat: '',
      createdAt: '',
      updatedAt: '',
    };
    this.chat = {
      id: 0,
      agreementProvide: 0,
      agreementRequest: 0,
      completeProvide: 0,
      completeRequest: 0,
      createdAt: '',
      updatedAt: '',
    };
    this.chat.notification = notification;
    if (this.sessionService.IsAuthenticatedPage('сhat')) {
      this.StartPage();
    } else {
      this.router.navigate(['LogIn']);
    }
  }

  StartPage() {
    // Load Chats
    // alert(this.id);
    this.uiService.LoadingStart();
    this.service.httpPost(`notification/chat`, { id: this.id }).subscribe(
      (data) => {
        // Success
        if (data.body.message.chat.length > 0) {
          // console.log(data.body.message.chat[0]);
          this.chat = data.body.message.chat[0];
          // this.agreementBtn
          // if(this.chat.agreementProvide)
          if (
            this.sessionService.AuthorizedUser.RoleName ===
            this.sessionService.permission.provider
          ) {
            if (this.chat.agreementProvide === null) {
              this.agreementBtn = true;
            } else {
              this.agreementBtn = false;
            }
            // this.completeBtn
            if (this.chat.completeProvide === null) {
              this.completeBtn = true;
            } else {
              this.completeBtn = false;
            }
          } else {
            if (this.chat.agreementRequest === null) {
              this.agreementBtn = true;
            } else {
              this.agreementBtn = false;
            }
            // this.completeBtn
            if (this.chat.completeRequest === null) {
              this.completeBtn = true;
            } else {
              this.completeBtn = false;
            }
          }
          this.service
            .httpPost(`chat_history/history_chat`, { id: this.chat.id })
            .subscribe(
              (dataHistory) => {
                this.uiService.LoadingEnd();
                // Success
                this.messagesChat = [];
                for (const history of dataHistory.body.message.history) {
                  // console.log(history);
                  this.messagesChat.push({
                    name: history.receiver.name,
                    content: history.content,
                    image: history.image,
                    document: history.document,
                    documentName: history.documentName,
                    textType: history.textType,
                  });
                }
                //
                if (
                  this.sessionService.AuthorizedUser.RoleName ===
                  this.sessionService.permission.provider
                ) {
                  this.interlocutor =
                    this.chat.request.name + ' ' + this.chat.request.surname;
                } else {
                  this.interlocutor = this.chat.provide.name;
                }
                // if (!this.sessionService.ConnectionSocket) {
                this.initIoConnection();
                // }
              },
              (error) => {
                this.uiService.LoadingEnd();
                this.Messages.AddMessage(
                  this.service.globalMessageError() +
                    ' UserError: ' +
                    this.service.globalUserError(),
                  'alert-danger'
                );
                return;
              }
            );
        }
      },
      (error) => {
        this.uiService.LoadingEnd();
        this.Messages.AddMessage(
          this.service.globalMessageError(),
          'alert-danger'
        );
        return;
      }
    );
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService
      .onMessage()
      .subscribe((message: Message) => {
        if (
          this.chat.provide.id === message.provide &&
          this.chat.request.id === message.request &&
          this.chat.id === message.id
        ) {
          this.uiService.LoadingStart();
          this.service
            .httpPost(`chat_history/history`, { id: message.content })
            .subscribe(
              (data) => {
                this.uiService.LoadingEnd();
                // Success
                if (data.body.message.history.length > 0) {
                  // console.log(data.body.message.history[0]);
                  this.messagesChat.push({
                    name: data.body.message.history[0].receiver.name,
                    content: data.body.message.history[0].content,
                    image: data.body.message.history[0].image,
                    document: data.body.message.history[0].document,
                    documentName: data.body.message.history[0].documentName,
                    textType: data.body.message.history[0].textType,
                  });
                  // this.messages.push(data.body.message.history[0].content);
                }
              },
              (error) => {
                this.uiService.LoadingEnd();
                this.Messages.AddMessage(
                  this.service.globalMessageError() +
                    ' UserError: ' +
                    this.service.globalUserError(),
                  'alert-danger'
                );
                return;
              }
            );
        }
      });

    this.socketService.onEvent(Event.CONNECT).subscribe(() => {
      console.log('connected');
      this.sessionService.ConnectionSocket = true;
      // alert('connected');
    });

    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log('disconnected');
      this.sessionService.ConnectionSocket = false;
      // alert('disconnected');
    });
  }

  public sendMessage(): void {
    const message = (document.getElementById('textToSend') as HTMLInputElement)
      .value;
    if (!message) {
      return;
    }
    this.uiService.LoadingStart();
    this.service
      .httpPost(`chat_history/history_add`, {
        id: this.chat.id,
        content: message,
      })
      .subscribe(
        (data) => {
          this.uiService.LoadingEnd();
          // Success
          this.socketService.send({
            id: this.chat.id,
            provide: this.chat.provide.id,
            request: this.chat.request.id,
            content: data.body.message.history.id,
          });
          (document.getElementById('textToSend') as HTMLInputElement).value =
            '';
          this.messageContent = null;
        },
        (error) => {
          this.uiService.LoadingEnd();
          this.Messages.AddMessage(
            this.service.globalMessageError() +
              ' UserError: ' +
              this.service.globalUserError(),
            'alert-danger'
          );
          return;
        }
      );
  }
  public agreement() {
    this.service
      .httpPost(`notification/set_agreement`, {
        id: this.chat.id,
        agreement: 1,
      })
      .subscribe(
        (data) => {
          // Success
          if (
            this.sessionService.AuthorizedUser.RoleName ===
            this.sessionService.permission.provider
          ) {
            this.chat.agreementProvide = 1;
          } else {
            this.chat.agreementRequest = 1;
          }
          //
          this.service
            .httpPost(`chat_history/history_add_html`, {
              id: this.chat.id,
              content:
                '<span style="font-size: 24px;color: #298D47">' +
                this.agreementText[this.sessionService.activeLanguage] +
                '</span>',
              type: 1,
            })
            .subscribe(
              (dataAdd) => {
                this.uiService.LoadingEnd();
                // Success
                this.socketService.send({
                  id: this.chat.id,
                  provide: this.chat.provide.id,
                  request: this.chat.request.id,
                  content: dataAdd.body.message.history.id,
                });
                // this.Messages.AddMessage('you agreed', 'alert-success');
                this.agreementBtn = false;
              },
              (error) => {
                this.uiService.LoadingEnd();
                this.Messages.AddMessage(
                  this.service.globalMessageError() +
                    ' UserError: ' +
                    this.service.globalUserError(),
                  'alert-danger'
                );
                return;
              }
            );
          //
        },
        (error) => {
          this.Messages.AddMessage(
            this.service.globalMessageError() +
              ' UserError: ' +
              this.service.globalUserError(),
            'alert-danger'
          );
          return;
        }
      );
  }
  public renouncement() {
    this.service
      .httpPost(`notification/set_agreement`, {
        id: this.chat.id,
        agreement: 0,
      })
      .subscribe(
        (data) => {
          // Success
          if (
            this.sessionService.AuthorizedUser.RoleName ===
            this.sessionService.permission.provider
          ) {
            this.chat.agreementProvide = 0;
          } else {
            this.chat.agreementRequest = 0;
          }
          //
          this.service
            .httpPost(`chat_history/history_add_html`, {
              id: this.chat.id,
              content:
                '<span style="font-size: 20px;color: #ff1e1e">' +
                this.refusalText[this.sessionService.activeLanguage] +
                '</span>',
              type: 1,
            })
            .subscribe(
              (dataAdd) => {
                this.uiService.LoadingEnd();
                // Success
                this.socketService.send({
                  id: this.chat.id,
                  provide: this.chat.provide.id,
                  request: this.chat.request.id,
                  content: dataAdd.body.message.history.id,
                });
                // this.Messages.AddMessage('you did not agree', 'alert-success');
                this.agreementBtn = false;
              },
              (error) => {
                this.uiService.LoadingEnd();
                this.Messages.AddMessage(
                  this.service.globalMessageError() +
                    ' UserError: ' +
                    this.service.globalUserError(),
                  'alert-danger'
                );
                return;
              }
            );
        },
        (error) => {
          this.Messages.AddMessage(
            this.service.globalMessageError() +
              ' UserError: ' +
              this.service.globalUserError(),
            'alert-danger'
          );
          return;
        }
      );
  }
  public complete() {
    this.service
      .httpPost(`notification/set_complete`, { id: this.chat.id, complete: 1 })
      .subscribe(
        (data) => {
          // Success
          if (
            this.sessionService.AuthorizedUser.RoleName ===
            this.sessionService.permission.provider
          ) {
            this.chat.completeProvide = 1;
          } else {
            this.chat.completeRequest = 1;
          }
          //
          this.service
            .httpPost(`chat_history/history_add_html`, {
              id: this.chat.id,
              content:
                '<span style="font-size: 24px;color: #298D47">' +
                this.completeText[this.sessionService.activeLanguage] +
                '</span>',
              type: 1,
            })
            .subscribe(
              (dataAdd) => {
                this.uiService.LoadingEnd();
                // Success
                this.socketService.send({
                  id: this.chat.id,
                  provide: this.chat.provide.id,
                  request: this.chat.request.id,
                  content: dataAdd.body.message.history.id,
                });
                // this.Messages.AddMessage('you complete', 'alert-success');
                this.completeBtn = false;
              },
              (error) => {
                this.uiService.LoadingEnd();
                this.Messages.AddMessage(
                  this.service.globalMessageError() +
                    ' UserError: ' +
                    this.service.globalUserError(),
                  'alert-danger'
                );
                return;
              }
            );
          //
        },
        (error) => {
          this.Messages.AddMessage(
            this.service.globalMessageError() +
              ' UserError: ' +
              this.service.globalUserError(),
            'alert-danger'
          );
          return;
        }
      );
  }
  public dealCancel() {
    this.service
      .httpPost(`notification/set_complete`, { id: this.chat.id, complete: 0 })
      .subscribe(
        (data) => {
          // Success
          if (
            this.sessionService.AuthorizedUser.RoleName ===
            this.sessionService.permission.provider
          ) {
            this.chat.completeProvide = 0;
          } else {
            this.chat.completeRequest = 0;
          }
          //
          this.service
            .httpPost(`chat_history/history_add_html`, {
              id: this.chat.id,
              content:
                '<span style="font-size: 24px;color: #ff1e1e">' +
                this.cancelText[this.sessionService.activeLanguage] +
                '</span>',
              type: 1,
            })
            .subscribe(
              (dataAdd) => {
                this.uiService.LoadingEnd();
                // Success
                this.socketService.send({
                  id: this.chat.id,
                  provide: this.chat.provide.id,
                  request: this.chat.request.id,
                  content: dataAdd.body.message.history.id,
                });
                // this.Messages.AddMessage('you Cancel', 'alert-success');
                this.completeBtn = false;
              },
              (error) => {
                this.uiService.LoadingEnd();
                this.Messages.AddMessage(
                  this.service.globalMessageError() +
                    ' UserError: ' +
                    this.service.globalUserError(),
                  'alert-danger'
                );
                return;
              }
            );
          //
        },
        (error) => {
          this.Messages.AddMessage(
            this.service.globalMessageError() +
              ' UserError: ' +
              this.service.globalUserError(),
            'alert-danger'
          );
          return;
        }
      );
  }
  public sendNotification(params: any, action: any): void {
    // let message: Message;
    // if (action === Action.JOINED) {
    //   message = {
    //     from: this.user,
    //     action: action
    //   }
    // } else if (action === Action.RENAME) {
    //   message = {
    //     action: action,
    //     content: {
    //       username: this.user.name,
    //       previousUsername: params.previousUsername
    //     }
    //   };
    // }
    // message.content = '12345';
    // this.socketService.send(message);
    // this.user = new User();
    // this.user.name = 'test';
    // this.socketService.send({
    //   from: this.user,
    //   for: this.user,
    //   content: '99999'
    // });
  }
  public notificationLoad() {
    // console.log(this.sessionService.backChatId);
    this.sessionService.backChatId = this.id;
    this.router.navigate(['ViewChatNotification', this.chat.notification.id], {
      queryParams: {
        // 'appNo': "userid"
        // 'price': myItem.price
      },
    });
  }
  public getProvider() {
    this.sessionService.backChatId = this.id;
    this.sessionService.setViewProvideId(this.chat.provide.id.toString());
    this.router.navigate(['ViewProvideProfile', this.id]);
  }
  public chatsLoadRowData(index: number) {
    if (index === this.messagesChat.length - 1) {
      if (this.chatlength !== this.messagesChat.length) {
        this.chatlength = this.messagesChat.length;
        this.scrollBottom();
      }
    }
    return true;
  }
  scrollBottom() {
    const objDiv = document.getElementById('mesBody');
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  public dataUploadEvent(event: any) {
    if (event.value === 'Change') {
      const formModel = this.Upload.FileChangeValue();
      const upload = formModel.upload;
      const fileName = upload.filename;
      //  ---------------
      console.log('-------------');
      // application/ vnd.ms-excel
      // application/ vnd.openxmlformats-officedocument.spreadsheetml.sheet
      console.log(upload.filetype);
      console.log(fileName);
      console.log('-------------');
      //  -----------------
      // if (upload.filetype.indexOf('image') === -1 && upload.filetype.indexOf('ms-excel') === -1) {
      //   this.Messages.AddMessage('the file type must be (image, excel), the file type (' + upload.filetype
      //     + ') is selected', 'alert-danger');
      //   return;
      // }
    }
    if (event.value === 'Upload') {
      const formModel = this.Upload.FileChangeValue();
      const upload = formModel.upload;
      const fileName = upload.filename;
      // if (upload.filetype.indexOf('image') === -1 && upload.filetype.indexOf('ms-excel') === -1) {
      //   this.Messages.AddMessage('the file type must be (image, excel), the file type (' + upload.filetype
      //     + ') is selected', 'alert-danger');
      //   this.Upload.clear();
      //   return;
      // }
      if (upload.filetype.indexOf('image') !== -1) {
        this.uiService.LoadingStart();
        this.service
          .httpPost(`chat_history/history_image`, {
            id: this.chat.id,
            content: this.Upload.FileDescriptionValue(),
            image: 'data:' + upload.filetype + ';base64,' + upload.value,
          })
          .subscribe(
            (data) => {
              this.uiService.LoadingEnd();
              // Success
              this.socketService.send({
                id: this.chat.id,
                provide: this.chat.provide.id,
                request: this.chat.request.id,
                content: data.body.message.history.id,
              });
              (
                document.getElementById('textToSend') as HTMLInputElement
              ).value = '';
              this.messageContent = null;
              this.Upload.clear();
            },
            (error) => {
              this.uiService.LoadingEnd();
              this.Messages.AddMessage(
                this.service.globalMessageError() +
                  ' UserError: ' +
                  this.service.globalUserError(),
                'alert-danger'
              );
              return;
            }
          );
      } else {
        this.uiService.LoadingStart();
        this.service
          .httpPost(`chat_history/history_document`, {
            id: this.chat.id,
            content: this.Upload.FileDescriptionValue(),
            document: upload.value,
            file_name: fileName,
          })
          .subscribe(
            (data) => {
              this.uiService.LoadingEnd();
              // Success
              this.socketService.send({
                id: this.chat.id,
                provide: this.chat.provide.id,
                request: this.chat.request.id,
                content: data.body.message.history.id,
              });
              (
                document.getElementById('textToSend') as HTMLInputElement
              ).value = '';
              this.messageContent = null;
              this.Upload.clear();
            },
            (error) => {
              this.uiService.LoadingEnd();
              this.Messages.AddMessage(
                this.service.globalMessageError() +
                  ' UserError: ' +
                  this.service.globalUserError(),
                'alert-danger'
              );
              return;
            }
          );
      }
    }
    if (event.value === 'Clear') {
      // this.uiService.ViewFileIframe("miaFacsDocPDF", "");
      // this.selectedFile = false;
      // this.DisabledStep(3);
    }
  }
  ngOnDestroy() {
    // alert('123');
    // this.socketService.unsubscribe();
  }
  transform(value) {
    // console.log(value);
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
  transformHTML(value) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  backChats() {
    if (
      this.sessionService.AuthorizedUser.RoleName ===
      this.sessionService.permission.provider
    ) {
      this.router.navigate(['ProviderChats']);
    } else {
      this.router.navigate(['MyChats']);
    }
  }
}
