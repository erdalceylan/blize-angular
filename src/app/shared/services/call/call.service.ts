import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Call} from "./call";

@Injectable({
  providedIn: 'root'
})
export class CallService {

  constructor(public http: HttpClient) { }

  call(userId:string, video: string): Observable<Call> {
    return this.http.post<any>(environment.HTTP_PREFIX + '/call/call/' + userId, new HttpParams().set("video", video));
  }

  accept(userId: string, callId: string): Observable<Call> {
    return this.http.get<any>(environment.HTTP_PREFIX + '/call/accept/' + userId + '/' + callId);
  }

  close(userId: string, callId: string): Observable<Call> {
    return this.http.get<any>(environment.HTTP_PREFIX + '/call/close/' + userId + '/' + callId);
  }
}
