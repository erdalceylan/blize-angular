import {User} from '../users/user';
import {Type} from 'class-transformer';

export class Story {
  id?: string
  @Type(() => User)
  user?: User;
  fileName?: string;
  path?: string;
  rootPath?: string;
  @Type(() => Date)
  date?: Date;
  seen?: boolean;

  get file(): string|any {
    if (this.rootPath && this.path && this.fileName) {
      return this.rootPath + this.path + this.fileName;
    }

    return [this.rootPath, this.path, this.fileName];
  }
}
