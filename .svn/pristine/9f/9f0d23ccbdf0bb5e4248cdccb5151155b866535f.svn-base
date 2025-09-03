
import { Component, Renderer2, Inject, ElementRef, ViewChild, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { DOCUMENT, DatePipe } from '@angular/common';
import { IodashboardService } from '../services/iodashboard.service';
import { UtilityService } from '../services/utility.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { addDays, format } from 'date-fns';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { TableLazyLoadEvent } from 'primeng/table';
import { TabContainerComponent } from '../_components/tabs/tab-container.component';
import { from } from 'rxjs';
import { OtherPillarsComponent } from '../_components/otherpillars/other-pillars.component';
import { ModalService } from '../services/modal.service';
import { fakeAsync } from '@angular/core/testing';
interface PsCodeOption {
  text: string;
  value: string;
}

@Component({
  selector: 'app-consolidated-iodashboard',
  templateUrl: './consolidated-iodashboard.component.html',
  styleUrl: './consolidated-iodashboard.component.css'
})
export class ConsolidatedIOdashboardComponent implements OnInit {
  fromDate: string = '';
  toDate: string = '';
  districtsCodes: any[] = [];
  policeStationsCodes : any[] = [];
  Districts: any[] = [];
  // @ViewChild('multiSelect') gridContainer!: ElementRef;
  @ViewChild(TabContainerComponent) tabContainer!: TabContainerComponent;
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  CountListRowData: any;
  ListDistict: any[] = [];
  detailsListRowData: any;
  nyaayShurutiFilterData: any[] = [];
  errorMessage: string = '';
  TotalPendingFIR = 0;
  TotalType: string = '';
  HeinousType: string = '';
  OtherType: string = '';
  policestations: any[] = [];
  settings = {};
  minDateValue: any;
  maxDateValue: any;
  minToDate: any;
  maxFromDate: any;
  MaxDateRange:any;
  isTotalSecondCount: boolean = false;
  isTotalFirstCount: boolean = true;
  CountFromDate: string = '';
  CountToDate: string = '';
  searchTerm: string = '';
  currentFirst: number = 1;
  currentLast: number = 10;
  searchValue: string = '';
  pageSize: number = 10;
  FilteredRecordsCount: number = 0;
  ListRowData: any;
  ListTable: boolean = false;
  DataFilter: any;
  searchValues:any;
  headerText:string='';
  typeOfFir: string = '';
  mainType:string='';
  timependencies : any[] = [];
  subType: string = '';
  pageNumber: number = 1;
  fromDateTimePendecny: string = '';
  toDateTimePendecny: string = '';
  timePendencyHeaderLabel: string = '';
  sortBy: string = 'ASC';
  roleName: string | null = '';
  userName: string | null = '';
  isTotalFirstCountLebel : boolean = false;
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private IodashboardService: IodashboardService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    protected  modalService: ModalService
  )
  {

  }
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
    this.form = this.formBuilder.group(
      {
        psCode: [''],
        FromDate: [''],
        ToDate: [''],
        districtCodes: ['']
      });
     this.renderer.removeAttribute(this.document.body, 'class');
     this.LoadDistricts();
     //this.LoadDataForCount();
     this.isTotalFirstCountLebel = true;
     this.roleName = localStorage.getItem('roleName');
     this.userName = localStorage.getItem('userName');
  }

  //Loading initial counts
  LoadDataForCount() {
    this.IodashboardService.LoadFirCounts(this.districtsCodes, this.policeStationsCodes, this.fromDate, this.toDate).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          this.CountListRowData = JSON.parse(response.data).data;
          this.CountFromDate = JSON.parse(response.data).FromDate;
          this.CountToDate = JSON.parse(response.data).ToDate;
          this.MaxDateRange = JSON.parse(response.data).MaxDateRange;
          this.cdr.detectChanges();
          this.errorMessage = '';
        }
        else {
          this.errorMessage = 'No data availaible.';
          this.CountListRowData = "";
        }
      }
    });

  }

  //Load all districts initially
  LoadDistricts(): void {
    this.IodashboardService.LoadDistricts().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          this.ListDistict = response.data;
          this.errorMessage = '';
        }
        else {
          this.errorMessage = 'No data available';
          this.ListDistict = [];
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.ListDistict = [];
      },
    });
  }

  onDistrictDropdownChange(event: any) {
    var formValues = this.form.getRawValue();
    var districtCodes = formValues.districtCodes.map((item: { value: any; }) => parseInt(item.value));
    this.IodashboardService.LoadPoliceStations(districtCodes).subscribe((data: any) => {
      if (data.isSuccess) {
        this.policestations = data.data;
      }
    });
  }

  onDateChange(selectedDate: Date): void {
    this.maxFromDate = new Date(selectedDate);
    this.minToDate = new Date(this.maxFromDate);
    const daysToAdd = this.MaxDateRange;
    this.maxFromDate.setDate(this.maxFromDate.getDate() + daysToAdd);
  }

  form: FormGroup = new FormGroup({

  });

  onSearch() {
    this.isTotalSecondCount = false;
    this.isTotalFirstCount = true
    this.ListTable = false;
    const districtCodes: PsCodeOption[] = this.form.controls["districtCodes"].value || [];
    const DistrictCodes = districtCodes.length > 0 ? districtCodes.map((item: PsCodeOption) => Number(item.value)) : [];
    const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value || [];
    const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
    this.fromDate = this.form.controls["FromDate"].value;
    this.toDate = this.form.controls["ToDate"].value;
    this.districtsCodes = DistrictCodes;
    this.policeStationsCodes = psCodeValues;
    this.LoadDataForCount();
  }

  LoadTimePendency(type: string, mainType: string, mainHeader: string) {
    this.typeOfFir = mainType;
    this.isTotalSecondCount = false;
    if(mainType == 'Pending'){
      this.mainType = type;
      this.ListTable = false;
       
      this.IodashboardService.LoadTimePendency(this.CountFromDate, this.CountToDate, this.policeStationsCodes, this.districtsCodes, this.mainType).subscribe({
        next: (response: any) => {
          if (response.isSuccess && response.data && response.data.length > 0) {
            this.isTotalSecondCount = true;
            this.isTotalFirstCount = true;
            this.detailsListRowData = JSON.parse(response.data);
            this.timependencies = this.detailsListRowData.data;
            this.timePendencyHeaderLabel = this.detailsListRowData.HeaderLabel;
            this.cdr.detectChanges();
            this.scrollToGrid();
          }
        },
        error: (err) => {
          console.error('Error fetching Nyaay  data:', err);
          this.errorMessage = 'Failed to load data from the server. Please try again later.';
          this.detailsListRowData = "";
        },
      });
    }
    else{
      this.headerText = mainHeader;
      this.subType= type;
      this.CallFirListApi('', '');
    }
  }

  LoadFirListPagination(event: TableLazyLoadEvent){
    this.sortBy = event.sortOrder == 1 ? 'ASC' : 'DESC';
    this.pageSize = event.rows ?? 10;
    const first = event.first ?? 0;
    this.pageNumber = Math.floor(first / this.pageSize) + 1;
    this.currentFirst = first + 1;
    this.currentLast = first + this.pageSize > this.FilteredRecordsCount ? this.FilteredRecordsCount : first + this.pageSize;
    this.CallFirListApi(this.fromDateTimePendecny, this.toDateTimePendecny);
  }

  LoadFirList(headerText: any, Type: string, fDate: string, tDate: string, event: TableLazyLoadEvent): void {
    this.sortBy = event.sortOrder == 1 ? 'ASC' : 'DESC';
    this.pageNumber = 1;
    this.subType = Type;
    this.headerText = headerText;
    this.fromDateTimePendecny = fDate;
    this.toDateTimePendecny = tDate;
    this.CallFirListApi(fDate, tDate);
  }

 CallFirListApi(fDate: string, tDate: string){
  if(fDate == '') {
    fDate = this.fromDate;
  }
  if (tDate == '') {
    tDate = this.toDate;
  }

  this.IodashboardService.LoadFirList(fDate, tDate, this.districtsCodes, this.policeStationsCodes, this.subType, this.searchTerm, this.pageNumber, this.pageSize, this.sortBy).subscribe({
    next: (response: any) => {
      if (response.isSuccess && response.data && response.data.length > 0) {
        this.ListTable = true;
        this.ListRowData = JSON.parse(response.data).data;
        this.DataFilter = JSON.parse(response.data).data;
        //this.FilteredRecordsCount = JSON.parse(response.data).totalCount;
        try {
          const parsedData =JSON.parse(response.data).data[0];
          this.FilteredRecordsCount = parsedData.TotalCount;
          //console.log("FilteredRecordsCount", this.FilteredRecordsCount);
        } catch (e) {
          this.FilteredRecordsCount =0;
          //console.error("Failed to parse JSON:", e);
          //console.error("Problematic data:", response.data[0]);
        }
        this.updatePageInfo();
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToGrid(), 100);
      }
    },
  });
 }

  updatePageInfo() {
    // this.currentFirst = 1;
    // this.currentLast = this.pageSize > this.FilteredRecordsCount ? this.FilteredRecordsCount : this.pageSize;
  }

  onQuickFilter(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.searchTerm = filterValue;
    this.CallFirListApi(this.fromDate, this.toDate)
    this.cdr.detectChanges();
  }
  onReset() {
    this.form.controls["FromDate"].setValue('');
    this.form.controls["ToDate"].setValue('');
    this.form.controls["districtCodes"].setValue('');
    this.form.controls["psCode"].setValue('');
    this.districtsCodes=[],
    this.policeStationsCodes=[],
    this.fromDate='',
     this.toDate=''
    this.LoadDataForCount();
     this.cdr.detectChanges();
  }
  loadPillarData(firNumber: string,firRegDate: string,firShortNumber: string,policeCode: string): void {
    this.addOtherPillarTab(firNumber, firRegDate, firShortNumber, policeCode);

}
   tabCounter = 1;
   addOtherPillarTab(firNumber : string, firRegDate: string, firShortNumber: string, policeCode: string) {
        this.tabContainer.tabs = [];
        const TabTitle = `ICJS Pillars`;
        const TabData = {
          firNumber:firNumber.toString(),
          firRegDate:firRegDate.toString(),
          firShortNumber : firShortNumber.toString(),
          policeCode: policeCode.toString()
        };
        const TabComponent = OtherPillarsComponent;
        this.tabContainer.addTab(TabTitle, TabComponent, TabData);
        this.tabCounter++;
     }

     scrollToGrid(attempts = 10) {
      setTimeout(() => {
        if (this.gridContainer && this.gridContainer.nativeElement) {
         
          this.gridContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (attempts > 0) {
          console.log(`Grid not available yet, retrying... (${10 - attempts + 1}/10)`);
          this.scrollToGrid(attempts - 1);
        } else {
          console.warn("Scrolling failed: Grid not found after 10 attempts.");
        }
      }, 500);
    }  
}
