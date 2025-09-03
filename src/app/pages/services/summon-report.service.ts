import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SummonSubmitServeRequestModel } from '../models/summon-submit-serve-request-model';


@Injectable({
  providedIn: 'root'
})
export class SummonReportService {

  private summonData = 'http://localhost:5296/api/SummonReport/get-summons-report';

  private downloadPdfUrl = 'http://localhost:5296/api/SummonReport/download-summon-pdf';

  private getServedImage = 'http://localhost:5296/api/SummonReport'; 

  private submitSummonServeUrl = 'http://localhost:5296/api/SummonReport/submit-summon-serve';

  private baseUrl = 'http://localhost:5296/api';


  constructor(private http: HttpClient) {}

  // Method to get summon report data from the server
  getSummonReports(payload: any): Observable<any> {
    return this.http.post(this.summonData, payload);  // No need to append '/get-summons-report'
  }

  // Method to download the PDF from the server
  downloadPdf(processId: string): Observable<Blob> {
    const body = { processid: processId };  // Payload for the PDF download request

    // Call API and expect a Blob (PDF data)
    return this.http.post(this.downloadPdfUrl, body, { responseType: 'blob' });
  }

  getImageData(processId: string): Observable<{ imageData: string }> {
    const url = `${this.getServedImage}/get-images-data`;
    return this.http.post<{ imageData: string }>(url, { processId });
  }

  getSummonServeCategory(): Observable<any> {
    return this.http.get('http://localhost:5296/api/SummonReport/GetSummonActions');
  }


  getSummonServedReasons(actionId: number): Observable<any> {
    const url = 'http://localhost:5296/api/SummonReport/get-served-types';
    
    // Directly send actionId as the body since the API expects a plain integer
    return this.http.post(url, actionId, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  //method to submit summon serve data to the server
  submitSummon(data: SummonSubmitServeRequestModel): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.submitSummonServeUrl, data, { headers });
  }

  getMPsStaffInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/SummonReport/GetMPsStaffInfo`);
  }

  getJudgeList(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/SummonReport/GetJudgeList`);
}

getReassignReasonsbyservedCategory(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/SummonReport/GetSummonServedByCategory`);
}

submitAssignSummon(data: any): Observable<any> {
  const url = 'http://localhost:5296/api/SummonReport/AddOrUpdateSummonAssign';
  return this.http.post(url, data);
}

getSummonCountDetails(payload: any): Observable<any> {
  const url = `${this.baseUrl}/SummonReport/GetSummonCountDetails`;
  return this.http.post<any>(url, payload, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  });
}


  
}
