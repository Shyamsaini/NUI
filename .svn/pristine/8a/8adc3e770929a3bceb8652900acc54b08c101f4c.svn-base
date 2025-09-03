import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventService {

  private clickSubject = new Subject<Event>();

  // Observable to allow subscription to click events
  public click$ = this.clickSubject.asObservable();

  constructor() {}

  // Emit a click event
  emitClickEvent(event: Event): void {
    this.clickSubject.next(event);
  }
}
