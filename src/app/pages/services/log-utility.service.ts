import { Injectable } from '@angular/core';
import { LogService } from './log.service';  // Assuming LogService is already created
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})


@Injectable({
  providedIn: 'root'
})
export class LogUtilityService {

  constructor(

    private logService: LogService, 
    private datePipe: DatePipe  
  ) { }


  logSearchAction(
    officeCodesString: any,
    openingDate: any,
    closingDate: any,
    action: any ,
    description: any 
  ): void {
    const logData = {
      mobileNumber: officeCodesString,
      openingDate: openingDate ? this.datePipe.transform(openingDate, 'yyyy-MM-dd') : null,
      closingDate: closingDate ? this.datePipe.transform(closingDate, 'yyyy-MM-dd') : null,
      linkedStatus: null,  
      action: action,      
      description: description
    };

    this.logService.saveActivityLog(logData).subscribe(
      () => {
        console.log('Activity log saved successfully.');
      },
      (error: any) => {
        console.error('Error saving activity log:', error);
      }
    );
  }
}
