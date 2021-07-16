import {Type} from 'class-transformer';

export class User {
  id: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  username: string | undefined;
  email: string | undefined;
  image: string | undefined;
  @Type(() => Date)
  lastSeen: Date|any;

  private typing: Date|undefined;
  setTyping(typing: Date|undefined): void{
    this.typing = typing;
  }
  isTyping(): boolean{
    return this.typing instanceof Date && this.typing.getTime() > new Date().getTime() - 10;
  }

  isOnline(): boolean{
    return this.lastSeen?.getTime() > Date.now() - 1000 * 60;
  }

  firstChar(): string|undefined {
    return this.firstName?.charAt(0).toLowerCase();
  }

  nameShort(): string {
    // @ts-ignore
    return this?.firstName?.charAt(0).toUpperCase() + this?.lastName?.charAt(0).toUpperCase();
  }
}
