import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreatehierarchyService {

  constructor(private http: HttpClient) { }

  Createhierarchy(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Hierarchy/CreateHierarchy`, data);
  }

 Createsubdivision(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Hierarchy/CreateSubdivision`, data);
  }

  getAllRanges(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Range/GetAllRanges`);
  }

  getSubDivision(district: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Range/GetAllSubDivision?district=${district}`);
  }
  getDistrictsByRange(range: number) {
    return this.http.get<any>(`${environment.apiUrl}/Range/GetDistrictsByRange?range=${range}`);
  }


  getRangeDetails(sortOrder: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Range/GetRangeDetails`, {
      params: {
        sortOrder: sortOrder
      }
    });
  }

   GetSubDivisionDetails(sortOrder: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Range/GetSubDivisionDetails`, {
      params: {
        sortOrder: sortOrder
      }
    });
  }
}
