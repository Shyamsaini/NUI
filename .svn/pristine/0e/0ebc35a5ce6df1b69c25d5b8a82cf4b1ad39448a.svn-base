import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Roles/GetRoles`);
  }

   // Fetch menus by role from API
   getMenusByRole(roleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Roles/GetUserMenuAccessByRoleId/${roleId}`);
  }


  saveMenuAssignment(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Roles/upsertMenus`, payload);
  }
}

