import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ESakshyadashboardService {
  private esakshyaApiUrl: string = `${environment.apiUrl}/EShakshya/ViewEsakshya`;
  private GetPoliceStationApiUrl: string = `${environment.apiUrl}/Public/GetPoliceStationList`;
  private  urlGetSid = `${environment.apiUrl}/Napix/GetSid?sid=`;
  private  urlGetSidPlay = `${environment.apiUrl}/Napix/PlaySidVideo?FileName=`;

  private eSakshyaPSAndMobileNumber=`${environment.apiUrl}/EShakshya/GetESakshyaByPSAndMobileNumber`;

  private RefresheSakshya=`${environment.apiUrl}/Napix/GetEsakshyaSeizures?stateCd=6`;

  private GetESakshyaDownloadDataAPi=`${environment.apiUrl}/EShakshya/GetESakshyaDownloadData`;

  constructor(private client :HttpClient) { }


  getRefresheSakshya(): Observable<any> {               
      return this.client.get<any>(this.RefresheSakshya);    
  }


  getLinkedstatus(officeCodesString:any,OpeningDate:any,ClosingDate:any,Status:any): Observable<any> {  

    const body = {
      OfficeCode: officeCodesString,
      OpeningDate:OpeningDate,
      ClosingDate:ClosingDate,
      LinkedStatus:Status
    };

    return this.client.post<any>(this.esakshyaApiUrl,body);
  }

 getLinkedstatusPolice(payload: any): Observable<any> {
  const eSakshyaPoliceUrl = `${environment.apiUrl}/EShakshya/GetEsakshyaPoliceStation`;

  return this.client.post<any>(eSakshyaPoliceUrl, payload);
}
 

  getPoliceStation(): Observable<any[]> {
    return this.client.get<any[]>(this.GetPoliceStationApiUrl);
  }
  
  // getSidDetails(sid: string,OfficeCode:any): Observable<any> {
  //   return this.client.get<any>(`${this.urlGetSid}${sid}`);
  // }

  getSidDetails(sid: string, OfficeCode: string): Observable<any> {
    const url = `${this.urlGetSid}${sid}&OfficeCode=${OfficeCode}`;
    return this.client.get<any>(url);
  }
  

  getVideoUrl(fileName: string): Observable<any> {
    return this.client.get<any>(`${this.urlGetSidPlay}${fileName}`);
  }
  

  getPSAndMobileNumber(pscode: string, mobilenumber: string): Observable<any> {
    const params = new HttpParams()
      .set('PSCODE', pscode)
      .set('MobileNumber', mobilenumber);
  
    return this.client.get(this.eSakshyaPSAndMobileNumber, { params });
  }

  getDownloadData(model: any): Observable<any> {
   return this.client.post<any>(`${this.GetESakshyaDownloadDataAPi}`, model);
  }
}
