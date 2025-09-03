// src/app/core/interceptors/jwt.interceptor.ts
import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class jwtInterceptor implements HttpInterceptor {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);

  constructor(private loaderService: LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.loaderService.show();

    // 1. Sanitize all URLs in the request
    const safeUrl = this.sanitizeUrl(request.url);
    let safeRequest = request.clone({ url: safeUrl });

    // 2. Add JWT token if available
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const jwtToken = JSON.parse(userData).jwtToken;
        safeRequest = safeRequest.clone({
          setHeaders: {
            Authorization: `Bearer ${jwtToken}`,
            'X-Content-Type-Options': 'nosniff', // Security header
            'Content-Security-Policy': "default-src 'self'" // Additional protection
          }
        });
      }
    }

    // 3. Sanitize all headers
    const sanitizedHeaders = this.sanitizeHeaders(safeRequest.headers);
    safeRequest = safeRequest.clone({ headers: sanitizedHeaders });

    return next.handle(safeRequest).pipe(
      // finalize(() => this.loaderService.hide())
    );
  }

  private sanitizeUrl(url: string): string {
    // Sanitize the URL to prevent header injection
    return this.sanitizer.sanitize(SecurityContext.URL, url) || '';
  }

  private sanitizeHeaders(headers: HttpHeaders): HttpHeaders {
    // Sanitize all header values
    let sanitizedHeaders = new HttpHeaders();
    headers.keys().forEach(key => {
      const value = headers.get(key);
      if (value) {
        sanitizedHeaders = sanitizedHeaders.append(
          key, 
          this.sanitizer.sanitize(SecurityContext.HTML, value) || ''
        );
      }
    });
    return sanitizedHeaders;
  }
}