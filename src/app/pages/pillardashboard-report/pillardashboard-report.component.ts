import { Component,OnInit,ChangeDetectorRef, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PillardashboardService } from '../services/pillardashboard.service';
import { ModalService } from '../services/modal.service';
import { UtilityService } from '../services/utility.service';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { TotalFirService } from '../services/total-fir.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';
import { ProsecutionComponent } from '../_components/prosecution/prosecution.component';
import { MedleprComponent } from '../_components/medlepr/medlepr.component';
import { DatePipe } from '@angular/common';
import { DateFormatingService } from '../services/date-formating.service';
import { parse } from 'path';
import { ForensicComponent } from '../_components/forensic/forensic.component';
import { encapsulateStyle } from '@angular/compiler';
import { LoaderService } from '../services/loader.service';
import Swal from 'sweetalert2';
interface PsCodeOption {
  text: string;
  value: string;
}
@Component({
  selector: 'app-pillardashboard-report',
  templateUrl: './pillardashboard-report.component.html',
  styleUrl: './pillardashboard-report.component.css',
  providers: [DatePipe]
})

export class PillardashboardReportComponent {
  PillarData:any;
  isProsdataLoaded = false;
  isPillersLoaded=true;
  isMlrPmrInfoDetailsVisible=false;
  ProsdataListVisible=false;
  FsldataListVisible=false;
  MlrdataListVisible=false;
  PmrdataListVisible=false;
  isParticularDetailsLoaded=false;

  isParticularProsDetailsLoaded=false;
  isParticularFSLDetailsLoaded=false;
  isParticularMLRDetailsLoaded=false;
  isParticularPMRDetailsLoaded=false;
  displayPopup = false;
  totalProsecutionCount: number = 0;
  totalFSLCount: number = 0;
  totalMLCCount: number = 0;
  totalPMRCount: number = 0;
  Prosdata: any = [];
  Mlrdata: any = [];
  Pmrdata: any = [];
  Fsldata: any = [];
  Particulardata: any = [];
  FirFirNum = 0;
    settings = {};
     Districts: any[] = [];
     policestations: any[] = [];
       policeStationsCodes : any[] = [];
       DistictCodes : any[] = [];
  columns1: any[] = [
    { field: 'firRegNum', header: 'Fir Number' },
    { field: 'psCode', header: 'PS' },
    { field: 'legalOpinionDate', header: 'LegalOpinionDate' }
  ];
  columns:any[] = [
    { field: 'SNO', header: 'S.No' },
    { field: 'StateDesc', header: 'State' },
    { field: 'DistDesc', header: 'District' },
    { field: 'PsDesc', header: 'Police Station' },
    { field: 'FirNo', header: 'FIR No.' },  
    { field: 'EnteredOn', header: ' Sample Received Date' },
    { field: 'FullDispNo', header: 'Download Report' },
  ];
  
   ngOnInit(): void {
    debugger
    this.settings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      enableCheckAll: true,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    this.form = this.formBuilder.group(
      {
        district: [''], 
        psCode: [''],
        FromDate: [null],
        ToDate: [null]
      }
    );
    this.GetDistrict();
   this.GetPillarDataList();
  
  }
   constructor(private PillardashboardService: PillardashboardService,private cdr: ChangeDetectorRef, private el: ElementRef,private renderer: Renderer2
  ,protected  modalService: ModalService,private utilityService: UtilityService, private formBuilder: FormBuilder,public dateFormatingService: DateFormatingService,
   private dynamicModelService: DynamicModalService,private datePipe: DatePipe,private loaderService: LoaderService)
   {
    
  }

