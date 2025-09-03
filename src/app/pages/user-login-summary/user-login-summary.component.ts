import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { FslReportServiceService } from '../services/fsl-report-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventService } from '../services/global-event.service';
import { Subscription } from 'rxjs';
import { ForensicComponent } from '../_components/forensic/forensic.component';
import { UtilityService } from '../services/utility.service';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { LoaderService } from '../services/loader.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserloginsummaryService } from '../services/userloginsummary.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-user-login-summary',
  templateUrl: './user-login-summary.component.html',
  styleUrl: './user-login-summary.component.css'
})
export class UserLoginSummaryComponent {
    CountData: any[] = [];
     GetLogDetails: any[] = [];
     MobileNo: string='';
     displayPopup = false;
    constructor(
    private UserloginsummaryService: UserloginsummaryService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private globalEventService: GlobalEventService, private componentFactoryResolver: ComponentFactoryResolver, private utilityService: UtilityService,
    private dyanmicModelService: DynamicModalService, private loaderService: LoaderService, private formBuilder: FormBuilder
  ) {

  }
  @ViewChild('table') table: Table | undefined; 
  ngOnInit(): void {
    this.GetAllDataCount();
  }
  GetAllDataCount() {
    this.loaderService.show();
    this.UserloginsummaryService.GetAllDataCount().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.CountData = JSON.parse(response.data);
          this.cdr.detectChanges();
          this.loaderService.hide();
        }
      }
    );
  }
   onQuickFilter(event: any) {
    const filterValue = event.target.value.toLowerCase();
    this.GetAllDataCount();
   }
   loadLazyLoadReports(event: TableLazyLoadEvent) {
     this.UserloginsummaryService.GetAllDataCount().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.CountData = response.data;
          this.cdr.detectChanges();
          this.loaderService.hide();
        }
      }
    );
     }
     
LogDetails(MobileNumber: any): void {
  this.table?.reset(); 
  this.loaderService.show();
  this.MobileNo = MobileNumber?.toString() ?? '';
  this.UserloginsummaryService.DetailsLog(this.MobileNo).subscribe({
    next: (response: any) => {
      if (response?.isSuccess) {
        this.GetLogDetails =  JSON.parse(response.data);
         this.displayPopup = true; 
         this.loaderService.hide();
      }
      this.loaderService.hide();
    },
    error: (error: any) => {
      console.error('Error fetching log details:', error);
      this.loaderService.hide();
    }
  });
}

}
