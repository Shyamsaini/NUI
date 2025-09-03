import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataAnalyticsService {
  private MajorHeadlist = `${environment.apiUrl}/Public/GetMajorHeadList`;
  private MinorHeadlists = `${environment.apiUrl}/Public/GetMinorHeadList`;
   private DashAnalyticsCount = `${environment.apiUrl}/DataAnalytic/DataAnalytics`;
   private DashAnalyticsCountDetail = `${environment.apiUrl}/DataAnalytic/DataAnalyticsDetails`;
   
 

  
 constructor(private http: HttpClient,private datePipe: DatePipe) {}

 getMajorHeadlists(): Observable<any> {
  return this.http.get<any>(this.MajorHeadlist);
}


getMinorHeadlists(majorHeadCodes: number[]): Observable<any[]> {



 const payload = majorHeadCodes;
console.log("Majorhead Codes to Send:", payload);
  
  return this.http.post<any[]>(this.MinorHeadlists, payload);
}

getAnalyticsData(
  GroupBy: string[],
  MajorHeads: string[],
  MinorHeads: string[],
  psCode: string[],
 
  FromDate: string,
  ToDate: string,

  
): Observable<any[]> {
  
  const formattedFromDate = this.datePipe.transform(FromDate, 'yyyy-MM-dd') || '';
  const formattedToDate = this.datePipe.transform(ToDate, 'yyyy-MM-dd') || '';

 
  const payload = {
    ioCode: "",
    fromDate: formattedFromDate,
    toDate: formattedToDate,
    loginID: "",
    psCode: psCode || [],
    majorHeads: MajorHeads || [],
    minorHeads: MinorHeads || [],
    groupBy: GroupBy || [psCode]
  };



  return this.http.post<any[]>(`${this.DashAnalyticsCount}`, payload);
}
getAnalyticsDataDetails(
  MajorHeads: number[],
  MinorHeads: number[],
  psCode: number[],
  iocode: number,
  Year:number,
  FromDate: string,
  ToDate: string,
  pageNumber:any,
  pageSize:any,): Observable<any[]> {
  
    const formattedFromDate = this.datePipe.transform(FromDate, 'yyyy-MM-dd') || '';
    const formattedToDate = this.datePipe.transform(ToDate, 'yyyy-MM-dd') || '';
  
   
    const payload = {
      ioCode: '',
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      AssignIOCd : iocode||null,
      Year:Year,
      loginID: "",
      psCode: psCode || [ ],
      majorHeads: MajorHeads || [ ],
      minorHeads: MinorHeads || [ ],
      pageNumber:pageNumber,
      pageSize:pageSize,
    };
  
  
  
    return this.http.post<any[]>(`${this.DashAnalyticsCountDetail}`, payload);
  
  
}


}


