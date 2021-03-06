import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StoryGroup} from "../../services/story/storyGroup";
import {StaticService} from "../../services/static.service";
import {Story} from "../../services/story/story";

@Component({
  selector: 'app-cube-face',
  templateUrl: './cube-face.component.html',
  styleUrls: ['./cube-face.component.scss']
})
export class CubeFaceComponent implements OnInit,AfterViewInit {

  private _imageIndex = 0;
  private _index = 0;
  private _frontIndex = 0;
  private _paused = false;
  public inputMessageModel = '';

  @Output('rotate') public rotate = new EventEmitter<'right' | 'left'>();
  @Output('imageChange') public imageChange = new EventEmitter<Story>();
  @Output('sendMessage') public sendMessage = new EventEmitter<{story:Story, text: string}>();
  @Input('item') public item?: StoryGroup;
  @Input('index') public set index(value: number) {
    this._index = value;
  }
  @Input('frontIndex') public set frontIndex(value: number) {
    this._frontIndex = value;
    this.imageIndex = 0;
  }

  constructor(
    public ss: StaticService
  ) {

  }

  ngAfterViewInit(): void {
    if (this.isFront()) {
      this.imageIndex = 0;
    }
  }

  ngOnInit(): void {
  }

  get index(): number {
    return this._index;
  }

  get frontIndex(): number {
    return this._frontIndex;
  }

  get imageIndex(): number {
    return this._imageIndex;
  }

  set imageIndex(value: number) {
    this._imageIndex = value;
    if(this.isFront()) {
      this.imageChange.next(this.getActiveItem());
    }
  }

  isFront(): boolean {
    return this.index === this.frontIndex;
  }

  isPrev(): boolean {
    return this.index === this.frontIndex - 1;
  }

  isNext(): boolean {
    return this.index === this.frontIndex + 1;
  }

  tapLeft(e:any) {
    if (this.isOnFirst()) {
      this.rotateCube('left');
    } else {
      this.imageIndex--;
    }
  }

  tapRight(e:any) {
    if (this.isOnLast()) {
      this.rotateCube('right');
    } else {
      this.imageIndex++;
    }
  }

  pause(e:any) {
    this._paused = true;
    e?.srcEvent?.stopPropagation();
  }

  unPause(e:any) {
    this._paused = false;
  }

  isPaused() {
    return this._paused;
  }

  isOnFirst(): boolean {
    return this.imageIndex <= 0;
  }

  isOnLast(): boolean {
    if (this.item?.items instanceof Array) {
      return this.imageIndex >= this.item.items.length - 1
    }
    return true;
  }

  submitMessage() {
    const activeItem = this.getActiveItem();

    if(activeItem instanceof Story && this.inputMessageModel) {
      this.sendMessage.next({story: activeItem, text: this.inputMessageModel});
      this.inputMessageModel = '';
    }
  }

  getActiveItem() {
    return this.item?.items?.[this.imageIndex];
  }

  timeEnd(e:any) {
    this.tapRight(null);
  }

  rotateCube(direction: 'left'|'right') {
    this.rotate.next(direction);
  }

}
