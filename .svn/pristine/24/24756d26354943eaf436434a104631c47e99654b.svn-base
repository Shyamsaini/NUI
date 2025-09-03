import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponseModel, DropDownListModel } from '../models/drop-down-list-model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class SearchcaseService {

  private apiUrl = 'http://localhost:5296/api/Napix/GetEstabilishments'; 
  private apiCaseTypeUrl = 'http://localhost:5296/api/Napix/GetCaseTypes';
  private apiActsUrl = 'http://localhost:5296/api/Napix/GetActs';

  private apiGetCaseJudgementTypesUrl = 'http://localhost:5296/api/Napix/GetCaseJudgementTypes';

  private apiSearchByCaseNumberUrl = 'http://localhost:5296/api/Napix/SearchByCaseNumber';
  private apiSearchByFilingNumberUrl = 'http://localhost:5296/api/Napix/SearchByFilingNumber';
  private apiSearchByActUrl = 'http://localhost:5296/api/Napix/SearchByAct';

  private apiSearchByPartyNameUrl = 'http://localhost:5296/api/Napix/SearchByPartyName';


  constructor(private http: HttpClient) { }


  getSearchByAct(est_code: string,case_type : string , reg_no : string , reg_year: string): Observable<any> {
    const body = {
      est_code: est_code,
      case_type:case_type,
      reg_no:reg_no,
      reg_year:reg_year
    };
    return this.http.post<any>(this.apiSearchByActUrl, body)
    .pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
    
  }

  getSearchByCaseNumber(est_code: string,case_type : string , reg_no : string , reg_year: string): Observable<any> {
    const body = {
      est_code: est_code,
      case_type:case_type,
      reg_no:reg_no,
      reg_year:reg_year
    };
    return this.http.post<any>(this.apiSearchByCaseNumberUrl, body)
    .pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }


  getSSearchByFilingNumber(est_code: string,case_type : string , reg_no : string , reg_year: string): Observable<any> {
    const body = {
      est_code: est_code,
      case_type:case_type,
      reg_no:reg_no,
      reg_year:reg_year
    };
    return this.http.post<any>(this.apiSearchByFilingNumberUrl, body)
    .pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
    
  }


  getSearchByPartyName(est_code: string,pend_disp : string , litigant_name : string , reg_year: string): Observable<any> {
    const body = {
      est_code: est_code,
      pend_disp:pend_disp,
      litigant_name:litigant_name,
      reg_year:reg_year
    };
    return this.http.post<any>(this.apiSearchByPartyNameUrl, body)
    .pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getDropDownList(): Observable<DropDownListModel[]> {
    return this.http.post<{ isSuccess: boolean; message: string; data: DropDownListModel[] }>(
      this.apiUrl,
      {},
      { responseType: 'json' }
    ).pipe(
      map(response => response.data)
    );
  }
  

  getSubDropDownList(selectedValue: string): Observable<DropDownListModel[]> {
    const body = {
      caseTypemasterRequestModel: selectedValue
    };
    return this.http.post<DropDownListModel[]>(this.apiCaseTypeUrl, body)
      .pipe(
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }


  getSActDropDownList(): Observable<DropDownListModel[]> {
   
    return this.http.post<DropDownListModel[]>(this.apiActsUrl, {})
      .pipe(
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  GetCaseJudgementTypes(): Observable<DropDownListModel[]> {
    return this.http.post<DropDownListModel[]>(this.apiGetCaseJudgementTypesUrl, {})
      .pipe(
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

}
