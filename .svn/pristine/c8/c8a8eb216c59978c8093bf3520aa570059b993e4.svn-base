import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class IcjsDeshboardService {
 private apiCaseUrl = `${environment.apiUrl}/CourtCases`;
 private apiCourtCasesDetailsUrl = `${environment.apiUrl}/CourtCases/CourtCesesDetails`;
  private GetPoliceStationApiUrl: string = `${environment.apiUrl}/Public/GetPoliceStationList`;
  constructor(private http: HttpClient,private datePipe: DatePipe) { }
   getCourtCases(DistictCodes : any[], psCode: any[], fromDate: string, toDate: string): Observable<any> {
         const formattedFromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd') || '';
         const formattedToDate = this.datePipe.transform(toDate, 'yyyy-MM-dd') || '';
    const body = {
       districtCodes: DistictCodes,
      psCode: psCode,
      startDate: formattedFromDate,
      endDate:formattedToDate
    };
    return this.http.post<any>(this.apiCaseUrl, body);
  }
formatDateString(dateStr: string): string {
const [day, month, year] = dateStr.split('-');
const date = new Date(`${year}-${month}-${day}`); 
return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
}
parseCustomDate(dateString: string | null | undefined): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return null;
  }
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year) ||
      day < 1 || day > 31 ||
      month < 0 || month > 11 ||
      year < 1900
  ) 
  {
    return null;
  }
  const date = new Date(year, month, day);
  return date.getFullYear() === year && 
         date.getMonth() === month && 
         date.getDate() === day
         ? date
         : null;
}
  //  LoadFirCounts(distcodes: any[],psCode: any[],FromDate: string, ToDate: string,DashboardType:string,actType:string): Observable<any[]> {
  //   return this.http.post<any[]>(`${this.DashBoardCountApiUrl}`, {
  //       districts: distcodes,
  //       policeStations: psCode,
  //       fromDate: FromDate,
  //       toDate: ToDate,
  //       DashboardType: DashboardType,
  //       actType: actType
  //   });
  //  }
 LoadPoliceStations(distcodes: number[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.GetPoliceStationApiUrl}`, {districts:distcodes});
  }
   getCourtCasesDetails(policestation: string, fromDate: string, toDate: string, type: string, policestationcode: string, pageNumber: number, pageSize: number, searchTerm: string): Observable<any> {
    const formattedFromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd') || '';
         const formattedToDate = this.datePipe.transform(toDate, 'yyyy-MM-dd') || '';
    const body = {
      policestation: policestation,
      FromDate: formattedFromDate,
      ToDate: formattedToDate,
      type:type,
      policestationcode:policestationcode,
     pageNumber: pageNumber, 
     pageSize: pageSize,
    searchTerm: searchTerm
    };
    return this.http.post<any>(this.apiCourtCasesDetailsUrl, body);
  }
}