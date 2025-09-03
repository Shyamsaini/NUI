import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})

export class IodashboardService {
  private DashBoardCountApiUrl = `${environment.apiUrl}/FIR/TotalFirCounts`;
  private DetailsApiUrl: string = `${environment.apiUrl}/AssignIO/Time_Pendancy?type=`;
  private DetailsApiUrlNew: string = `${environment.apiUrl}/FIR/TimePendency`;
  private GetDistrictsApiUrl: string = `${environment.apiUrl}/Public/GetDistricts`;
  private GetPoliceStationApiUrl: string = `${environment.apiUrl}/Public/GetPoliceStationList`;
  private GetPoliceStationFirApiCountUrl: string = `${environment.apiUrl}/FIR/FirListPoliceCount`;
  private GetIODistrictsListUrl: string = `${environment.apiUrl}/Public/GetIOFirDistricts`;
  private GetIOFirPoliceStationListUrl: string = `${environment.apiUrl}/Public/GetIOFirPoliceStations`;
  private GetPoliceStationListUrl: string = `${environment.apiUrl}/Public/GetPoliceStationListByState`;
  private GetPoliceStationAllListBydistricts: string = `${environment.apiUrl}/Public/GetPoliceStationListByDistricts`;
  private FirViewDashboardUpdateUrl: string = `${environment.apiUrl}/FIR/FirViewDashboardUpdate`;
  private GetDistrictsByStateApiUrl: string = `${environment.apiUrl}/Public/GetDistrictsByState`;
  private ESakshyaViewDashboardUpdateUrl: string = `${environment.apiUrl}/EShakshya/ESakshyaViewDashboardUpdate`;

   private GetgetDataListApiUrl: string = `${environment.apiUrl}/FIR/FirList`;
   constructor(private http: HttpClient,private datePipe: DatePipe) { }
    getDataForCount(): Observable<any> {
    return this.http.post<any>(this.DashBoardCountApiUrl,{});
  }
    getDataTotalDetails(Total: string): Observable<any> {
      return this.http.get<any>(this.DetailsApiUrl + Total);
    }
 getDataTotalDetailsNew(FromDate: string, ToDate: string,psCode: string,distcodes: string,type: string): Observable<any[]> {
    const formattedFromDate = this.datePipe.transform(FromDate, 'dd-MM-yyyy') || '';
    const formattedToDate = this.datePipe.transform(ToDate, 'dd-MM-yyyy') || '';
    return this.http.post<any[]>(`${this.DetailsApiUrlNew}`, {
        fromDate: formattedFromDate,
        toDate: formattedToDate,
         policeStations: psCode,
        districts: distcodes,
        type: type
    });
 }

 LoadFirListCount(FromDate: string, ToDate: string,RptFromDate: string, RptToDate: string,distcodes: any[],psCode: any[],Type: string,searchTerm: string,page:number, pageSize: number, sortBy: string,deshboardType:string,actType:string,majorHeadsType:any[]): Observable<any[]> {
  
  const formattedFromDate = this.formatDateString(FromDate);
  const formattedToDate = this.formatDateString(ToDate); 
  //const formattedRptFromDate=this.formatDateString(RptFromDate)
  //const formattedRptToDate =this.formatDateString(RptToDate)

  const formattedRptFromDate = ToDate
  ? this.datePipe.transform(this.parseCustomDate(RptFromDate), 'dd-MM-yyyy') || ''
  : '';
  const formattedRptToDate = ToDate
  ? this.datePipe.transform(this.parseCustomDate(RptToDate), 'dd-MM-yyyy') || ''
  : '';

  return this.http.post<any[]>(`${this.GetPoliceStationFirApiCountUrl}`, {
     fromDate: formattedFromDate,
      toDate: formattedToDate,
      RptFromDate: formattedRptFromDate,// this.datePipe.transform(RptFromDate, 'dd-MM-yyyy') || '',
      RptToDate: formattedRptToDate,//this.datePipe.transform(RptToDate, 'dd-MM-yyyy') || '',
      policeStations: psCode,
      districts: distcodes,
      type: Type,
      search: searchTerm,
       page: page,
      pageSize: pageSize,
      sortBy: sortBy,
      actType : actType,
      DashboardType: deshboardType,
      majorHeadsType: majorHeadsType
  });
}
    


 LoadTimePendency(FromDate: string, ToDate: string,RptFromDate: string, RptToDate: string,psCode: any[],distcodes: any[],type: string,deshboardType:string,actType:string,majorHeadsType:any[]): Observable<any[]> {
 
  return this.http.post<any[]>(`${this.DetailsApiUrlNew}`, {
      fromDate: FromDate,
      toDate: ToDate,
      RptFromDate: RptFromDate || '',
      RptToDate: RptToDate|| '',
      policeStations: psCode,
      districts: distcodes,
      type: type,
      DashboardType: deshboardType,
      actType: actType,
      majorHeadsType: majorHeadsType  
  });
}
formatDateString(dateStr: string): string {
const [day, month, year] = dateStr.split('-');
const date = new Date(`${year}-${month}-${day}`); 
return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
}

getDistrictsCount(): Observable<any> {
  return this.http.get<any>(this.GetDistrictsApiUrl);
}

getDistrictsByState(): Observable<any> {
  return this.http.get<any>(this.GetDistrictsByStateApiUrl);
}

GetPoliceStationListByState(): Observable<any> {
  return this.http.get<any>(this.GetPoliceStationListUrl);
}

