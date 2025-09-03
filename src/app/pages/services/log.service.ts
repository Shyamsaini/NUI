import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private apiUrl = `${environment.apiUrl}/EShakshya/log`; 

  constructor(private http: HttpClient) {}


  saveActivityLog(logData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json'); 
    return this.http.post(this.apiUrl, logData, { headers });
  }
}
