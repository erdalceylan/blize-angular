import {Injectable} from '@angular/core';
import {io} from 'socket.io-client';
import {UsersService} from './users/users.service';
import {Subject} from 'rxjs';
import {Message} from './messages/message';
import {plainToClass, Type} from 'class-transformer';
import {User} from './users/user';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService{
  public socket: any;
  public onMessage = new Subject<Message>();
  public onTyping = new Subject<TypingEventData>();
  public onRead = new Subject<ReadEventData>();
  constructor(
    public usersService: UsersService
  ) {}

  init(): void {

    this.socket = io(environment.SOCKET_URL);
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
