import {User} from '../users/user';
import {Story} from "./story";
import {Type} from 'class-transformer';

export class StoryGroup {
  @Type(() => User)
  user?: User;
  @Type(() => Story)
  items?: Story[];
}
