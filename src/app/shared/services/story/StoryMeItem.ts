import {User} from '../users/user';
import {Type} from 'class-transformer';
import {StoryViewItem} from "./StoryViewItem";

export class StoryMeItem {
  id?: string
  @Type(() => User)
  user?: User;
  fileName?: string;
  path?: string;
  rootPath?: string;
  @Type(() => Date)
  date?: Date;
  @Type(() => StoryViewItem)
  views?: StoryViewItem[];
  viewsLength?: number

  get file(): string|any {
    if (this.rootPath && this.path && this.fileName) {
      return this.rootPath + this.path + this.fileName;
    }

    return [this.rootPath, this.path, this.fileName];
  }
}
