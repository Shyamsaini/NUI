import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChitrakhoziService  {

  constructor(private http: HttpClient) { }

  getChitraKhoziWithImage(Image: string): Observable<any> {
       const body = {
        image: Image,
    };
    return this.http.post<any>(`${environment.apiUrl}/Napix/ChitraKhoji`, body);
  }

  getChitraKhoziWithImageCCTNS(Image: string): Observable<any> {
       const body = {
        base64_image: Image
    };
   return this.http.post<any>(`${environment.apiUrl}/CCTNSKhozi/CCTNSKHOJI`, body);
   }

}
