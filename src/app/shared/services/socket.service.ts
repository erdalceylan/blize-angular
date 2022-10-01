import {Injectable} from '@angular/core';
import {io} from 'socket.io-client';
import {UsersService} from './users/users.service';
import {Subject} from 'rxjs';
import {Message} from './messages/message';
import {plainToClass, Type} from 'class-transformer';
import {User} from './users/user';
import {environment} from 'src/environments/environment';
import {Call} from "./call/call";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class SocketService{
  public socket: any;
  public onMessage = new Subject<Message>();
  public onTyping = new Subject<TypingEventData>();
  public onRead = new Subject<ReadEventData>();
  public onCall = new Subject<Call>();
  public onAccept = new Subject<Call>();
  public onSignal = new Subject<any>();
  public onCallEnd = new Subject<Call>();
  private socketUrl = environment.SOCKET_URL;
  constructor(
    public usersService: UsersService,
    private cookieService: CookieService
  ) {}

  init(): void {

    if(this.cookieService.check('socket-connection-url')) {
      this.socketUrl = this.cookieService.get('socket-connection-url');
      this.cookieService.delete('socket-connection-url');
    }

    this.socket = io(this.socketUrl,{
      transports: ['websocket']
    });
    this.socket.on('connect', () => {
      this.usersService.jwt()
        .subscribe((response) => {
          this.socket.emit('login', {token: response.token});

          this.socket.on('message', (message: Message) => {
            this.onMessage.next(plainToClass(Message, message));
          });

          this.socket.on('typing', (data: any) => {
            this.onTyping.next(plainToClass(TypingEventData, data));
          });

          this.socket.on('read', (data: any) => {
            this.onRead.next(plainToClass(ReadEventData, data));
          });

          this.socket.on('call', (data: any) => {
            this.onCall.next(plainToClass(Call, data));
          });

          this.socket.on('accept', (data: any) => {
            this.onAccept.next(plainToClass(Call, data));
          });

          this.socket.on('signal', (data: any) => {
            this.onSignal.next(data);
          });

          this.socket.on('call-end', (data: any) => {
            this.onCallEnd.next(plainToClass(Call, data));
          });
      });
    });
    this.socket.on('disconnect', (s: any) => {
      this.socket.connect();
    });
  }


}

export class ReadEventData{
  @Type(() => User)
  from: User|undefined;
}
export class TypingEventData{
  @Type(() => User)
  from: User|undefined;
  typing: number|undefined;
}

export class AnswerEventData{
  @Type(() => User)
  to: User|undefined;
  answer: number|undefined;
}
export class OfferEventData{
  @Type(() => User)
  to: User|undefined;
  offer: number|undefined;
}
