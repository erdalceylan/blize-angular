import {User} from '../users/user';
import {Type} from 'class-transformer';

export class Call {
  id?: string;
  @Type(() => User)
  from?: User;
  @Type(() => User)
  to?: User;
  video?: boolean;
  @Type(() => Date)
  date?: Date;
  @Type(() => Date)
  startDate?: Date;
  @Type(() => Date)
  endDate?: Date;
}
