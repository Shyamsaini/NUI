import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IpWhitelist {
  Id: number;
  IpAddress: string;
  Description: string;
  IsActive: boolean;
  createdBy: string;
  createdDate: Date;
  modifiedBy: string;
  modifiedDate: Date;
}

export interface CreateIpWhitelist {
  ipAddress: string;
  description?: string;
}

export interface UpdateIpWhitelist {
  id: number;
  ipAddress: string;
  description?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IpWhitelistService {
  private readonly apiUrl = `${environment.apiUrl}/EShakshya`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IpWhitelist[]> {
    return this.http.get<IpWhitelist[]>( `${this.apiUrl}/ESakshyaIpWhiteList`);
  }

  getById(id: number): Observable<IpWhitelist> {
    return this.http.get<IpWhitelist>(`${this.apiUrl}/ESakshyaIpWhiteList/${id}`);
  }

  create(data: CreateIpWhitelist): Observable<IpWhitelist> {
    return this.http.post<IpWhitelist>(`${this.apiUrl}/ESakshyaIpAdd`, data);
  }

  update(data: UpdateIpWhitelist): Observable<IpWhitelist> {
    return this.http.put<IpWhitelist>(`${this.apiUrl}/ESakshyaIpUpdate/${data.id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ESakshyaIpWhiteRemove/${id}`);
  }
}