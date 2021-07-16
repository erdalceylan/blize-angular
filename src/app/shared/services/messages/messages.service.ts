import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Message} from './message';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {User} from '../users/user';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(public http: HttpClient) { }

  getGroupList(): Observable<Message[]> {
    return this.http.get<Message[]>(environment.HTTP_PREFIX + '/messages');
  }

  getDetail(id: any): Observable<{messages: Message[], to: User}> {
    return this.http.get<{messages: Message[], to: User}>(environment.HTTP_PREFIX + '/messages/' + id);
  }

  add(id: any, text: string): Observable<Message> {
    return this.http.post<Message>(environment.HTTP_PREFIX + '/messages/add/' + id, new HttpParams().set('text', text));
  }

  read(id: any): Observable<any>  {
    return this.http.get<Message>(environment.HTTP_PREFIX + '/messages/read/' + id);
  }

}
