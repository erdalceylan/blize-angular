import {Type} from "class-transformer";
import {User} from "../users/user";

export class StoryViewItem
{
  @Type(() => User)
  user?: User;
  date?: Date;
}
