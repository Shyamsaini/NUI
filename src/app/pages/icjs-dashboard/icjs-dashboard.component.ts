import { Component ,OnInit,ChangeDetectorRef, ElementRef, Renderer2,ViewChild} from '@angular/core';
import { IcjsDeshboardService } from '../services/icjs-deshboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../services/modal.service';
import { UtilityService } from '../services/utility.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CourtComponent } from '../_components/court/court.component';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subscription } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { Table } from 'primeng/table';
interface PsCodeOption {
  text: string;
  value: string;
}
@Component({
  selector: 'app-icjs-dashboard',
  templateUrl: './icjs-dashboard.component.html',
  styleUrl: './icjs-dashboard.component.css'
})

export class IcjsDashboardComponent implements OnInit {
  policestation: string =""; 
  lbltype: string = ''; 
  fromDate: string = '';
  toDate: string =""; 
  type: string = '';
  policestationcode: string='';
  pageNumber: number = 0; 
  pageSize: number = 0; 
  searchTerm: string='';
  isCourtCaseListTable: boolean = true;
  isCourtCaseDetailTable: boolean = false;
  policestations: any[] = [];
  Districts: any[] = [];
  isSubmitted = false;
  BackPage: boolean = false;
  loading: boolean = false;
  currentFirst: number = 1; // First record number on the current page
  currentLast: number = 10;
  FilteredRecordsCount:number = 0;
  DetailscourtCasesTotal: number = 0;
  settings = {};
  policeStationsCodes : any[] = [];
  DistictCodes : any[] = [];
  selectedDistrictNames: string[] = [];
  selectedPoliceStations: string[] = [];
  states: any;
  openCourtComponent(cino: string) {
    this.dynamicModelService.open(CourtComponent, cino);
  }
  
ConsDate:string = "";
  courtCasesData:any;
  DetailscourtCasesData:any;
  constructor(private icjsDeshboardService: IcjsDeshboardService,private cdr: ChangeDetectorRef, private el: ElementRef,private renderer: Renderer2
  ,protected  modalService: ModalService,private utilityService: UtilityService, private formBuilder: FormBuilder, private dynamicModelService: DynamicModalService
,private loaderService: LoaderService) {  
  }
   @ViewChild('table') table: Table | undefined; 
  ngOnInit(): void {
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
    this.states = localStorage.getItem('selectedStateName');
    this.form = this.formBuilder.group(
      {
        district: [''], 
        psCode: [''],
        FromDate: [''],
        ToDate: ['']
      }
    );
    this.district();
    this.loadCounts();
  }
loadCounts(){
  const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value || [];
    const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
    this.policeStationsCodes = psCodeValues;
     const distCodeArray: PsCodeOption[] = this.form.controls["district"].value || [];
    const distCodeValues = distCodeArray.length > 0 ? distCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
    this.DistictCodes = distCodeValues;
     this.setValueCase(this.DistictCodes,this.policeStationsCodes,this.form.controls["FromDate"].value,this.form.controls["ToDate"].value);
  }
CourtCasesDetails(ongoing: string,pscode:any): any {
  this.table?.reset();
  this.loaderService.show();
    const policestation = "";
    const fromDate = "";
    const toDate = "";  
    this.type = ongoing; 
    this.policestationcode = pscode.toString();
    const pageNumber = this.currentFirst;  
    const pageSize = this.currentLast;  
    const searchTerm = ""; 
    this.ConsDate="";
    this.icjsDeshboardService.getCourtCasesDetails(policestation, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value, this.type, this.policestationcode,pageNumber,pageSize, searchTerm)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.DetailscourtCasesData = response.data.records;
            this.DetailscourtCasesTotal = response.data.totalRecords;
             this.FilteredRecordsCount =  response.data.filteredRecords;
            this.isCourtCaseListTable = false;
            this.isCourtCaseDetailTable = true;
             this.BackPage = true;
              if (pscode == '') {
              this.lbltype = "";
               this.loaderService.hide();
            }
            else
            {
              this.loaderService.hide();
              this.lbltype = response.data.records[0].PoliceStnName;
            }       
           this.ConsDate =   response.data.consDate;
            this.loaderService.hide();
          }
           
        },
        
      );
}
loadReports(event: TableLazyLoadEvent) {
    const pagesize = event.rows ?? 10;  
    const first = event.first ?? 0;    
    const policestation = "";
    const fromDate = "";
    const toDate = "";  
    const type = this.type; 
    const policestationcode =this.policestationcode
    const pageNumber =  Math.floor(first / pagesize) + 1; 
    const pageSize = pagesize;  
    const searchTerm = ""; 
     this.currentFirst = first + 1;
     this.currentLast = first + pageSize > this.FilteredRecordsCount ? this.FilteredRecordsCount : first + pageSize;
     this.icjsDeshboardService.getCourtCasesDetails(policestation, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value, type, policestationcode,pageNumber,pageSize, searchTerm).subscribe(
       (response: any) => {

         if (response.isSuccess) {
           this.DetailscourtCasesData = response.data.records;
            this.DetailscourtCasesTotal = response.data.totalRecords;
             this.FilteredRecordsCount =  response.data.filteredRecords;
             this.ConsDate =   response.data.consDate;
         }

         this.loading = false;
         this.cdr.detectChanges();
       },
       () => (this.loading = false)
     );
  }

  setValueCase(DistictCodes :any ,psCode: any, fromDate: string, toDate: string):any {
    this.loaderService.show();
    const pageNumber = this.currentFirst;  
    const pageSize = this.currentLast;  
    const searchTerm = "";
    const type = ""; 
    const policestationcode = "";
    this.ConsDate = "";
    
    this.icjsDeshboardService.getCourtCases(DistictCodes,psCode, fromDate, toDate).subscribe(
      response => {
        if (response.isSuccess) {
          this.courtCasesData = JSON.parse(response.data);
           var totalongoing = 0;
           var totalDisposed = 0;
           var totalToday = 0;
           var totalThisWeek = 0; 

           
         this.courtCasesData.forEach((item: any, index: number) => {
          if (index === this.courtCasesData.length - 1) {
            return;
          }

          totalongoing += item.ongoing;
          totalDisposed += item.disposed;
          totalToday += item.today;
          totalThisWeek += item.next7days;
        });

          //  this.courtCasesData.forEach((item: any) => {
          //        totalongoing +=  item.ongoing;
          //        totalDisposed +=  item.disposed;
          //        totalToday +=  item.today;
          //        totalThisWeek +=  item.next7days;
          //  });


        
          this.renderer.setProperty(this.el.nativeElement.querySelector('#totalOnGoing'), 'textContent', totalongoing);
          this.renderer.setProperty(this.el.nativeElement.querySelector('#listedToday'), 'textContent', totalToday);
          this.renderer.setProperty(this.el.nativeElement.querySelector('#listedThisWeek'), 'textContent', totalThisWeek);
          this.renderer.setProperty(this.el.nativeElement.querySelector('#totalDisposed'), 'textContent', totalDisposed);

         //Date 
         var ConsDateDate = JSON.parse(response.consDate);
         this.ConsDate =  ConsDateDate.ConsDate;
         
         this.loaderService.hide();
        }
         else {
          console.log('API false response1:', response);
          this.loaderService.hide();
        }
      },
      (error: HttpErrorResponse) => {
        console.error('API error:', error);
        this.loaderService.hide();
      }
    );
  }

  onGridReady(params:any) {
   
  }

  onQuickFilter(event: any) {
    
  }
   lnkbackClick() {
     this.isCourtCaseListTable = true;
     this.isCourtCaseDetailTable = false;
     this.BackPage = false;
    this.cdr.detectChanges();
  }
  loadPoliceStations(){
    this.utilityService.PoliceStationList().subscribe((data: any[]) => {
      this.policestations = data;
    });
  }

