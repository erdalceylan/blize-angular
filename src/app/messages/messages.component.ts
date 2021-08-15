import {Component, OnInit} from '@angular/core';
import {MessagesService} from '../shared/services/messages/messages.service';
import {Message} from '../shared/services/messages/message';
import {StaticService} from '../shared/services/static.service';
import {UsersService} from '../shared/services/users/users.service';
import {Router} from '@angular/router';
import {User} from '../shared/services/users/user';
import {SocketService} from '../shared/services/socket.service';
import {plainToClass} from 'class-transformer';
import {EventService} from '../shared/services/event.service';
import {ChatComponent} from './chat/chat.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit{

  messages: Message[] = [];
  selectedUser: User | undefined;
  input = '';
  groupListLoading = false;

  constructor(
    public ss: StaticService,
    public messagesService: MessagesService,
    public usersService: UsersService,
    private router: Router,
    private socketService: SocketService,
    private eventService: EventService
    ) { }

  ngOnInit(): void {
    this.messages = [];
    this.groupListLoading = false;
    this.getGroupList();

    this.socketService.onTyping.subscribe((data) => {
      this.messages.forEach((message) => {
        const otherUser = this.getOther(message);
        if (data.from?.id === otherUser?.id) {
          otherUser?.setTyping(data.typing === 1 ? new Date() : undefined);
        }
      });
    });

    this.socketService.onRead.subscribe((event) => {
      this.messages.forEach((message) => {
        const otherUser = this.getOther(message);
        if (event.from?.id === otherUser?.id) {
          message.read = true;
        }
      });
    });

    this.eventService.onRead.subscribe((data) => {
      this.messages.forEach((message) => {
        const otherUser = this.getOther(message);
        if (data?.to?.id === otherUser?.id) {
          message.unReadCount = 0;
        }
      });
    });

    this.eventService.onMessage.subscribe((message: Message) => {
      let found = false;
      this.messages = this.messages.map((m) => {
        const otherUser = this.getOther(m);
        if (message.to?.id === otherUser?.id) {
          found = true;
          message.unReadCount = m.unReadCount;
          return message;
        }
        return m;
      });
      if (!found){
        this.messages.push(message);
      }
      this.sortMessages();
    });

    this.socketService.onMessage.subscribe((message: Message) => {
      let found = false;
      this.messages = this.messages.map((m) => {
        const  o = this.getOther(m);

        if (o?.id === message.from?.id) {
          found = true;
          if (ChatComponent.to?.id !== o?.id) {

            message.unReadCount = m.unReadCount ? m.unReadCount + 1 : 1;
          }

          return message;
        }
        return m;
      });

      if (!found) {
        this.messages.push(message);
      }
      this.sortMessages();
    });
  }

  getGroupList(): void {
    if (this.groupListLoading) {
      return;
    }
    this.groupListLoading = true;
    this.messagesService.getGroupList(this.messages.length).subscribe((messages) => {
      this.messages = this.messages.concat( messages.map(m => plainToClass(Message, m)));
      this.sortMessages();
      this.groupListLoading = false;
    });
  }

  sortMessages(): void {
    this.messages = this.messages.sort((a, b) => {
      if (a.date?.getTime() > b.date?.getTime()) {
        return -1;
      }
      if (a.date?.getTime() < b.date?.getTime()) {
        return 1;
      }
      return  0;
    });
  }

  getOther(message: Message): User | undefined {
    return this.usersService.session?.id === message.from?.id ? message.to : message.from;
  }

  filterByInput(message: Message): boolean {
    const otherUser = this.getOther(message);
    const  fullName = (otherUser?.firstName + ' ' + otherUser?.lastName).toLocaleLowerCase('tr-TR');

    return this.input.length === 0
      || fullName.indexOf(this.input) !== -1
      || otherUser?.username?.indexOf(this.input) !== -1
      || message?.text?.indexOf(this.input) !== -1;
  }
}
