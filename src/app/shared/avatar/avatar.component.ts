import {AfterViewInit, Component, HostBinding, Input} from '@angular/core';
import {StaticService} from "../services/static.service";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements AfterViewInit {

  @Input('firstChar') public firstChar?: string;
  @Input('nameShort') public nameShort?: string;
  @Input('url') public url?: string;

  @HostBinding('class') get classes(): string {
    if (this.firstChar) {
      return 'bg-color-'+this.firstChar;
    }
    return '';
  }

  constructor(
    public ss: StaticService
  ) { }

  ngAfterViewInit(): void {
  }
}
