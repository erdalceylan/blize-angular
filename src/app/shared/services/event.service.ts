import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Message} from './messages/message';
import {User} from './users/user';

@Injectable({
  providedIn: 'root'
})
export class EventService{
  public onMessage = new Subject<Message>();
  public onRead = new Subject<{to: User|undefined}>();
  constructor(
  ) {}
}
