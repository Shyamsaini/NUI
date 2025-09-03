import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IodashboardService } from '../../services/iodashboard.service';
import { DatePipe, DOCUMENT } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UtilityService } from '../../services/utility.service';
import { DataAnalyticsService } from '../../services/data-analytics.service';
import { _isVisible } from 'ag-grid-community';
import { TableLazyLoadEvent } from 'primeng/table';
import { DataAnalyticsFIRRecord } from '../../models/data-analytics-fir-record';
import { AnalyticsRecord } from '../../models/analytics-record';
//import{ LazyLoadEvent } from '../../models/table-lazy-load-event';
import { stringify } from 'querystring';
export interface DropdownOption {
  value: number;
  text: string;
}

interface PsCodeOption {
  text: string;
  value: string;
}
@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html',
  styleUrl: './data-analytics.component.css',
  preserveWhitespaces: true
})
export class DataAnalyticsComponent implements OnInit {



  row: any;
  groupbyn = [
    { value: 'MajorHead', text: 'Major Head' },
    { value: 'MinorHead', text: 'MINOR Head' },
    { value: 'PSCodes', text: 'PS Codes' },
    { value: 'IOName', text: 'IO Name' },
    { value: 'Year', text: 'FIR Year' },
  ];

  // selectedGroup = [{ idField: 'PSCodes', textField: 'PS Codes' }];
  policestations: any;

  // Now pass the numberArray to the function

  AnalyticsData: AnalyticsRecord[] = [];
  isLoading = true;
  columns: any[] = [];
  dataItem: any[] = [];
  Districts: any[] = [];
  settings = {};
  ListDistict: any[] = [];
  dateValue: any;
  minDateValue: any;
  maxDateValue: any;
  minDateValue2: any;
  maxDateValue2: any;
  savedFilterValues: any = {};
  isTotalSecondCount: boolean = false;
  isTotalFirstCount: boolean = true;
  CountFromDate: string = '';
  CountToDate: string = '';
  currentPage: number = 1;
  pageSize: number = 10000;
  currentFirst: number = 1;
  currentLast: number = 10;
  ListTable: boolean = false;
  CountListRowData: any;
  errorMessage: any;
  groupby: any[] = this.groupbyn;
  minorheads: any[] = [];
  majorheads: any[] = [];
  FilteredRecordsCount: number = 0;
  loading: boolean = false;
  ListRowData: any;
  DataFilter: any;
  fetchDataForType: string = '';
  headerText: string = '';
  AnalyticsCountData: DataAnalyticsFIRRecord[] = [];
  showTable: boolean = false;
  columnscount: any[] = [];
  FilteredRecordsCountfir: any;



  constructor(
    @Inject(DataAnalyticsService) private dataAnalyticsService: DataAnalyticsService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private IodashboardService: IodashboardService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalService: BsModalService
  ) {

  }
  ngOnInit(): void {
    this.showTable = false;
    this.MajorHeadList();
    this.DistrictsCount();
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

    this.columns = [
      { field: 'REG_YEAR', header: 'Registration Year' },
      // { field: 'PS_CD', header: 'Police Station CODE' },     
      { field: 'count', header: 'Count' },
    ];

    this.form.get('districtCodes')?.valueChanges.subscribe((districtCodes: any[]) => {
      this.onDistrictDropdownChange(districtCodes);
    });


    this.form = this.formBuilder.group(
      {
        psCode: [''],
        FromDate: [''],
        ToDate: [''],
        MajorHead: [''],
        MinorHead: [''],
        groupby: [''],
        districtCodes: [''],

      });
    this.renderer.removeAttribute(this.document.body, 'class');
    this.district();


  }

  onSubmit(): void {

  }
  // district() {
  //   this.utilityService.Districts().subscribe((data: any[]) => {
  //     this.Districts = data;
  //   });
  // }
  form: FormGroup = new FormGroup({

  });

