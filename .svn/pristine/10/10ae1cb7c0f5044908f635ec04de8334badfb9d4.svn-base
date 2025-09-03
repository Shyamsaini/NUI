import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IcjsSearchService {

  constructor(private http: HttpClient) { }

  SearchFir(body: any){
    return this.http.post<any>(`${environment.apiUrl}/Fir/SearchFir`, body);
  }

  LoadOtherPillars(body: any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/OtherPillarInformation`, body);
  }
}
