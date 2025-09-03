import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatingService {

  constructor(private datePipe: DatePipe) { }

  formatISODateTime(value: string) {
    const date = new Date(value);
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm');  // Format: DD/MM/YYYY HH:mm
  };

  getYearFromDate(value: string) {
    const [day, month, year] = value.split('/');
    if (year && month && day) {
      return year;  // Extract year from DD/MM/YYYY
    } else {
      throw new Error('Invalid date format. Please use DD/MM/YYYY');
    }
  };
}
