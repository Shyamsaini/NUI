import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class UtilityService {

  constructor(private http: HttpClient,private loaderService: LoaderService) { }

 //private GetDistrictsApiUrl: string = `${environment.apiUrl}/Public/GetNyaySetuDistricts`;
 // private GetPoliceStationApiUrl: string = `${environment.apiUrl}/Public/GetNyaySetuPoliceStationList`;

  PoliceStationList(distcode?: string): Observable<any[]> {
    if (distcode) {
      return this.http.get<any[]>(`${environment.apiUrl}/Public/GetPoliceStations?distcode=${distcode}`);
    } else {
      return this.http.get<any[]>(`${environment.apiUrl}/Public/GetPoliceStations`);
    }
  }


   Districts(){
    return this.http.get<any>(`${environment.apiUrl}/Public/GetDistricts`);
  }


  // LoadPoliceStations(distcodes: number[]): Observable<any[]> {
  //   return this.http.post<any[]>(`${environment.apiUrl}/Public/GetPoliceStationList1`, {districts:distcodes});
  // }
  // LoadCourtCaseInformation(body: any){
  //   this.loaderService.show();
  //     return this.http.post<any>(`${environment.apiUrl}/Napix/CaseInformation`, body);
  //     this.loaderService.hide();
  // }
  LoadCourtCaseInformation(body: any) {
    return this.http.post<any>(`${environment.apiUrl}/Napix/CaseInformation`, body);
  }
  LoadFslInformation(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/FslInfo`, body);
  
  }

  LoadProsecutionInformation(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/ProsecutionInfo`, body);
  }

  LoadPrisonerInformation(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/PrisonerInfo`, body);
  }

  LoadMiniStatement(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/MiniStateMent`, body);
   
  }

  LoadMedleprInformation(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/MedleprInformation`, body);
 
  }

  OpinionAdviceInHtml(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/OpinionAdviceHtml`, body);
 
  }
  OpinionAdviceInPDF(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/OpinionAdvicePdfDownload`, body);
    
  }


  viewdocument_proc(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/viewdocument_proc`, body);
  }


  DownloadPdfFileFromByteArray(byteArray:any, fileName: any){
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;  
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  DownloadPdfFileFromBase64(base64:string, fileName: string) {
    const byteCharacters = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName; 
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  DownloadOrder(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/DownloadOrder`, body);
  }

  DownloadFslReport(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/FslReport`, body);
    
  }

ShowErrorPopup(message: string) {
  Swal.fire({
    position: 'top-end',
    title: message,
    showConfirmButton: false,
    timer: 330000000,
    customClass: {
      popup: 'custom-warning-popup',  // Define this in your styles
      title: 'custom-warning-title',
    },
    background: '#ffffff',  // Light yellow background (Bootstrap warning)
  });
}



  LoadDistricts(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Public/GetNyaySetuDistricts`);
  }


   LoadPoliceStationsList(distcodes: number[]): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiUrl}/Public/GetNyaySetuPoliceStationList`, {
      districts: distcodes,
    });
  }    
  LoadPoliceStations(distcodes: number[]): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiUrl}/Public/GetNyaySetuPoliceStationList`, { districts: distcodes });
  }
  
  PoliceStationNyaySetu(distcode?: string): Observable<any[]> {
    if (distcode) {
      return this.http.get<any[]>(`${environment.apiUrl}/Public/GetNyaySetuPoliceStations?distcode=${distcode}`);
    } else {
      return this.http.get<any[]>(`${environment.apiUrl}/Public/GetNyaySetuPoliceStations`);
    }
  }
  LoadUserDetails(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Public/GetUserDetails`);
  }  

}
