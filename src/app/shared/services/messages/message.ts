import {User} from '../users/user';
import {Type} from 'class-transformer';

export class Message {
  id: number|undefined;
  @Type(() => User)
  from: User|undefined;
  @Type(() => User)
  to: User|undefined;
  text: string|undefined;
  @Type(() => Date)
  date: Date|any;
  read: boolean | undefined;
  unReadCount: number|undefined;
}
