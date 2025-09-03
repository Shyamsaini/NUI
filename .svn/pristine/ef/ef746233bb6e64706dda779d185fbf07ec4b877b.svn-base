import { DatePipe } from '@angular/common';
import { Injector } from '@angular/core';

// Inject DatePipe using Angular's Injector so that it can be used inside the extension method
const injector = Injector.create({ providers: [{ provide: DatePipe, useClass: DatePipe }] });
const datePipe = injector.get(DatePipe);

declare global {
    interface String {
      getYearFromDate(): string;
      formatISODateTime(): string | null;
    }
  }

  
  
  String.prototype.getYearFromDate = function(): string {
    const [day, month, year] = this.split('/');
    if (year && month && day) {
      return year;  // Extract year from DD/MM/YYYY
    } else {
      throw new Error('Invalid date format. Please use DD/MM/YYYY');
    }
  };

  String.prototype.formatISODateTime = function(): string | null {
    const date = new Date(this.toString());
    return datePipe.transform(date, 'dd/MM/yyyy HH:mm');  // Format: DD/MM/YYYY HH:mm
  };
  
  export {};
  