 LoadFirList(FromDate: string, ToDate: string,RptFromDate: string, RptToDate: string,distcodes: any[],psCode: any[],Type: string,searchTerm: string,page:number, pageSize: number, sortBy: string,DashboardType: string,actType:string,majorHeadsType:any[]): Observable<any[]> {
  //const formattedFromDate = FromDate//this.datePipe.transform(FromDate, 'dd-MM-yyyy') || '' //FromDate
  //const formattedToDate = ToDate///this.datePipe.transform(ToDate, 'dd-MM-yyyy') || ''//ToDate;
  //const formattedToDate = this.datePipe.transform(ToDate, 'dd-MM-yyyy') || '' //ToDate;

  const formattedFromDate = ToDate
  ? this.datePipe.transform(this.parseCustomDate(FromDate), 'dd-MM-yyyy') || ''
  : '';

  const formattedToDate = ToDate
  ? this.datePipe.transform(this.parseCustomDate(ToDate), 'dd-MM-yyyy') || ''
  : '';
  // Use formattedToDate

  const formattedRptFromDate = ToDate
  ? this.datePipe.transform(this.parseCustomDate(RptFromDate), 'dd-MM-yyyy') || ''
  : '';

  const formattedRptToDate = ToDate
  ? this.datePipe.transform(this.parseCustomDate(RptToDate), 'dd-MM-yyyy') || ''
  : '';

  return this.http.post<any[]>(`${this.GetgetDataListApiUrl}`, {
     fromDate: formattedFromDate,
      toDate: formattedToDate,
      RptFromDate: formattedRptFromDate,
      RptToDate: formattedRptToDate,
      policeStations: psCode,
      districts: distcodes,
      type: Type,
      search: searchTerm,
      page: page,
      pageSize: pageSize,
      sortBy: sortBy,
      DashboardType: DashboardType,
      actType: actType,
      majorHeadsType:majorHeadsType
  });
}

parseCustomDate(dateString: string | null | undefined): Date | null {
  // Handle null/undefined/empty input immediately
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

  // Additional validation for valid date values
  if (isNaN(day) || isNaN(month) || isNaN(year) ||
      day < 1 || day > 31 ||
      month < 0 || month > 11 ||
      year < 1900
  ) {
    return null;
  }

  const date = new Date(year, month, day);
  
  // Final validation for JS Date quirks (like 31 Feb becomes 3 Mar)
  return date.getFullYear() === year && 
         date.getMonth() === month && 
         date.getDate() === day
         ? date
         : null;
}

LoadDistricts(): Observable<any> {
  return this.http.get<any>(this.GetDistrictsApiUrl);
}


GetIOFirDistrictsList(): Observable<any> {
  return this.http.get<any>(this.GetIODistrictsListUrl);  
}

  GetIOFirPoliceStationList(distcodes: number[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.GetIOFirPoliceStationListUrl}`, {districts:distcodes});
  }



GetAllPoliceStationListBydistricts(distcodes: number[]): Observable<any[]> {
  return this.http.post<any[]>(`${this.GetPoliceStationAllListBydistricts}`, {districts:distcodes});
}

  LoadPoliceStations(distcodes: number[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.GetPoliceStationApiUrl}`, {districts:distcodes});
  }
  

  getPoliceStation(distcodes: number[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.GetPoliceStationApiUrl}`, {districts:distcodes});
  }
  
  LoadFirCounts(distcodes: any[],psCode: any[],FromDate: string, ToDate: string,DashboardType:string,actType:string,majorHeadsType:any[]): Observable<any[]> {

    return this.http.post<any[]>(`${this.DashBoardCountApiUrl}`, {
        districts: distcodes,
        policeStations: psCode,
        fromDate: FromDate,
        toDate: ToDate,
        DashboardType: DashboardType,
        actType: actType,
        majorHeadsType: majorHeadsType
    });
   }
  

  
   getDataList(FromDate: string, ToDate: string,distcodes: string,psCode: string,Type: string,searchTerm: string,page:number, pageSize: number): Observable<any[]> {
 
    const formattedFromDate = FromDate
    const formattedToDate =ToDate;
    return this.http.post<any[]>(`${this.GetgetDataListApiUrl}`, {
       fromDate: formattedFromDate,
        toDate: formattedToDate,
         policeStations: psCode,
        districts: distcodes,
        type: Type,
        search: searchTerm,
         page: page,
        pageSize: pageSize
    });
  }

    FirViewDashboardUpdate(updateTypes: string[]): Observable<any> {
      // Check if updateTypes contains 'fir'
      if (updateTypes.includes('fir')) {
        // Call FIR-specific API
        return this.http.post<any>(`${this.FirViewDashboardUpdateUrl}`, { updateTypes: updateTypes });    
      } else if (updateTypes.includes('esakshya')) {
        // Call eSakshya-specific API
        return this.http.post<any>(`${this.ESakshyaViewDashboardUpdateUrl}`, { updateTypes: updateTypes });
      }
      else
      {
        return this.http.post<any>(`${this.ESakshyaViewDashboardUpdateUrl}`, { updateTypes: updateTypes });
      }
    }
}