// district(){
//     this.utilityService.Districts().subscribe((data) => {
//       if(data.isSuccess){
//         this.Districts = data.data;
//       }
//     });
//   }

 district(): void {
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


   get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
    form:FormGroup = new FormGroup({
  });
  
   onSubmit(): void {
     this.isCourtCaseListTable = true;
     this.isCourtCaseDetailTable = false;
     this.BackPage = false;
     this.isSubmitted = true;

    const formValues = this.form.getRawValue();
    // this.selectedDistrictNames = formValues.district.map((item: any) => item.text);
    //  this.selectedPoliceStations = formValues.psCode.map((item: any) => item.text);

      this.selectedDistrictNames = Array.isArray(formValues.district) && formValues.district.length > 0? formValues.district.map((item: any) => item.text): [];
      this.selectedPoliceStations = Array.isArray(formValues.psCode) && formValues.psCode.length > 0? formValues.psCode.map((item: any) => item.text): [];


       this.loadCounts();
  }


readMoreDistricts: boolean = false;
get trimmedDistrictNames(): string { 
  const names = this.selectedDistrictNames.join(', ');
  if (!names) return '';
  return this.readMoreDistricts? names: names.length > 100? names.slice(0, 100) + '...' : names;
}
toggleReadMoreDistricts() {
  this.readMoreDistricts = !this.readMoreDistricts;
}

get trimmedPoliceStations(): string {
  const stations = this.selectedPoliceStations.join(', ');
  if (!stations) return '';
  return this.readMore? stations : stations.length > 100? stations.slice(0, 100) + '...': stations;
}
readMore: boolean = false;
   onPsSelect(item: any) {
   const selectedItems = this.form.get('psCode')?.value || [];
  this.selectedPoliceStations = selectedItems.map((ps: any) => ps.text);
}
toggleReadMore() {
  this.readMore = !this.readMore;
}
totalDetails(event: MouseEvent, type: string) {
    event.preventDefault();  
    switch (type) {
      case 'ongoing':
        if (this.form.controls["psCode"].value === '') {
            this.CourtCasesDetails("ongoing","")
        }
        else {
           const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value || [];
           const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
           this.policeStationsCodes = psCodeValues;
          this.CourtCasesDetails("ongoing", this.policeStationsCodes);
          }
        break;
      case 'today':
        if (this.form.controls["psCode"].value === '') {
                    this.CourtCasesDetails("today","")
        }
        else {
          const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value || [];
           const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
           this.policeStationsCodes = psCodeValues;
          this.CourtCasesDetails("today", this.policeStationsCodes);
          }
        break;
      case 'nextsevendays':
      if (this.form.controls["psCode"].value === '') {
                 this.CourtCasesDetails("nextsevendays","")
        }
        else {
          const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value || [];
           const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
           this.policeStationsCodes = psCodeValues;
          this.CourtCasesDetails("nextsevendays", this.policeStationsCodes);
          }
         
        break;
      case 'disposed':
      if (this.form.controls["psCode"].value === '') {
                  this.CourtCasesDetails("disposed","")
        }
        else {
          const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value || [];
           const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
           this.policeStationsCodes = psCodeValues;
          this.CourtCasesDetails("disposed", this.policeStationsCodes);
          }
        break;
      default:
        console.log('Unknown type clicked!');
        break;
    }
  }

    loadCourtCasesReports(event: TableLazyLoadEvent) {
    this.loading = true;
    const pageSize = event.rows ?? 10;  
    const first = event.first ?? 0;    
    const pageNumber = Math.floor(first / pageSize) + 1; 
    const psCOde = this.form.controls["psCode"].value;
    const FromDate = this.form.controls["FromDate"].value;
    const  ToDate   = this.form.controls["ToDate"].value;
    this.currentFirst = first + 1;
    this.currentLast = first + pageSize > this.FilteredRecordsCount ? this.FilteredRecordsCount : first + pageSize;
     this.icjsDeshboardService.getCourtCasesDetails(psCOde, FromDate, ToDate, this.type, psCOde,pageNumber,pageSize, this.searchTerm)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.DetailscourtCasesData = response.data.records;
            this.isCourtCaseListTable = false;
            this.isCourtCaseDetailTable = true;
             this.BackPage = true;
             this.lbltype = response.data.records[0].PoliceStnName;
             this.cdr.detectChanges();
             this.FilteredRecordsCount =  response.data.total;
          }
           else 
           {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
  }

 onQuickFilterCaseDetails(event: any) {

    const filterValue = event.target.value.toLowerCase();
    if (filterValue.length >= 3) {
    this.searchTerm = filterValue;
    const policestation = "";
    const fromDate = "";
    const toDate = "";  
    const type = "ongoing"; 
    const policestationcode = '';
    const pageNumber = 1;  
    const pageSize = 10;  
    const searchTerm = ""; 
    this.icjsDeshboardService.getCourtCasesDetails(policestation, fromDate, toDate, type, policestationcode,pageNumber,pageSize, this.searchTerm)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.DetailscourtCasesData = response.data.records;
            this.DetailscourtCasesTotal = response.data.totalRecords;
             this.FilteredRecordsCount =  response.data.filteredRecordsCount;
            this.isCourtCaseListTable = false;
            this.isCourtCaseDetailTable = true;
             this.BackPage = true;
             this.lbltype = response.data.records[0].PoliceStnName;
             this.loadPoliceStations();
             this.cdr.detectChanges();
          }
           else 
           {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
    } 
    else if(filterValue == '') {
      this.searchTerm = '';
      const policestation = "";
    const fromDate = "";
    const toDate = "";  
    this.type = "ongoing"; 
    this.policestationcode ='';
    const pageNumber =1;  
    const pageSize = 10;  
    const searchTerm = ""; 
    this.icjsDeshboardService.getCourtCasesDetails(policestation, fromDate, toDate, this.type, this.policestationcode,pageNumber,pageSize, this.searchTerm )
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.DetailscourtCasesData = response.data.records;
            this.DetailscourtCasesTotal = response.data.totalRecords;
            this.isCourtCaseListTable = false;
            this.isCourtCaseDetailTable = true;
             this.BackPage = true;
             this.lbltype = response.data.records[0].PoliceStnName;
             //this.cdr.detectChanges();
          }
           else 
           {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
    }
  }

  onReset() {
    
     this.form.controls["district"].setValue('');
    this.form.controls["FromDate"].setValue('');
    this.form.controls["ToDate"].setValue('');
    this.form.controls["psCode"].setValue('');
     this.selectedPoliceStations = [];
      this.selectedDistrictNames = [];
    this.fromDate='',
     this.toDate=''
     this.loadCounts();
    //this.LoadDataForCount();
     this.cdr.detectChanges();
    
  }


}
  
  

 