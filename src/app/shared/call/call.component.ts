import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CallService} from "../services/call/call.service";
import {SocketService} from "../services/socket.service";
import {User} from "../services/users/user";
import {UsersService} from "../services/users/users.service";
import {Subscription} from "rxjs";
import {StaticService} from "../services/static.service";
import {plainToClass} from "class-transformer";
import {Call} from "../services/call/call";
import {WebRtcCallService} from "../services/call/web-rtc.call.service";

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnDestroy, AfterViewInit, OnInit {

  @ViewChild('localVideo') localVideo?: ElementRef;
  @ViewChild('remoteVideo') remoteVideo?: ElementRef;
  private localStream?: MediaStream;
  private callData?: Call;
  private acceptData?: Call;
  private accepted = false;
  private closed = false;
  private onOfferSubscription?: Subscription;
  private onAcceptSubscription?: Subscription;
  private onEndCallSubscription?: Subscription;

  constructor( public dialogRef: MatDialogRef<CallComponent>,
               @Inject(MAT_DIALOG_DATA) public data:
                 { user?: User,
                   type: 'call'|'accept',
                   video?: boolean,
                   payload?: Call,
                   constraint: MediaStreamConstraints
                 }  ,
               public ss: StaticService,
               private callService: CallService,
               private socketService: SocketService,
               public webRtcCallService: WebRtcCallService,
               public userService: UsersService){ }
  ngOnInit() {
    const isVideoCall = !!(this.data.video || this.data?.payload?.video);

    this.webRtcCallService.setLocalConfig({video: isVideoCall, audio: true});
    this.webRtcCallService.setRemoteConfig({video: isVideoCall, audio: true});
  }

  ngAfterViewInit(): void {

    this.init();
  }

  private async init() {

    this.webRtcCallService.setMe(this.userService?.session);
    this.webRtcCallService.setTo(this.data?.user);
    this.webRtcCallService.setLocalVideo(this.localVideo?.nativeElement);
    this.webRtcCallService.setRemoteVideo(this.remoteVideo?.nativeElement);

    this.onEndCallSubscription = this.socketService.onCallEnd.subscribe((callEnd) => {
      if (callEnd.id == this.callData?.id && callEnd?.from?.id == this.callData?.from?.id && callEnd?.to?.id == this.callData?.to?.id) {
        this.stop();
      }
    });

    if (this.data.type == 'call') {

      this.callService.call(String(this.data.user?.id), String(Number(this.data.video))).subscribe((cal)=> {
        this.callData = plainToClass(Call, cal);
      });

      this.onAcceptSubscription = this.socketService.onAccept.subscribe((accept) => {
        this.accepted = true;
        this.acceptData = accept;
        if (accept.id == this.callData?.id && accept?.from?.id == this.callData?.from?.id && accept?.to?.id == this.callData?.to?.id) {
            (async ()=>{
              await this.webRtcCallService.init(
                this.callData,
                this.acceptData
              );
              await this.webRtcCallService.offer();
            })();
        }
      });
    }

    if (this.data.type == 'accept') {
      this.callData = this.data.payload;
      this.onOfferSubscription = this.socketService.onOffer.subscribe((data) => {
        (async ()=>{
          await this.webRtcCallService.init(
            this.callData,
            this.acceptData
          );
          await this.webRtcCallService.answer(data.offer);
        })();
      });
    }
  }

  public accept() {
    this.accepted = true;
    this.callService.accept(String(this.data.user?.id), String(this.callData?.id))
      .subscribe((res)=> {
        this.acceptData = plainToClass(Call, res);
      });
  }

  close() {
    this.dialogRef.close();
  }

  public isCaller(): boolean {
    return this.data.type === 'call';
  }

  public isAccepted() {
    return this.accepted;
  }

  public toggleLocalStreamAudio() {
    const conf = this.webRtcCallService.getLocalConfig();
    // @ts-ignore
    conf.audio = !conf?.audio;
    this.webRtcCallService.updateLocalTracks(conf)
  }

  public toggleLocalStreamVideo() {
    const conf = this.webRtcCallService.getLocalConfig();
    // @ts-ignore
    conf.video = !conf?.video;
    this.webRtcCallService.updateLocalTracks(conf)
  }

  public toggleRemoteStreamAudio() {
    const conf = this.webRtcCallService.getRemoteConfig();
    // @ts-ignore
    conf.audio = !conf?.audio;
    this.webRtcCallService.updateRemoteTracks(conf)
  }

  public toggleRemoteStreamVideo() {
    const conf = this.webRtcCallService.getRemoteConfig();
    // @ts-ignore
    conf.video = !conf?.video;
    this.webRtcCallService.updateRemoteTracks(conf)
  }

  stop() {
    if (!this.closed) {
      this.webRtcCallService.stop();
      if (this.data.user) {
        this.callService.close(String(this.data.user?.id), String(this.callData?.id))
          .subscribe((res) =>{});
      }
      this.onOfferSubscription?.unsubscribe();
      this.onAcceptSubscription?.unsubscribe();
      this.onEndCallSubscription?.unsubscribe();
      setTimeout(()=>{
        this.close();
      });
    }

    this.closed = true;
  }

  ngOnDestroy() {
    this.stop();
    this.localStream = undefined;
    this.callData = undefined;
    this.acceptData = undefined;
    this.accepted = false;
  }
}
