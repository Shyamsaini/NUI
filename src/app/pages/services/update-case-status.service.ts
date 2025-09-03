import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class UpdateCaseStatusService {

 constructor(private http: HttpClient) { }
  
    SearchFir(body: any){
      return this.http.post<any>(`${environment.apiUrl}/Fir/SearchFir`, body);
    }
    GetPillarDataByFirNumber(body: any){
      return this.http.post<any>(`${environment.apiUrl}/Napix/GetPillarDataByFirNumber`, body);
    }
     getCaseStatusList(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/CourtCases/getCaseStatusList`);
  }
  createData(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/CourtCases/UpdateCourtStatus`, data);
  }


  
  CourtDetailsList(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/CourtCases/CourtDetailsList`);
  }

   onDelete(CNRNo: any): Observable<any> {
    debugger
     return this.http.post(`${environment.apiUrl}/CourtCases/DeleteDataByCNR`, { CNRNo });
  }
}
