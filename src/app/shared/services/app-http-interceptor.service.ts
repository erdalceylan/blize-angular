import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, Subscriber} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {environment} from 'src/environments/environment';

@Injectable()
export class AppHttpInterceptorService implements HttpInterceptor{
  private ANGULAR_HASH: any = '';
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.ANGULAR_HASH = document
      .getElementsByTagName('app-root')
      .item(0)
      ?.getAttribute('data-hash');
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let subscriber: Subscriber<HttpEvent<any>>;
    const observable = new Observable<HttpEvent<any>>(sub => subscriber = sub);

    next.handle(req.clone({headers: req.headers.set('webService', '1')}))
      .subscribe((value) => {
        if (environment.production) {
          if (value instanceof HttpResponse) {
            if (value.headers.has('angular-hash')) {
              if (value.headers.get('angular-hash') !== this.ANGULAR_HASH) {
                this.document.location.reload();
              }
            }
          }
        }

        if (subscriber) {
          subscriber.next(value);
        }
    },
      (error) => subscriber.error(error),
      () => subscriber.complete());

    return observable;
  }

}
