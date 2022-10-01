import {AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

  private callData?: Call;
  private acceptData?: Call;
  private accepted = false;
  public stopped = false;

  private onAcceptSubscription?: Subscription;
  private onEndCallSubscription?: Subscription;
  public smallVideoPosition = {top:15, left:15, originTop: 15, originLeft: 15};

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
  }

  ngAfterViewInit(): void {

    const isVideoCall = !!(this.data.video || this.data?.payload?.video);

    this.webRtcCallService.setLocalConfig({video: isVideoCall, audio: true});
    this.webRtcCallService.setRemoteConfig({video: isVideoCall, audio: true});
    this.webRtcCallService.setMe(this.userService?.session);
    this.webRtcCallService.setTo(this.data?.user);
    this.webRtcCallService.setLocalVideo(this.localVideo?.nativeElement);
    this.webRtcCallService.setRemoteVideo(this.remoteVideo?.nativeElement);

    this.init();
  }

  private async init() {

    await this.webRtcCallService.handleLocaleStream();

    if (this.data.type == 'call') {
      this.initTypeCall()
    }

    if (this.data.type == 'accept') {
      this.initTypeAccept();
    }

    this.onEndCallSubscription = this.socketService.onCallEnd.subscribe((callEnd) => {
      if (callEnd.id == this.callData?.id && callEnd?.from?.id == this.callData?.from?.id && callEnd?.to?.id == this.callData?.to?.id) {
        this.stop();
      }
    });
  }

  private async initTypeCall() {
    this.callService.call(String(this.data.user?.id), String(Number(this.data.video))).subscribe((cal)=> {
      this.callData = plainToClass(Call, cal);
    });

    this.onAcceptSubscription = this.socketService.onAccept.subscribe((accept) => {
      this.accepted = true;
      this.acceptData = accept;
      if (accept.id == this.callData?.id && accept?.from?.id == this.callData?.from?.id && accept?.to?.id == this.callData?.to?.id) {
        this.webRtcCallService.init(this.callData, this.acceptData);
      }
    });
  }

  private initTypeAccept() {
    this.callData = this.data.payload;
  }

  public async accept() {
    this.accepted = true;
    this.webRtcCallService.init(this.callData, this.acceptData);
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

  public toggleLocalStream(type: 'audio'|'video') {
    const conf = this.webRtcCallService.getLocalConfig();
    if (conf) {
      conf[type] = !conf[type];
      this.webRtcCallService.updateLocalTracks(conf)
    }
  }

  public toggleRemoteStream(type: 'audio'|'video') {
    const conf = this.webRtcCallService.getRemoteConfig();
    if (conf) {
      conf[type] = !conf[type];
      this.webRtcCallService.updateRemoteTracks(conf)
    }
  }

  moveSmallVideo(e:any){
    this.smallVideoPosition.top = this.smallVideoPosition.originTop + e.deltaY;
    this.smallVideoPosition.left = this.smallVideoPosition.originLeft + e.deltaX;
  }

  endMoveSmallVideo(e:any){
    this.smallVideoPosition.originTop  = this.smallVideoPosition.top;
    this.smallVideoPosition.originLeft = this.smallVideoPosition.left;
  }

  stop(){

    if (this.stopped) {
      return;
    }
    this.stopped = true;

    this.webRtcCallService.stop();

    if (this.data.user) {
      this.callService.close(String(this.data.user?.id), String(this.callData?.id))
        .subscribe((res) =>{});
    }

    this.onAcceptSubscription?.unsubscribe();
    this.onEndCallSubscription?.unsubscribe();

    setTimeout(()=>{
      this.dialogRef.close();
    },2);

    this.callData = undefined;
    this.acceptData = undefined;
    this.accepted = false;
  }

  @HostListener('window:unload', ['$event'])
  ngOnDestroy() {
    this.stop();
    this.stopped = false;
  }

}
