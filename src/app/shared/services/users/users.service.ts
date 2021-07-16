import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from './user';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {plainToClass} from 'class-transformer';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  session: User|undefined;

  constructor(public http: HttpClient) { }

  sessionInit(): Observable<User> {
    return new Observable((s) => {
      if (this.session === undefined) {
        this.ping().subscribe((user) => {
          this.session = plainToClass(User, user);
          s.next(user);
        });
      } else {
        s.next(this.session);
      }
    });
  }

  private pingInterval(): void {
    setTimeout(() => {
      this.ping().subscribe((user) => {
        this.session = plainToClass(User, user);
      });
    }, 1000);

  }

  ping(): Observable<User> {
    return this.http.get<User>(environment.HTTP_PREFIX + '/user/ping');
  }

  detail(id: any): Observable<User> {
    return this.http.get<User>(environment.HTTP_PREFIX + '/user/detail/' + id);
  }

  detailByUsername(username: any): Observable<User> {
    return this.http.get<User>(environment.HTTP_PREFIX + '/user/detail-username/' + username);
  }

  login(httpParams: HttpParams): Observable<User>{
    return this.http.post<User>(environment.HTTP_PREFIX + '/login', httpParams);
  }

  jwt(httpParams?: HttpParams): Observable<{ token: string }>{
    return this.http.post<{ token: string }>(environment.HTTP_PREFIX + '/user/jwt', httpParams);
  }

  search(httpParams?: HttpParams): Observable<User[]>{
    return this.http.post<User[]>(environment.HTTP_PREFIX + '/search', httpParams);
  }
}
