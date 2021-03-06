import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../model/message';
import { Event } from '../model/Event';
import {AppConfig} from '../../../services/app.config';
import { environment } from 'src/environments/environment';

import * as socketIo from 'socket.io-client';

// const SERVER_URL = 'http://localhost:8080';
const SERVER_URL = environment.socketBaseUrl;

@Injectable()
export class SocketService {
  private socket;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
    // console.log(this.socket);
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }
  public unsubscribe() {
      this.socket.off();
  }
  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