   district(): void {
      this.utilityService.LoadDistricts().subscribe({
        //this.IodashboardService.LoadDistricts().subscribe({
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

  private policeStationCache = new Map<number[], any>();

  onDistrictDropdownChange(event: any): void {
    const districtCodes = this.form
      .get('districtCodes')
      ?.value.map((item: { value: any }) => parseInt(item.value));

    if (this.policeStationCache.has(districtCodes)) {
      this.policestations = this.policeStationCache.get(districtCodes);
    } else {
      //this.IodashboardService.getPoliceStation(districtCodes).subscribe((data: any) => {
       this.utilityService.LoadPoliceStationsList(districtCodes).subscribe((data: any) => {
        if (data.isSuccess) {
          this.policeStationCache.set(districtCodes, data.data);
          this.policestations = data.data;
        }
      });
    }
  }

  onMajorHeadDropdownChange(event: any) {
    const formValuesmajor = this.form.getRawValue();
    const majorheadcode = formValuesmajor.MajorHead.map((item: { value: any; }) => parseInt(item.value));
    this.dataAnalyticsService.getMinorHeadlists(majorheadcode).subscribe((data: any) => {
      // this.utilityService.LoadPoliceStationsList(districtCodes).subscribe((data: any) => {
      if (data.isSuccess) {
        this.minorheads = data.data;
      }
    });
  }

  onDateChange(selectedDate: Date): void {
    this.maxDateValue2 = new Date(selectedDate);
    this.minDateValue2 = new Date(this.maxDateValue2);
    const daysToAdd = this.CountListRowData.MaxDateRange;
    this.maxDateValue2.setDate(this.maxDateValue2.getDate() + daysToAdd);
  }

  DistrictsCount(): void {
    this.IodashboardService.getDistrictsCount().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          this.ListDistict = response.data;

          this.errorMessage = '';
        }
        else {
          this.errorMessage = 'No data available for Nyaay Shuruti.';
          this.ListDistict = [];
        }
      },
      error: (err) => {
        console.error('Error fetching Nyaay Shuruti data:', err);
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.ListDistict = [];
      },
    });
  }

  MajorHeadList(): void {

    this.dataAnalyticsService.getMajorHeadlists().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {


          this.majorheads = response.data.map((item: any) => ({
            text: item.text,
            value: item.value,
          }));
          this.errorMessage = '';

        }
        else {
          this.errorMessage = 'No data available for Nyaay Shuruti.';
          this.ListDistict = [];
        }
      },
      error: (err: any) => {
        console.error('Error fetching Nyaay Shuruti data:', err);
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.ListDistict = [];
      },
    });
  }



  onSearch() {
    this.isTotalSecondCount = false;
    this.isTotalFirstCount = true
    this.ListTable = false;
    this.showTable = false;
    const MajorHeads = this.form.controls["MajorHead"].value;
    const MajorHead = MajorHeads.length > 0 ? MajorHeads.map((item: PsCodeOption) => Number(item.value)) : [];
    const MinorHeads = this.form.controls["MinorHead"].value;
    const MinorHead = MinorHeads.length > 0 ? MinorHeads.map((item: PsCodeOption) => Number(item.value)) : [];
    const groupbynew = this.form.controls["groupby"].value;
    const GroupBy = groupbynew.length > 0 ? groupbynew.map((item: PsCodeOption) => String(item.value)) : [];

    const fromDate = this.form.controls["FromDate"].value;
    const ToDate = this.form.controls["ToDate"].value;
    const districtCodes: PsCodeOption[] = this.form.controls["districtCodes"].value || [];
    const DistrictCodes = districtCodes.length > 0 ? districtCodes.map((item: PsCodeOption) => Number(item.value)) : [];
    const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value || [];
    const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
    this.cdr.detectChanges();
    //   const fromDatenew = fromDateRaw
    //   ? formatDate(fromDateRaw, 'yyyy-MM-dd', 'en-US')
    //   : '';
    // const ToDatenew = toDateRaw
    //   ? formatDate(toDateRaw, 'yyyy-MM-dd', 'en-US')
    //   : '';
    const fromDatenew = this.datePipe.transform(fromDate, 'yyyy-MM-dd') || '';
    const ToDatenew = this.datePipe.transform(ToDate, 'yyyy-MM-dd') || '';

    this.savedFilterValues = {

      fromDatenew,
      ToDatenew,
    };
    const searchValues = [GroupBy, MajorHead, MinorHead, psCodeValues, fromDate, ToDate, DistrictCodes];
    this.BindList(searchValues);
  }
  BindList(searchValues: any[]) {
    this.AnalyticsData = [];
    this.errorMessage = '';
    this.columns = [];
    const GroupBy = searchValues[0];
    const MajorHead = searchValues[1];
    const MinorHeads = searchValues[2];
    const psCode = searchValues[3];
    const fromDate = searchValues[4];
    const toDate = searchValues[5];


    this.dataAnalyticsService.getAnalyticsData(GroupBy, MajorHead, MinorHeads, psCode, fromDate, toDate)
      .subscribe({
        next: (response: any) => {

          console.log(response);
          if (response.isSuccess && response.data && response.data.length > 0) {
            this.AnalyticsData = response.data;
            this.columns = this.generateColumns(this.AnalyticsData[0]);

            this.ListTable = true;
            this.ListRowData = response.data;
            this.DataFilter = response.data;
            this.FilteredRecordsCount = response.totalCount;
            this.updatePageInfo();
          } else {
            this.errorMessage = 'No data available for Data Analytics.';
            this.AnalyticsData = []; // Ensure AnalyticsData is cleared on error
          }
        },
        error: (error: any) => {
          console.error('Error loading data:', error);
          this.errorMessage = 'An error occurred while fetching data.';
          this.AnalyticsData = []; // Clear AnalyticsData on error
        }
      });
  }
  generateColumns(dataItem: any): any[] {
    if (!dataItem) {
      return [];
    }
    return Object.keys(dataItem).map(key => ({
      field: key,
      header: key // Adjust as needed
    }));
  }


  Reset() {

    this.form.reset();
    this.MajorHeadList();
    this.DistrictsCount();
    this.cdr.detectChanges();

    window.location.reload();
  }

  onCountclickforlazy(event: TableLazyLoadEvent) {

    this.currentPage = event.first ?? 0;  // Default to 0 if `first` is undefined
    this.pageSize = event.rows ?? 10;
  }
  onCountClick(majorheads?: number[] | null, minorheads?: number[] | null, psCode?: number[] | null, iocode?: string | null | null, Year?: number): void {

    this.cdr.detectChanges();
    this.AnalyticsCountData = [];
    this.errorMessage = '';
    this.columnscount = [];

    let { ToDatenew, fromDatenew } = this.savedFilterValues;
    const majorHeadValue = Array.isArray(majorheads) && majorheads.every(value => typeof value === 'number') ? majorheads : [];
    const minorHeadValue = Array.isArray(minorheads) && minorheads.every(value => typeof value === 'number') ? minorheads : [];
    const psCodeValue = Array.isArray(psCode) && psCode.every(value => typeof value === 'number') ? psCode : [];
    const ioCodeValue = iocode !== null && iocode !== '' ? Number(iocode) : 0;//iocode || '';
    const Years = Year !== null ? Number(Year) : 0;//iocode || '';
    const toDatevalue = ToDatenew || '';
    const fromDatevalue = fromDatenew || '';
    const pageNumber = this.currentFirst;
    const pageSize = this.pageSize;
    this.getAnalyticsCountDetails(majorHeadValue, minorHeadValue, psCodeValue, ioCodeValue, Years, fromDatevalue, toDatevalue, pageNumber, pageSize);
  }


  getAnalyticsCountDetails(majorHeadValue: number[], MinorHeads: number[], psCode: number[], ioCodeValue: number, Year: number, FromDate: string, ToDate: string, pageNumber: number, pageSize: number) {

    this.dataAnalyticsService.getAnalyticsDataDetails(majorHeadValue, MinorHeads, psCode, ioCodeValue, Year, FromDate, ToDate, pageNumber, pageSize).subscribe({
      next: (response: any) => {
        if (response.data && Array.isArray(response.data.records) && response.data.records.length > 0) {
          // Update data and state variables

          this.AnalyticsCountData = response.data.records;
          this.showTable = true;
          this.ListRowData = [...response.data.records];
          this.DataFilter = [...response.data.records];
          this.FilteredRecordsCountfir = response.data.filteredRecords ?? response.data.records.length;
          this.updatePageInfo();

          this.cdr.detectChanges();


        } else {
          this.errorMessage = 'No data available for Data Analytics.';
          this.AnalyticsCountData = [];
          this.showTable = false;
        }
      },

      error: (error: any) => {
        console.error('Error loading data:', error);
        this.errorMessage = 'An error occurred while fetching data.';
      },
    });
  }

  updatePageInfo() {
    this.currentFirst = 1;
    this.currentLast = this.pageSize > this.FilteredRecordsCountfir ? this.FilteredRecordsCountfir : this.pageSize;
  }
}



