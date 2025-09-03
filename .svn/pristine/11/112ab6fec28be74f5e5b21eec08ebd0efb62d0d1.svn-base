import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedleprService {

  constructor(private http: HttpClient) { }

  LoadMedlprData(body: any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/MedleprData`, body);
  }
}
