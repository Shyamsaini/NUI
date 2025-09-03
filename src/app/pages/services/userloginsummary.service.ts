import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserloginsummaryService {

 private apiUrl = `${environment.apiUrl}/ApiLogs`;

  constructor(private http: HttpClient) { }

  GetAllDataCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/UserLoginSummary`);
  }
DetailsLog(MobileNo: string): Observable<any[]> {
  const body = { MobileNo };
  return this.http.post<any[]>(`${this.apiUrl}/LogDetails`, body);
}

}
