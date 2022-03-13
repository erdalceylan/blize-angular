import { Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MessagesService} from '../../shared/services/messages/messages.service';
import {Message} from '../../shared/services/messages/message';
import {UsersService} from '../../shared/services/users/users.service';
import {StaticService} from '../../shared/services/static.service';
import {SocketService} from '../../shared/services/socket.service';
import {User} from '../../shared/services/users/user';
import {plainToClass} from 'class-transformer';
import {EventService} from '../../shared/services/event.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  static to: User|undefined;
  @ViewChild('scrollContent') scrollContent: ElementRef|undefined;
  messages: Message[] = [];
  input = '';
  routerSubscription: Subscription;
  listLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    public usersService: UsersService,
    public ss: StaticService,
    public socketService: SocketService,
    private eventService: EventService
  ) {
    this.routerSubscription = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.messages = [];
        this.listLoading = false;
        this.getData();
      }
    });
  }

  ngOnInit(): void {
    this.socketService.onMessage.subscribe((message: Message) => {
      if (message.from?.id === this.getTo()?.id) {
        this.messagesPush([message]);
        this.messagesService.read(message.from?.id)
          .subscribe(() => {
            this.eventService.onRead.next({
              to: message?.to
            });
          });
      }
    });

    this.eventService.onMessage.subscribe((message: Message) => {
      if (message.to?.id === this.getTo()?.id) {
        this.messagesPush([message]);
      }
    });

    this.socketService.onTyping.subscribe((data) => {
      if (data.from?.id === this.getTo()?.id) {
        this.getTo()?.setTyping(data.typing === 1 ? new Date() : undefined);
      }
    });

    this.socketService.onRead.subscribe((data) => {
      if (data.from?.id === this.getTo()?.id) {
        this.messages.forEach((m) => {
          if (data.from?.id === m.from?.id) {
            m.read = true;
          }
        });
      }
    });
  }

  getData(): void {
    if(this.listLoading) {
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    const offset: number = this.messages.length;
    const initial = offset === 0;
    this.listLoading = true;

    this.messagesService.detail(id, offset)
      .subscribe((response) => {

        ChatComponent.to = plainToClass(User, response.to);
        this.messagesPush(response.messages.map(m => plainToClass(Message, m)), initial);
        this.listLoading = false;
        if (initial) {
          this.messagesService.read(id)
            .subscribe(() => {
              this.eventService.onRead.next({
                to: this.getTo()
              });
            });
        }
      });
  }

  send(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (this.input.trim().length > 1) {
      this.messagesService.add(id, this.input).subscribe((data) => {
        this.eventService.onMessage.next(plainToClass(Message, data));
      });
      this.input = '';
    }
  }

  sortMessages(): void {
    this.messages = this.messages.sort((a, b) => {
      if (a.date?.getTime() > b.date?.getTime()) {
        return 1;
      }
      if (a.date?.getTime() < b.date?.getTime()) {
        return -1;
      }
      return  0;
    });
  }

  getTo(): User|undefined {
    return ChatComponent.to;
  }

  getOther(message: Message): User | undefined {
    return this.usersService.session?.id === message.from?.id ? message.to : message.from;
  }

  onInput(): void {
    this.socketService.socket.emit('typing', {
      to: this.getTo(),
      typing: this.input.length > 0 ? 1 : 0
    });
  }

  startCall(video: boolean): void {
    this.eventService.startCall.next({user: this.getTo(), video: video});
  }

  scrollToBottom(forceBottom = false): void {
    if (this.scrollContent) {
      const element = this.scrollContent?.nativeElement;
      const isBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      if (isBottom || forceBottom) {
        setTimeout(() => {
          element.scrollTop = element.scrollHeight - element.clientHeight;
        });
      }
    }
  }

  messagesPush(messages: Message[], initial?: boolean): void {
    this.messages = this.messages.concat(messages);
    this.sortMessages();
    this.scrollToBottom(initial);
  }

  ngOnDestroy(): void{
    this.routerSubscription.unsubscribe();
    setTimeout(() => {
      ChatComponent.to = undefined;
    });
  }
}
