import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
declare var  SimplePeer: import('simple-peer').SimplePeer;
import {Instance, Options, SignalData} from "simple-peer";

@Injectable({
  providedIn: 'root'
})
export class WebRtcService {

  private connection?: Instance;
  private configuration: Options = {
    config: {
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:global.stun.twilio.com:3478?transport=udp',
          ],
        },
        {
          urls: ["turn:eu-0.turn.peerjs.com:3478", "turn:us-0.turn.peerjs.com:3478"],
          username: "peerjs",
          credential: "peerjsp"
        }
      ]
    },
    trickle: true
  }
  public onSignal = new Subject<SignalData>();
  public onTrack = new Subject<MediaStreamTrack>();
  public onStream = new Subject<MediaStream>();

  public init(initiator: boolean,) {
    this.connection = new SimplePeer({...this.configuration, ...{initiator: initiator}});
    this.connection?.on('connect',() => {
      console.log("----connected-----");
    });

    this.connection?.on('signal', (signalData) => {
      this.onSignal.next(signalData);
    });

    this.connection.on('track', (track) => {
      this.onTrack.next(track);
    });

    this.connection.on('stream', (stream) => {
      this.onStream.next(stream);
    });
  }
  public addSignal(signal: SignalData|string) {
    this.connection?.signal(signal);
  }

  public addTrack(track: MediaStreamTrack, mediaStream: MediaStream) {
    this.connection?.addTrack(track, mediaStream);
  }

  public destroy() {
    this.connection?.destroy();
    this.connection = undefined;
  }

}
