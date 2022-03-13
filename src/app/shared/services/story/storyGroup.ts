import {User} from '../users/user';
import {Story} from "./story";
import {Type} from 'class-transformer';

export class StoryGroup {
  @Type(() => User)
  user?: User;
  @Type(() => Story)
  items?: Story[];

  get seen (): boolean {
    if (this.items) {
      return this.items?.every((item:Story)=> item.seen);
    }
    return false;
  }
}
