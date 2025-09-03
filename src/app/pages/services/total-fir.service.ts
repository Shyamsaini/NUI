import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TotalFirService {
private apiCaseUrl = `${environment.apiUrl}/CourtCases/TotalFir`;
 private apiAccusedPettyCrimeUrl = `${environment.apiUrl}/CourtCases/AccusedPettyCrime`;
 private apiAccusedTotalFIRUrl = `${environment.apiUrl}/CourtCases/AccusedTotalFIR`;
 private apiAccusedTotalFIRUrlBySp = `${environment.apiUrl}/CourtCases/AccusedTotalFIR`;
  private apiTotalListUrl = `${environment.apiUrl}/CourtCases/GetTotalListFIR`;
   private ApiBindDataByPSUrl = `${environment.apiUrl}/CourtCases/GetDataAllByPS`;
  constructor(private http: HttpClient) { }
   TotalFir(psCode: string, fromDate: string, toDate: string): Observable<any> {
    const body = {
      startDate: fromDate,
      endDate:toDate,
       psCode:psCode
    };
    return this.http.post<any>(this.apiCaseUrl, body);
  }
     AccusedPettyCrime(psCode: string,fromDate: string, toDate: string): Observable<any> {
    const body = {
      startDate: fromDate,
      endDate: toDate,
       psCode:psCode
    };
    return this.http.post<any>(this.apiAccusedPettyCrimeUrl, body);
  }
  AccusedFIR(psCode: string, fromDate: string, toDate: string): Observable<any> {
    const body = {
      startDate: fromDate,
      endDate: toDate,
      psCode:psCode
    };
    return this.http.post<any>(this.apiAccusedTotalFIRUrl, body);
  }
   TotalList(psCode: string,fromDate: string, toDate: string): Observable<any> {
    const body = {
      startDate: fromDate,
      endDate: toDate,
      psCode:psCode
    };
    return this.http.post<any>(this.apiTotalListUrl, body);
  }
   BindDataByPS(psCode: string,fromDate: string, toDate: string): Observable<any> {
    const body = {
      psCode: psCode,
      startDate: fromDate,
      endDate:toDate
    };
    return this.http.post<any>(this.ApiBindDataByPSUrl, body);
  }
   AccusedFIRBYSp(psCode: string, fromDate: string, toDate: string): Observable<any> {
    const body = {
      startDate: fromDate,
      endDate: toDate,
      psCode:String(psCode)
    };
    return this.http.post<any>(this.apiAccusedTotalFIRUrl, body);
  }
   AccusedPettyCrimeBYSP(psCode: string,fromDate: string, toDate: string): Observable<any> {
    const body = {
      startDate: fromDate,
      endDate: toDate,
      psCode:String(psCode)
    };
    return this.http.post<any>(this.apiAccusedPettyCrimeUrl, body);
  }
   TotalListBySp(psCode: string,fromDate: string, toDate: string): Observable<any> {
    const body = {
      startDate: fromDate,
      endDate: toDate,
      psCode:String(psCode)
    };
    return this.http.post<any>(this.apiTotalListUrl, body);
  }
}

