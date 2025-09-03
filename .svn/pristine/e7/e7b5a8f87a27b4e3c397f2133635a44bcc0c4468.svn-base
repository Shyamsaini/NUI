import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiLogsDashboardService {

  private apiUrl = `${environment.apiUrl}/ApiLogs`;

  constructor(private http: HttpClient) { }

  searchLogs(filter: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/search-logs`, filter);
  }

  getDistinctApiEndpoints(stateCode: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/distinct-api-endpoints?stateCode=${stateCode}`);
  }
}

