import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MedleprService } from '../services/medlepr.service';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { UtilityService } from '../services/utility.service';
import { MedleprComponent } from '../_components/medlepr/medlepr.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DateFormatingService } from '../services/date-formating.service';

@Component({
  selector: 'app-medlepar',
  templateUrl: './medlepar.component.html',
  styleUrl: './medlepar.component.css'
})
export class MedleparComponent {
  fromDate: string = '';
  toDate: string = '';
  selectedFullDispNo: string = '';
  data: any[] = [];
  dataFilter:any[] = [];

  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  dynamicContainer!: ViewContainerRef;

  constructor(private medleprService: MedleprService, private cdr: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver, private utilityService: UtilityService,
    private dyanmicModelService: DynamicModalService, private modalService: NgbModal,
    private datePipe: DatePipe, public dateFormatingService: DateFormatingService){

      //For last 30 days
      const toDate = new Date();
      var fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      this.fromDate = fromDate.toISOString().split('T')[0];
      this.toDate = toDate.toISOString().split('T')[0];
      this.onSearch();
    }

     openDyanmicModel(value:any)
     {
          this.dyanmicModelService.open(MedleprComponent, value);
     }

    private componentRef!: ComponentRef<MedleprComponent>;
    loadOtherComponent(transactionNumber: any): void {
      this.utilityService.LoadMedleprInformation({transactionNumber: transactionNumber}).subscribe((response)=>{
        if(response.isSuccess){
          const data = JSON.parse(response.data);
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MedleprComponent);
          this.dynamicContainer.clear();
          this.componentRef = this.dynamicContainer.createComponent(componentFactory);
          // Pass the parameter to the dynamically loaded component
          this.componentRef.instance.loadMedleprInfo(data);
          this.modalService.open("content", { ariaLabelledBy: 'modal-basic-title' });
        }
        else{
          this.utilityService.ShowErrorPopup(response.message);
        }
      });
      
    }

    onReset() {
      this.fromDate = '';
      this.toDate = '';
      this.data = [];
      this.cdr.detectChanges();
    }

    onQuickFilter(event: any): void {  
      const filterValue = event.target.value;
      if(filterValue =='')
      {
        this.data = this.dataFilter;
      }
      this.data  = this.dataFilter.filter((obj) => {
        return Object.values(obj).some((val) =>
          String(val).toLowerCase().includes(filterValue.toLowerCase())
        );
      });
      this.cdr.detectChanges();
  }
  
    onSearch() {
      if (!this.fromDate || !this.toDate) {
        return;
      }
          const requestPayload = {
            fromDate: this.fromDate,
            toDate: this.toDate,
          };
  
          this.medleprService.LoadMedlprData(requestPayload).subscribe(
            (response: any) => {
              if (response.isSuccess) {
                this.data = JSON.parse(response.data);
                this.dataFilter = JSON.parse(response.data);
                this.cdr.detectChanges();
        
             }});
    }
  
}
