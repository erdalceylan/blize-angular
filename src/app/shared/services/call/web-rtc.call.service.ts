import { Injectable } from '@angular/core';
import {CallService} from "./call.service";
import {SocketService} from "../socket.service";
import {User} from "../users/user";
import {WebRtcService} from "./web-rtc.service";
import {Call} from "./call";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebRtcCallService {

  private me?: User;
  private to?: User;
  private localConfig?: {video?: boolean, audio?: boolean} = {video: true, audio: true};
  private remoteConfig?: {video?: boolean, audio?: boolean} = {video: true, audio: true};
  private localStream?: MediaStream;
  private remoteStream?: MediaStream;
  private localVideo?: HTMLVideoElement;
  private remoteVideo?: HTMLVideoElement;
  private call?: Call;
  private accept?: Call;
  private socketServiceOnSignalSubscription ?: Subscription;
  private rtcServiceOnSignalSubscription ?: Subscription;
  private rtcServiceOnStreamSubscription ?: Subscription;

  constructor(
    private callService: CallService,
    private socketService: SocketService,
    private rtcService: WebRtcService
  ) {}

  public init(
    call?: Call,
    accept?: Call,
  ) {
    this.call = call;
    this.accept = accept;

    this.rtcService.init(this.call?.from?.id === this.me?.id);

    this.socketServiceOnSignalSubscription = this.socketService.onSignal.subscribe( (data:any) => {
      if (this.to?.id == data.from?.id || true) {
        this.rtcService.addSignal(data.signal);
      }
    });

    this.rtcServiceOnSignalSubscription = this.rtcService.onSignal.subscribe((signal) => {
      this.socketService.socket.emit('signal', {
        to: this.to,
        signal: JSON.stringify(signal)
      });
    });

    this.handleStream();
  }

  public setMe(me?: User): void {
    this.me = me;
  }

  public setTo(to?: User): void {
    this.to = to;
  }

  public setLocalConfig(config: {video: boolean, audio: boolean}) {
    this.localConfig = config;
  }

  public getLocalConfig() {
    return this.localConfig;
  }

  public setRemoteConfig(config: {video: boolean, audio: boolean}) {
    this.remoteConfig = config;
  }

  public getRemoteConfig() {
    return this.remoteConfig;
  }

  public setLocalVideo(localVideo: HTMLVideoElement) {
    this.localVideo = localVideo;
  }

  public setRemoteVideo(remoteVideo: HTMLVideoElement) {
    this.remoteVideo = remoteVideo;
  }

  private handleStream() {
    this.remoteStream = new MediaStream();
      this.rtcServiceOnStreamSubscription = this.rtcService.onStream.subscribe((stream) => {
        stream.getTracks().forEach((track) => {
          if (track.kind === 'audio') {
            track.enabled = this.remoteConfig?.audio ?? false;
          }
          if (track.kind === 'video') {
            track.enabled = this.remoteConfig?.video ?? false;
          }
          this.remoteStream?.addTrack(track);
        });
      });

      this.localStream?.getTracks().forEach((track) => {
        if (track.kind === 'audio') {
          track.enabled = this.localConfig?.audio ?? false;
        }
        if (track.kind === 'video') {
          track.enabled = this.localConfig?.video ?? false;
        }
        // @ts-ignore
        this.rtcService.addTrack(track, this.localStream);
      });

      if (this.remoteVideo) {
        this.remoteVideo.srcObject = this.remoteStream;
      }
  }

  public updateLocalTracks(config?: {video?: boolean, audio?: boolean}) {
    this.localConfig = config;
    this.updateAudioTrack(this.localStream, config?.audio);
    this.updateVideoTrack(this.localStream, config?.video);
  }

  public updateRemoteTracks(config?: {video?: boolean, audio?: boolean}) {
    this.remoteConfig = config;
    this.updateAudioTrack(this.remoteStream, config?.audio);
    this.updateVideoTrack(this.remoteStream, config?.video);
  }

  private updateAudioTrack(mediaStream:MediaStream|undefined, enabled: boolean|undefined) {
    if (enabled !== undefined) {
      mediaStream?.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      })
    }
  }

  private updateVideoTrack(mediaStream: MediaStream|undefined, enabled: boolean|undefined) {
    if (enabled !== undefined) {
      mediaStream?.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      })
    }
  }

  public async handleLocaleStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (this.localVideo) {
      this.localVideo.srcObject = this.localStream;
    }
  }

  stop() {
    this.remoteStream?.getTracks().forEach((track: any) => track.stop());
    this.localStream?.getTracks().forEach((track: any) => track.stop());
    this.rtcService.destroy();
    this.me = undefined;
    this.to = undefined;
    this.localStream = undefined;
    this.remoteStream = undefined;
    this.localVideo = undefined;
    this.remoteVideo = undefined;
    this.call = undefined;
    this.accept = undefined;
    this.localConfig = {video: true, audio: true};
    this.remoteConfig = {video: true, audio: true};
    this.socketServiceOnSignalSubscription?.unsubscribe();
    this.rtcServiceOnSignalSubscription?.unsubscribe();
    if (this.rtcServiceOnStreamSubscription) {
      this.rtcServiceOnStreamSubscription.unsubscribe();
    }
  }

}
