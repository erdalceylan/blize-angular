import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {animate, AnimationBuilder, AnimationPlayer, style} from "@angular/animations";

@Component({
  selector: 'app-timer-line-item',
  templateUrl: './timer-line-item.component.html',
  styleUrls: ['./timer-line-item.component.scss']
})
export class TimerLineItemComponent implements AfterViewInit {

  private animationPlayer?: AnimationPlayer;

  private _pause = false;
  @Input('pause') set pause(value: boolean) {
    this._pause = value;
    if (this._play && !value) {
      this.animationPlayer?.play();
    } else if (value){
      this.animationPlayer?.pause();
    }
  }

  private _play = false;
  @Input('play') set play(value: boolean) {
    this._play = value;
    if (value) {
      this.animationPlayer?.play()
    }
  }

  private _reset = false;
  @Input('reset') set reset(value: boolean) {
    this._reset = value;
    if (value) {
      this.animationPlayer?.reset();
    }
  }

  private _finish = false;
  @Input('finish') set finish(value: boolean) {
    this._finish = value;
    if (value) {
      this.animationPlayer?.finish();
    }
  }

  private _timing = 6000;
  @Input('timing') set timing(value: number) {
    this._timing = value;
  }

  @ViewChild('timerLineItem') public timerLineItem?: ElementRef;
  @Output('timeEnd') public timeEnd = new EventEmitter<any>();

  constructor(private animationBuilder: AnimationBuilder) { }

  ngAfterViewInit(): void {

    const factory = this.animationBuilder.build([
      style({width: '0px'}),
      animate(this._timing, style({width: '100%'}))
    ]);

    this.animationPlayer = factory.create(this.timerLineItem?.nativeElement,{});

    this.animationPlayer.onDone(()=>{
      if (this._play) {
        this.timeEnd.next();
      }
    });

    if (this._play) {
      this.animationPlayer?.play();
    }
  }

}