   @ViewChild('table') table: Table | undefined; 
  public loadProsLinkedData(policeCode: any) {  
    this.loaderService.show();
    this.Particulardata = [];
    const fdate = this.form.controls["FromDate"].value||null;
    const tdate = this.form.controls["ToDate"].value||null; 
    this.PillardashboardService.SearchProsDetails(fdate,tdate,policeCode).subscribe((response : any) => {    
     
      //this.isProsdataLoaded = true;   
      this.isPillersLoaded =true;
      this.displayPopup = true;

             setTimeout(() => {
                this.table?.reset(); // Reset paginator to first page
              });
      this.ProsdataListVisible=true;
      this.FsldataListVisible=false;
      this.MlrdataListVisible=false;
      this.PmrdataListVisible=false;
      this.isParticularDetailsLoaded=false;
      if (response.isSuccess) {
        try {         
          const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data; 
          if (parsedData && Array.isArray(parsedData)) {
            this.Prosdata = parsedData; 
            this.loaderService.hide();
          } else {
            this.Prosdata = [];
            console.warn("No FSL data found.");
            this.loaderService.hide();
          }
        } catch (e) {
          console.error("Error parsing response data:", e);
          this.Prosdata = [];
          this.loaderService.hide();
        }        
      } else {
        this.utilityService.ShowErrorPopup(response.message || "Failed to fetch Pros data.");
        this.loaderService.hide();
      }
    },
    (error: HttpErrorResponse) => {       
      console.error("API error:", error);
      this.utilityService.ShowErrorPopup("An error occurred while fetching Pros data.");
         this.loaderService.hide();
    });
  }
     GetDistrict(): void {
    this.utilityService.LoadDistricts().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          this.Districts = response.data;
        } else {
          this.Districts = [];
        }
      },
      error: (err) => {
        console.error('Error fetching Nyaay Shuruti data:', err);

      },
    });
  }


    onDistrictChange(event: any) {
    var formValues = this.form.getRawValue();
    var districtCodes = formValues.district.map((item: { value: any; }) => parseInt(item.value));
    this.policestations = [];
    if (districtCodes.length > 0) {
       // this.icjsDeshboardService.LoadPoliceStations(districtCodes).subscribe((data: any) => {
         this.utilityService.LoadPoliceStationsList(districtCodes).subscribe((data: any) => {
          if (data.isSuccess) {
            this.policestations = data.data;
          }
          this.cdr.detectChanges();
        });
    }
    this.cdr.detectChanges();
  }
  // GetDistrict(){
  //   this.utilityService.Districts().subscribe((data) => {
  //     if(data.isSuccess){
  //       this.Districts = data.data;
  //     }
  //   });
  // }
  
  //   onDistrictChange(event: any) {
  //   var formValues = this.form.getRawValue();
  //   var districtCodes = formValues.district.map((item: { value: any; }) => parseInt(item.value));
  //   this.policestations = [];
  //   if (districtCodes.length > 0) {
  //       this.PillardashboardService.LoadPoliceStations(districtCodes).subscribe((data: any) => {
  //         if (data.isSuccess) {
  //           this.policestations = data.data;
  //         }
  //         this.cdr.detectChanges();
  //       });
  //   }
  //   this.cdr.detectChanges();
  // }
  public loadFslLinkedData(policeCode: any) {
    this.loaderService.show();
    this.Particulardata = [];
    setTimeout(() => {
      this.table?.reset(); // Reset paginator to first page
    });
 
    const fdate = this.form.controls["FromDate"].value || null;
    const tdate = this.form.controls["ToDate"].value || null;    
    this.PillardashboardService.SearchFSL_Details(fdate, tdate, policeCode).subscribe(
      (response: any) => {
        
        this.isPillersLoaded = true;
        this.displayPopup = true;  
       this.FsldataListVisible=true;
       this.MlrdataListVisible=false;
       this.PmrdataListVisible=false;  
       this.ProsdataListVisible=false;   
       this.isParticularFSLDetailsLoaded=false; 
        if (response.isSuccess) {
          try {      
               
            const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;  
              if (parsedData && Array.isArray(parsedData)) {
              this.Fsldata = parsedData;  
              this.loaderService.hide();            
            }
             else {
              this.Fsldata = []; 
              console.warn("No FSL data found.");
              this.loaderService.hide();
            }
          } 
          catch (e) {
            console.error("Error parsing response data:", e);
            this.Fsldata = []; 
            this.loaderService.hide();
          }
        } else {          
          this.utilityService.ShowErrorPopup(response.message || "Failed to fetch FSL data.");
          this.loaderService.hide();
        }
      },
      (error: HttpErrorResponse) => {       
        console.error("API error:", error);
        this.utilityService.ShowErrorPopup("An error occurred while fetching FSL data.");
        this.loaderService.hide();
      }
    );
  }   
  public loadMlrLinkedData(policeCode: any) {   
    setTimeout(() => {
      this.table?.reset(); // Reset paginator to first page
    });
    this.Particulardata = [];
    const fdate = this.form.controls["FromDate"].value||  null;
    const tdate = this.form.controls["ToDate"].value||  null; 
    this.PillardashboardService.SearchMlrDetails(fdate,tdate,policeCode).subscribe((response : any) => {   
      
      //this.isProsdataLoaded = true;   
      this.isPillersLoaded =true; 
      this.displayPopup = true;  
      this.MlrdataListVisible=true;         
       this.PmrdataListVisible=false;
       this.FsldataListVisible=false;
       this.ProsdataListVisible=false;  
       this.isParticularMLRDetailsLoaded=false;
      if (response.isSuccess) {
        try {         
          const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data; 
          if (parsedData && Array.isArray(parsedData)) {
            this.Mlrdata = parsedData; 
          } else {
            this.Mlrdata = [];
            console.warn("No MLR data found.");
          }
        } catch (e) {
          console.error("Error parsing response data:", e);
          this.Mlrdata = [];
        }
       
      } else {
        this.utilityService.ShowErrorPopup(response.message || "Failed to fetch MLR data.");
      }
    },
    (error: HttpErrorResponse) => {
      console.error("API error:", error);
        this.utilityService.ShowErrorPopup("An error occurred while fetching MLR data.");
    });
  }
  public loadPmrLinkedData(policeCode: any) {
    debugger
    setTimeout(() => {
      this.table?.reset(); // Reset paginator to first page
    });
    this.Particulardata = [];
    const fdate = this.form.controls["FromDate"].value|| null;
    const tdate = this.form.controls["ToDate"].value|| null; 
    this.PillardashboardService.SearchPmrrDetails(fdate,tdate,policeCode).subscribe((response : any) => {   
       debugger
      this.isPillersLoaded =true;  
      //this.isProsdataLoaded = true;   
      this.displayPopup = true;
      this.isParticularPMRDetailsLoaded=false;
      this.PmrdataListVisible=true;       
       this.MlrdataListVisible=false;     
       this.FsldataListVisible=false; 
       this.ProsdataListVisible=false;   
      if (response.isSuccess) {
        debugger
        try {        
          const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
          if (parsedData && Array.isArray(parsedData)) {
            this.Pmrdata = parsedData; 
          } 
          else {
            this.Pmrdata = [];
             Swal.fire({
                        position: 'center',
                        title: "No PMR data found.",
                        showConfirmButton: false,
                        timer: 2000,
                        icon: 'warning',
                        background: '#fff3cd',
                        color: '#000000',
                      });
           
          }
        } 
        catch (e) {
          console.error("Error parsing response data:", e);
          this.Pmrdata = [];
        }        
      } 
      else {
        this.utilityService.ShowErrorPopup(response.message || "Failed to fetch PMR data.");
      }
    },
    (error: HttpErrorResponse) => {
      console.error('API error:', error);
      this.utilityService.ShowErrorPopup("An error occurred while fetching MLR data.");
    });
  }
  public loadProsLinkedDataByRegNo(RegNum: any): void {
    debugger
     this.loaderService.show();
    this.Particulardata = []; 
    this.PillardashboardService.LoadOtherPillars({firNumber:RegNum}).subscribe(
      (response: any) => {
        debugger
        
        const responseData = response;
        if (responseData.isSuccess) {
          const data = responseData.data;
          this.loaderService.hide();
          if(data?.prosecutionids.length == 0){
            this.utilityService.ShowErrorPopup("Prosecution request is not submitted yet");
             this.loaderService.hide();
          }
          else{       
            var ProsecutionComponentdata = {
              prosecutionId : data.prosecutionids[0],
              psCode: data.psCode
            
            };
            // this.dynamicModelService.open(ProsecutionComponent, data1?.prosecutionids[0]);
            this.dynamicModelService.open(ProsecutionComponent, ProsecutionComponentdata);
              this.loaderService.hide();
          }
        }
      });
    }
    openModalWithDispNo(fulldispno: string): void {
      debugger
     // this.selectedFullDispNo = fulldispno;
     // this.open(content, this.selectedFullDispNo);
    var data = {
      fulldispno : fulldispno
    };
     this.dynamicModelService.open(ForensicComponent,data);
    }
  toggleMore(item: any): void {
    item.isExpanded = !item.isExpanded; // Toggle the "More/Less" state
  }
  
  //Fsl
  public loadFslLinkedDataByRegNo(RegNum: any,FirFirNum: any ): void {
    debugger
    this.FirFirNum=FirFirNum;
    debugger
    this.loaderService.show();
    this.Particulardata = null;
    this.PillardashboardService.SearchFslLinkedData(RegNum).subscribe(
      (response: any) => {
        debugger
        const responseData = response;
        if (responseData.isSuccess) {
          
           const Particulardata = typeof responseData.data === 'string' ? JSON.parse(responseData.data) : responseData.data;  
          // if (parsedData && Array.isArray(parsedData)) {

          if (Array.isArray(Particulardata) && Particulardata.length > 0) {
            
            this.Particulardata =Particulardata; 
            this.isParticularDetailsLoaded=true;

            this.isParticularProsDetailsLoaded=false; 
            this.isParticularMLRDetailsLoaded=false;
            this.isParticularPMRDetailsLoaded=false;
            this.isParticularFSLDetailsLoaded = true;
            this.ProsdataListVisible=false;
            this.FsldataListVisible=true;
            this.cdr.detectChanges();
            this.displayPopup = true;
            this.loaderService.hide();
          } else {
            this.Particulardata = null;
                  Swal.fire({
                        position: 'center',
                        title: "No PMR data found.",
                        showConfirmButton: false,
                        timer: 2000,
                        icon: 'warning',
                        background: '#fff3cd',
                        color: '#000000',
                      });
           
          }
        } else {
          console.error('Error:', responseData.message);
          this.loaderService.hide();
        }
      },
      (error) => {
        console.error('Error loading data:', error);
        this.loaderService.hide();
      }
    );
  }
  //Pmr
  public loadPmrLinkedDataByRegNo(rowData: any): void {
    this.loaderService.show();
    this.Particulardata = null;
    this.PillardashboardService.SearchMlrLinkedData(rowData).subscribe(
      (response: any) => {
        debugger
        const responseData = response;
        if (responseData.isSuccess) {
         this.loaderService.hide();
          const Particulardata = JSON.parse(responseData.data);
          if (Particulardata.length > 0) {
            this.Particulardata = Particulardata; 
            this.isParticularDetailsLoaded = false;
            this.isParticularFSLDetailsLoaded = false;
            this.isParticularProsDetailsLoaded=false; 
            this.isParticularMLRDetailsLoaded=false;
            this.isParticularPMRDetailsLoaded=true;
            this.ProsdataListVisible=false;
            this.displayPopup = true;
            this.PmrdataListVisible=true;

          } else {
            this.Particulardata = null;
            console.warn('No data available.');
          }
        } else {
          console.error('Error:', responseData.message);
          this.loaderService.hide();
        }
      },
      (error) => {
        console.error('Error loading data:', error);
        this.loaderService.hide();
      }
    );
  }
  //Mlr
  
   public loadMlrLinkedDataByRegNo(rowData: any): void {
     this.loaderService.show();
    this.Particulardata = null;
    this.PillardashboardService.SearchMlrLinkedData(rowData).subscribe(
      (response: any) => {
        debugger
        const responseData =response;
        if (responseData.isSuccess) {
           this.loaderService.hide();
          const Particulardata =JSON.parse(responseData.data);
          if (Particulardata.length > 0) {
            this.Particulardata = Particulardata; 
            this.isParticularDetailsLoaded = true;
            
            this.isParticularFSLDetailsLoaded = false;
            this.isParticularProsDetailsLoaded=false;         
            this.isParticularPMRDetailsLoaded=false;
            this.isParticularMLRDetailsLoaded=true;

            this.ProsdataListVisible=false;
            this.displayPopup = true;
            this.MlrdataListVisible=true;
            this.cdr.detectChanges();

          }
           else {
            this.Particulardata = null;
                 Swal.fire({
                       position: 'center',
                       title: "No data available",
                       showConfirmButton: false,
                       timer: 2000,
                       icon: 'warning',
                       background: '#fff3cd',
                       color: '#000000',
                     });
           
          }
        } else {
          console.error('Error:', responseData.message);
           this.loaderService.hide();
        }
      },
      (error) => {
        console.error('Error loading data:', error);
         this.loaderService.hide();
      }
    );
  }
  
  openDyanmicModel(value:any)
  {
       this.dynamicModelService.open(MedleprComponent, value);
  }

  public onClose(): void {
    console.log('Dialog close button clicked');
  }


  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }  
    

  // get fromDate(): string {
  //   return this.form.get('FromDate')?.value || 'N/A';
  // }
  // get toDate(): string {
  //   return this.form.get('ToDate')?.value || 'N/A';
  // }
  
  // get fromDate(): string {
  //   return this.form.get('FromDate')?.value ? new Date(this.form.get('FromDate')?.value).toISOString().split('T')[0] : '01-07-2024';
  // }
  
  // get toDate(): string {
  //   return this.form.get('ToDate')?.value ? new Date(this.form.get('ToDate')?.value).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  // }
 

  get fromDate(): string {
    const value = this.form.get('FromDate')?.value;
    return value ? this.formatDateToDDMMYYYY(new Date(value)) : '01-07-2024';
  }
  
  get toDate(): string {
    const value = this.form.get('ToDate')?.value;
    return value ? this.formatDateToDDMMYYYY(new Date(value)) : this.formatDateToDDMMYYYY(new Date());
  }
  
  private formatDateToDDMMYYYY(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  

  GetPillarDataList():any {
    debugger
    this.loaderService.show();
     const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value || [];
    const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
    this.policeStationsCodes = psCodeValues;
     const distCodeArray: PsCodeOption[] = this.form.controls["district"].value || [];
    const distCodeValues = distCodeArray.length > 0 ? distCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
    this.DistictCodes = distCodeValues;
    const fromDate = this.form.controls["FromDate"].value;
    const toDate = this.form.controls["ToDate"].value;
  this.PillardashboardService. GetPillarData(this.DistictCodes,this.policeStationsCodes,fromDate, toDate).subscribe(
    response => {
      if (response.isSuccess) {
        debugger
        this.PillarData =   JSON.parse(response.data); 
        this.loaderService.hide();
      }
       
    },
    (error: HttpErrorResponse) => {
      console.error('API error:', error);
      this.loaderService.hide();
    }
  );
}
  getTotal(column: string): number {
   return this.PillarData.reduce((sum: number, item: any) => sum + (item[column] || 0), 0) || 0;
 }
  form:FormGroup = new FormGroup({
    FromDate: new FormControl(''),
    ToDate: new FormControl('')
  });
  onSubmit(): void {
    
     const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value || [];
    const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
    this.policeStationsCodes = psCodeValues;
     const distCodeArray: PsCodeOption[] = this.form.controls["district"].value || [];
    const distCodeValues = distCodeArray.length > 0 ? distCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
    this.DistictCodes = distCodeValues;
   
     const fromDate = this.form.controls["FromDate"].value;
     const toDate = this.form.controls["ToDate"].value;
       this.PillardashboardService. GetPillarData(this.DistictCodes,this.policeStationsCodes,fromDate, toDate).subscribe(
         response => {
           if (response.isSuccess) {
             this.PillarData =   JSON.parse(response.data); 
           }
         },
         (error: HttpErrorResponse) => {
           console.error('API error:', error);
         }
       );
     }
      
}
