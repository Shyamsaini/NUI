import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private zone: NgZone) {}

  show() {
    this.zone.run(() => this.loadingSubject.next(true));
  }

  hide() {
    this.zone.run(() => this.loadingSubject.next(false));
  }
}
