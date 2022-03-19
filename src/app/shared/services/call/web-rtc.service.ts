import {Subject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class WebRtcService {

  private connection: RTCPeerConnection | undefined;
  private configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
      {
        // turn server for test https://webrtc.tools
        // dont use for production
        username: "2f197a91",
        credential: "9ff758e9",
        urls: [
          "turn:95.217.132.49:80?transport=udp",
          "turn:95.217.132.49:80?transport=tcp"
        ]
      }
    ],
    iceCandidatePoolSize: 10,
  };
  public onCandidate = new Subject<RTCPeerConnectionIceEvent>();
  public onTrack = new Subject<MediaStreamTrack[]>();
  private queuedCandidates: any = [];
  private answered = false;

  public init() {
    this.connection = new RTCPeerConnection(this.configuration);

    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onCandidate.next(event);
      }
    };
    this.connection.ontrack = (event) => {
      this.onTrack.next(event.streams[0].getTracks());
    };
  }

  public async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {

    const offer: RTCSessionDescriptionInit | undefined = await this.connection?.createOffer();

    await this.connection?.setLocalDescription(offer);

    return offer;
  }

  public async getAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {

    await this.connection?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer: RTCSessionDescriptionInit | undefined = await this.connection?.createAnswer();

    await this.connection?.setLocalDescription(answer);
    return answer;
  }

  public async setAnswer(answer: RTCSessionDescription): Promise<void> {
    await this.connection?.setRemoteDescription(
      new RTCSessionDescription(answer)
    );

    this.answered = true;
  }

  public async addCandidate(candidate: any) {
    if (!this.answered) {
      this.queuedCandidates.push(candidate);
      return;
    }

    if (this.queuedCandidates.length > 0) {
      this.queuedCandidates.forEach((c: any) => {
        this.connection?.addIceCandidate(new RTCIceCandidate(c));
      })

      this.queuedCandidates = [];
    }

    if (candidate) {
      const c = new RTCIceCandidate(candidate);
      await this.connection?.addIceCandidate(c);
    }
  }

  public async addTrack(track: MediaStreamTrack, mediaStream: MediaStream) {

    this.connection?.addTrack(track, mediaStream);
  }

  public destroy() {
    this.connection?.close();
    this.connection = undefined;
    this.answered = false;
  }

}
