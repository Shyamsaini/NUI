import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DecryptApiService } from '../services/decrypt-api.service';
import { map } from 'rxjs/operators';
@Injectable()
export class decryptInterceptor implements HttpInterceptor {
  constructor(private DecryprApiService: DecryptApiService) {}
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && typeof event.body.data === 'string') {
          const decrypted = this.DecryprApiService.decryptAesFromDotNet(event.body.data);
          const parsed = JSON.parse(decrypted);
          return event.clone({ body: parsed });
        }
        return event;
      })
    );
  }
}