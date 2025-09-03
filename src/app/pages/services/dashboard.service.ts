import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EsakshyaService {
  private esakshyaApiUrl = `${environment.apiUrl}/api/Napix/GetEsakshyaSeizures`;
  private nyaayShurutiApiUrl = `${environment.apiUrl}/Napix/NyaayShurutiVcList`;
  private DashBoardCountApiUrl = `${environment.apiUrl}/api/AssignIO/Assigned_FIR`;
  private DetailsApiUrl = `${environment.apiUrl}/api/AssignIO/Time_Pendancy?type=Total`;
  constructor(private http: HttpClient) { }

  getEsakshyaSeizures(stateCd: string, fromDate: string): Observable<any> {
    const params = new HttpParams()
      .set('stateCd', stateCd)
      .set('fromDate', fromDate);

    return this.http.get<any>(this.esakshyaApiUrl, { params });
  }

  
  getNyaayShurutiData(domaintype: number): Observable<any> {
    const params = new HttpParams().set('domaintype', domaintype);
    return this.http.get<any>(this.nyaayShurutiApiUrl, { params });
  }

   getDataForCount(): Observable<any> {
    return this.http.get<any>(this.DashBoardCountApiUrl,{});
  }
   getDataTotalDetails(Total: number): Observable<any> {
      const params = new HttpParams()
      .set('Total', Total);
    return this.http.get<any>(this.DetailsApiUrl,{params});
  }
}