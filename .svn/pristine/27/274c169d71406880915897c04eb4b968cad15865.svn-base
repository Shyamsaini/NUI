import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { DecryptApiService } from '../services/decrypt-api.service';

@Injectable()
export class EncryptInterceptor implements HttpInterceptor {
  constructor(private decryptService: DecryptApiService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method === 'POST' && req.body) {      
      try {
        const jsonString = JSON.stringify(req.body);
        const encrypted = this.decryptService.encryptAesToDotNet(jsonString);
        const encryptedReq = req.clone({
          body: { data: encrypted },
        });

        return next.handle(encryptedReq);
      } catch (error) {
        console.error('Encryption failed:', error);
        return next.handle(req);
      }
    }
    return next.handle(req);
  }
}