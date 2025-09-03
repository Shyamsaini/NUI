import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentChildService {
  private parentFunctionSubject = new Subject<void>();
  parentFunction$ = this.parentFunctionSubject.asObservable();

  callParentFunction() {
    this.parentFunctionSubject.next();
  }
}
