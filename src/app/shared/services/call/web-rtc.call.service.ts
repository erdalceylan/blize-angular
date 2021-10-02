import { Injectable } from '@angular/core';
import {CallService} from "./call.service";
import {SocketService} from "../socket.service";
import {User} from "../users/user";
import {WebRtcService} from "./web-rtc.service";
import {Call} from "./call";

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

  constructor(
    private callService: CallService,
    private socketService: SocketService,
    private rtcService: WebRtcService
  ) {}

  public async init(
    call?: Call,
    accept?: Call,
  ) {
    this.call = call;
    this.accept = accept;

    this.rtcService.init();

    await this.handleStream();

    this.socketService.onAnswer.subscribe( (data:any) => {
      this.rtcService.setAnswer(data.answer);
    });

    this.socketService.onCandidate.subscribe( (data:any) => {
      this.rtcService.addCandidate(data.candidate);
    });

    this.rtcService.onCandidate.subscribe((candidate) => {
      this.socketService.socket.emit('candidate', {
        to: this.to,
        candidate: (candidate.candidate as any).toJSON()
      });
    });
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

  public async offer() {
    if (this.call?.id == this.accept?.id) {
      const offer = await this.rtcService.getOffer() as any;
      this.socketService.socket.emit('offer', {
        to: this.to,
        offer: offer.toJSON()
      });
    }
  }

  public async answer(offer: any) {
    if (this.call?.id == this.accept?.id) {
      const answer = await this.rtcService.getAnswer(offer) as any;
      this.socketService.socket.emit('answer', {
        to: this.to,
        answer: answer.toJSON()
      });
    }
  }

  private async handleStream() {

    this.remoteStream = new MediaStream();

    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    this.rtcService.onTrack.subscribe((tracks) => {
      tracks.forEach((track) => {
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
    if (this.localVideo) {
      this.localVideo.srcObject = this.localStream;
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
    this.localConfig = undefined;
    this.remoteConfig = undefined;
  }
}
