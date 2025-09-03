import { Component, Renderer2, Inject, ElementRef, ViewChild, OnInit , ChangeDetectorRef} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EsakshyaService } from '../services/dashboard.service';
import { UtilityService } from '../services/utility.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoaded = false;
  isSubmitted = false;
  showEsakshyaGrid = false;
  showNyaayShurutiGrid = false;
  isEsakshyaDataLoaded = false;
  isNyaayShurutiDataLoaded = false;
  isTotaldetails: boolean = false;
  @ViewChild('gridContainer') gridContainer!: ElementRef;
 
  EsakshyaRowData: any[] = [];
  nyaayShurutiRowData: any[] = [];
  CountListRowData:any;
  detailsListRowData:any;
  EsakshyaFilterData: any[] = [];
  nyaayShurutiFilterData: any[] = [];
  errorMessage: string = '';
  TotalPendingFIR = 0;
  TotalType = 0;
  HeinousType: string = '';
  OtherType: string = '';
  Type: string = '';
  lablename:any;
  Cnt:any;

  form:FormGroup = new FormGroup({
    psCode: new FormControl('')
  });

  policestations: any[] = [];
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private esakshyaService: EsakshyaService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        psCode: ['']
      }
    );
    this.renderer.removeAttribute(this.document.body, 'class');
    this.loadEsakshyaData('6', '7/1/2023');
    this.loadNyaayShurutiData(0);
    this.loadDataForCount();
    this.loadPoliceStations();
  }

  // Method to load eSakshya data
  loadEsakshyaData(stateCd: string, fromDate: string): void {
    if (!this.isEsakshyaDataLoaded)
    { 
    }
  }

  loadPoliceStations(){
    this.utilityService.PoliceStationList().subscribe((data: any[]) => {
      this.policestations = data;
    });
  }

  onPoliceStationChange() : void{
    if(this.form.controls['psCode']?.value != ''){
      this.loadNyaayShurutiData(this.form.controls['psCode']?.value)
    }
    else{
      this.nyaayShurutiRowData = [];
    }
  }

  //Method to load Nyaay Shuruti data from the API
  loadNyaayShurutiData(domaintype: number): void {
    this.esakshyaService.getNyaayShurutiData(domaintype).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          this.nyaayShurutiRowData = response.data;
          this.nyaayShurutiFilterData = response.data;
          this.errorMessage = '';
          this.isNyaayShurutiDataLoaded = true;
        } else {
          this.errorMessage = 'No data available for Nyaay Shuruti.';
          this.nyaayShurutiRowData = [];
        }
      },
      error: (err) => {
        console.error('Error fetching Nyaay Shuruti data:', err);
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.nyaayShurutiRowData = [];
      },
    });
}

  loadDataForCount(): void {
   
  }
GetTotalCount(event: MouseEvent) {
    event.preventDefault(); 
    


    var a= this.TotalType;
    this.esakshyaService.getDataTotalDetails(a).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
           this.isTotaldetails = true;
           this.detailsListRowData =  JSON.parse(response.data);
            this.lablename= this.detailsListRowData[0].Label
            this.Cnt= this.detailsListRowData[0].Cnt
          this.errorMessage = '';
        } 
        else {
          this.errorMessage = 'No data available for Nyaay Shuruti.';
          this.detailsListRowData ="";
        }
      },
      error: (err) => {
        console.error('Error fetching Nyaay Shuruti data:', err);
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.detailsListRowData = "";
      },
    });
  }

  onEsakshyaClick(): void {
    this.showEsakshyaGrid = true;
    this.showNyaayShurutiGrid = false;
    this.errorMessage = '';

    if (!this.isEsakshyaDataLoaded) {  // Only load data if not already loaded
      this.loadEsakshyaData('6', '7/1/2023');
    }

    setTimeout(() => {
      this.gridContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }


  // Load Nyaay Shuruti data and show grid
  onNyaayShurutiClick(): void {
    this.showNyaayShurutiGrid = true;
    this.showEsakshyaGrid = false;
    this.errorMessage = '';

    setTimeout(() => {
      this.gridContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  onQuickFilterESakshya(event: any): void {  

      const filterValue = event.target.value;

      if(filterValue =='')
      {
        this.EsakshyaFilterData = this.EsakshyaRowData;
      }
      this.EsakshyaFilterData  = this.EsakshyaRowData.filter((obj) => {
        return Object.values(obj).some((val) =>
          String(val).toLowerCase().includes(filterValue)
        );
      });

      this.cdr.detectChanges();
  }

  onQuickFilterNyaayShurut(event: any): void {  
      const filterValue = event.target.value;

      if(filterValue =='')
      {
        this.nyaayShurutiFilterData = this.nyaayShurutiRowData;
      }
      this.nyaayShurutiFilterData  = this.nyaayShurutiRowData.filter((obj) => {
        return Object.values(obj).some((val) =>
          String(val).toLowerCase().includes(filterValue)
        );
      });
      this.cdr.detectChanges();  
  }
}