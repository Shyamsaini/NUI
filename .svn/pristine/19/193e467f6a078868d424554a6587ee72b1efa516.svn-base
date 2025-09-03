import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import {ESakshyadashboardService  } from '../services/e-sakshyadashboard.service';
import { UtilityService } from '../services/utility.service';
import { EsakshyaService } from '../services/dashboard.service';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { addDays, format } from 'date-fns';
import { IodashboardService } from '../services/iodashboard.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

interface PsCodeOption {
  text: string;
  value: string;
}

@Component({
  selector: 'app-esakshya-complete-dashboard',
  templateUrl: './esakshya-complete-dashboard.component.html',
  styleUrls: ['./esakshya-complete-dashboard.component.css']
})
export class EsakshyaCompleteDashboardComponent implements OnInit {

  @ViewChild('popupTable') popupTable!: any;
  @ViewChild('esakshyaDataTable') esakshyaDataTable!: any;

  LinkedStatusYes: number = 0; LinkedStatusNo: number = 0; total: number = 0;linked: number = 0; notLinked: number = 0;
  policestations: any[] = []; settings = {};EsakshyaRowData: any[] = []; nyaayShurutiFilterData: any[] = []; errorMessage: string = '';  
  showResults: boolean = false; EsakshyaFilterData: any[] = []; FilteredRecordsCount: number = 0;
  columns: any[] = []; currentFirst: number = 1;currentLast: number = 10;loading: boolean = false; popupColumns: any[] = [];
  showPopup = false; popupData: any[] = []; 
  LinkedStatusName = "";  
  LastUpdated = "";
  DeletedLinked : number = 0;
  CurrentStatus: any;
  firstRowIndex: number = 0;
  EsakshyaFilterDataDownload : any[] = []; // For download data
  EsakshyaData: any[] = [];
  minDateValue: Date = new Date(2024, 6, 1); 
  maxDateValue: Date = new Date(); 
  minToDate: Date = new Date(2024, 6, 1);  
  maxToDate: Date = new Date();   
  ListDistict: any[] = [];
  isShowDistrictPopup: boolean = false;

  currentDatePlaceholder: string = format(new Date(), 'dd-MM-yyyy');
  CurrentDefaultFromDate: string = format(new Date(2024, 6, 1), 'dd-MM-yyyy');
  CurrentDefaultToDate: string = format(new Date(), 'dd-MM-yyyy');

  fromDate: string = '';
  toDate: string = '';
  districtsCodes: any[] = [];
  policeStationsCodes : any[] = [];
  Districts: any[] = [];
  psName: string = '';
  districtName: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;


  formEsakshya: FormGroup = new FormGroup({

  });
  UniqueIOCount: any = 0;
  UniqueFirCount: any = 0;
  UniqueNotLinkedIOCount: any = 0;
  UniqueDeletedLinkedIOCount: any = 0;
  LaterLinked: any = 0;
  IOName: any = '';
  isShowDeletedPopup: boolean = false;
  isShowLinkedPopup: boolean = false;

  //  actTypeOptions = [
  //   { label: 'All', value: 'all' },
  //   { label: 'NCL', value: 'NCL' },
  //   { label: 'BNS', value: 'BNS' },
  //   { label: 'BSA', value: 'BSA' },
  //   { label: 'BNSS', value: 'BNSS' },
  //   { label: 'POCSO', value: 'POCSO' },
  // ];


    onDateChange(selectedDate: Date): void {
    //this.maxFromDate = new Date(selectedDate);
    //this.minToDate = new Date(this.maxFromDate);
    //const daysToAdd = this.MaxDateRange;
    //this.maxFromDate.setDate(this.maxFromDate.getDate() + daysToAdd);
  }

    onDistrictDropdownChange(event: any) {

     this.policestations = []; 
     const formValues = this.formEsakshya.getRawValue();

     const districtCodes = Array.isArray(formValues.districtCodes) && formValues.districtCodes.length > 0 ? formValues.districtCodes.map((item: { value: any }) => parseInt(item.value)) : [];

       if (districtCodes.length > 0) {
        this.IodashboardService.GetAllPoliceStationListBydistricts(districtCodes).subscribe((data: any) => {
          if (data.isSuccess) {
            this.policestations = data.data;
          }
        });
      }
      else {
        this.policestations = [];
      }
      this.cdr.detectChanges();
  }


  constructor(
    private esakshyaService: ESakshyadashboardService,
    private UtilityService:UtilityService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private esakshyaServi: EsakshyaService,
    private router:Router,
    private loaderService: LoaderService,
    private IodashboardService: IodashboardService,
    private datePipe: DatePipe,
  ) {     }

  ngOnInit(): void {

   //this.loaderService.show();

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

   this.LoadDistricts();
   this.LinkedStatusName = "Linked And Not Linked Status";
   this.CurrentStatus = null;
  this.formEsakshya = this.formBuilder.group(
      {
        psCode: [''],
        FromDate: [''],
        ToDate: [''],
        districtCodes: ['']
      });
  this.policestations = [];
  
  this.loadLinkedStatusCountRecordsClick(null);
}
closePopup(): void {
  this.popupData = []; 
  this.showPopup = false; 
}
onSidCountClick(sidCount: any): void {
  this.loaderService.show();
  this.showPopup = false;
  this.popupData = [];
  this.isShowDistrictPopup = false;
  this.isShowDeletedPopup = false;
  this.isShowLinkedPopup = false;

  if(this.CurrentStatus == 'Y')
  {
  this.isShowDistrictPopup = true;
  this.psName = sidCount.PS_Name;
  this.districtName = sidCount.DISTRICT;
  }
  else if(this.CurrentStatus == 'N' || this.CurrentStatus == 'L')
  {
    this.isShowDeletedPopup = true;
    this.IOName = sidCount.name;
  }
  else if(this.CurrentStatus == 'D')
  {
     this.isShowLinkedPopup = true;
     this.IOName = sidCount.name;
  }

  this.resetPaginator()
  this.esakshyaService.getPSAndMobileNumber(sidCount.PS_Code, sidCount.MobileNumber).subscribe(
    (response: any) => {
      this.loaderService.hide();
      if (response && response.data) {
        if(this.CurrentStatus == 'D')
        this.popupColumns = [
          { field: 'Sno', header: 'S.No' },
          { field: 'Sid', header: 'SID' },
          //{ field: 'LinkedFIRNumber', header: 'FIR Number' },
          { field: 'CurrentStatus', header: 'Current Status' },
          { field: 'SidOpeningDate', header: 'SID Opening Date' },
          { field: 'SidClosingDate', header: 'SID Closing Date' },
          { field: 'SidUploadingDate', header: 'SID Uploading Date' },
          { field: 'MobileNumber', header: 'Mobile Number' },
        ];
        else{

          this.popupColumns = [
            { field: 'Sno', header: 'S.No' },
            { field: 'Sid', header: 'SID' },
            { field: 'LinkedFIRNumber', header: 'FIR Number' },
            { field: 'CurrentStatus', header: 'Current Status' },
            { field: 'SidOpeningDate', header: 'SID Opening Date' },
            { field: 'SidClosingDate', header: 'SID Closing Date' },
            { field: 'SidUploadingDate', header: 'SID Uploading Date' },
            { field: 'MobileNumber', header: 'Mobile Number' }, ]
        }

        const parsedData= JSON.parse(response.data);

        this.popupData =JSON.parse(parsedData.data); // parse main data array

        if(this.CurrentStatus == 'D'){
        this.popupData = this.popupData.filter((item: any) => item.LinkedStatus == null);
        }
        else{
          this.popupData = this.popupData.filter((item: any) => item.LinkedStatus == this.CurrentStatus);
        }
        this.showPopup = true;
        this.cdr.detectChanges();
      } else {
        console.error('No data received from the service.');
      }
    },
    (error) => {
      this.loaderService.hide();
      console.error('Error fetching data:', error);
    }
  );
}

onSearch()
{
  this.loadLinkedStatusCountRecordsClick( this.CurrentStatus);
}

 DashboardType: string = 'ConsolidatedDashboard';

  toggleState() {
    if (this.DashboardType === 'MyDashboard') {
      this.router.navigate(['/Esakshyadashboard']);
    } else if (this.DashboardType === 'ConsolidatedDashboard') {
      this.router.navigate(['/EsakshyaCompleteDashboardComponent']);
    }
  }


loadLinkedStatusCountRecords(Status: any): void {

  if(Status == ''  || Status == undefined){
    Status = null
  }

  this.loaderService.show();
  let officeCodes = localStorage.getItem('mobileNumber');
  const userData = localStorage.getItem('userData');

    const districtCodes: PsCodeOption[] = this.formEsakshya.controls["districtCodes"].value || [];
    const DistrictCodes = districtCodes.length > 0 ? districtCodes.map((item: PsCodeOption) => Number(item.value)) : [];
    const psCodeArray: PsCodeOption[] = this.formEsakshya.controls["psCode"].value || [];
    const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];

    //this.fromDate = this.form.controls["FromDate"].value;
    //this.toDate = this.form.controls["ToDate"].value;
    this.fromDate = this.datePipe.transform(this.formEsakshya.controls["FromDate"].value, 'dd-MM-yyyy') || this.CurrentDefaultFromDate;
    this.toDate = this.datePipe.transform(this.formEsakshya.controls["ToDate"].value, 'dd-MM-yyyy') || this.CurrentDefaultToDate;
    this.districtsCodes = DistrictCodes;
    this.policeStationsCodes = psCodeValues;
    this.FilteredRecordsCount = 0;
    this.EsakshyaFilterData = [];
    this.columns = [];
    this.showResults = false;
    this.EsakshyaData = [];
    this.setColumnsEsakshya(Status);

  const payload = {
    status: Status,
    districtCodes:  this.districtsCodes,
    psCodes: this.policeStationsCodes,
    fromDate: this.fromDate,
    toDate: this.toDate,
    pageNumber: this.pageNumber,
    pageSize: this.pageSize
  };


  if (userData != null) {
    const userDataJson = JSON.parse(userData);
    officeCodes = userDataJson.mobileNumber;
  }

  const officeCodesString =
    officeCodes?.startsWith('91') ? officeCodes.substring(2) : officeCodes;

  this.esakshyaService
    .getLinkedstatusPolice(payload)
    .subscribe(
      (response: any) => {
        this.loaderService.hide();
        const parsedData = JSON.parse(response.data); // parse outer JSON string
        const data = JSON.parse(parsedData.linkedStatus); // parse linkedStatus JSON string
        
        this.total = data.Total;
        this.linked = data.Linked;
        this.notLinked = data.NotLinked;
      
        this.LastUpdated = data.LastUpdated;
        this.DeletedLinked = data.DeletedLinked;
        this.UniqueIOCount = data.UniqueIOCount;
        this.UniqueFirCount = data.UniqueFirCount;
        this.UniqueNotLinkedIOCount = data.UniqueNotLinkedIOCount;
        this.UniqueDeletedLinkedIOCount = data.UniqueDeletedLinkedIOCount;

        this.EsakshyaData = JSON.parse(parsedData.data); // parse main data array
        this.EsakshyaFilterData = JSON.parse(parsedData.data); // parse main data array
        this.FilteredRecordsCount = this.EsakshyaFilterData.length;
        this.LaterLinked  = data.LaterLinked;

     
        if(Status == 'Y'){    
           this.FilteredRecordsCount = this.EsakshyaFilterData[0].TotalCount;
           console.log("FilteredRecordsCount", this.FilteredRecordsCount);
           this.LinkedStatusName = "List of SID Linked with FIR";
           this.CurrentStatus ='Y';
        }
        else if(Status == 'N'){
          this.FilteredRecordsCount = data.UniqueNotLinkedIOCount;
          this.LinkedStatusName = "Not Linked List";
          this.CurrentStatus ='N';
        }
         else if(Status == 'L'){
          this.FilteredRecordsCount = this.EsakshyaFilterData[0].TotalCount;
          this.LinkedStatusName = "Link to be later List";
          this.CurrentStatus ='L';
        }
        else if(Status == 'D'){
          this.FilteredRecordsCount = data.UniqueDeletedLinkedIOCount;
          this.LinkedStatusName = "Deleted List";  
          this.CurrentStatus ='D';
        }
       else if(Status == 'IO'){
          this.FilteredRecordsCount = data.UniqueIOCount;
          this.LinkedStatusName = "Unique List of IO";  
          this.CurrentStatus ='IO';
        }
        else{
          this.FilteredRecordsCount = data.Total;
          this.LinkedStatusName = "Total List Of SID";
          this.CurrentStatus = null;
        }

        this.updatePageInfo();
        this.showResults = true; 
        this.cdr.detectChanges(); 

      },
      (error: any) => {
        console.error('Error loading data:', error);
        this.loaderService.hide();
      }
    );
}


setColumnsEsakshya(Status:any)
{
      if(Status == 'Y')
          {
            this.columns= [
               { field: 'RowNum', header: 'SNO' },        
               { field: 'DISTRICT', header: 'District Name' },
               { field: 'PS_Name', header: 'Police Station Name' },
               { field: 'SIDCount', header: 'SID Count' },
               { field: 'FIRCount', header: 'FIR Count' }
                ];
          }
          else if(Status == 'D'){
            this.columns= [
              { field: 'RowNum', header: 'SNO' },        
              { field: 'MobileNumber', header: 'Mobile Number' },
              { field: 'StaffDetails', header: 'IO Details From CCTNS' },
              { field: 'SIDCount', header: 'SID Count' },
            ];
          }
           else if (Status == 'N'){
            this.columns= [
              { field: 'RowNum', header: 'SNO' },        
              { field: 'name', header: 'IO Name From Esakshya' },
            //  { field: 'designation', header: 'Designation' },
              { field: 'StaffDetails', header: 'IO Details From CCTNS' },
              { field: 'MobileNumber', header: 'Mobile Number' },
              { field: 'SIDCount', header: 'SID Count' }
            ];
           }

            else if (Status == 'L'){
            this.columns= [
              { field: 'RowNum', header: 'SNO' },        
              { field: 'name', header: 'IO Name From Esakshya' },
            //  { field: 'designation', header: 'Designation' },
              { field: 'StaffDetails', header: 'IO Details From CCTNS' },
              { field: 'MobileNumber', header: 'Mobile Number' },
              { field: 'SIDCount', header: 'SID Count' }
            ];
           }

        else if (Status == 'IO'){
            this.columns= [
              { field: 'RowNum', header: 'SNO' },   
              { field: 'MobileNumber', header: 'Mobile Number' },
              { field: 'IOname', header: 'IO Name From Esakshya' },     
              { field: 'StaffDetails', header: 'IO Details From CCTNS' },
              //  { field: 'designation', header: 'Designation' },
              { field: 'TotalRecords', header: 'Total' },
              { field: 'Linked', header: 'Linked' },
              { field: 'NotLinked', header: 'Not Linked' },
              { field: 'LaterLinked', header: 'Linked be leter' },
              { field: 'Deleted', header: 'Deleted' }
              
            ];
        }
    else {
        this.columns = [      
        { field: 'RowNum', header: 'S.No' },
        { field: 'Sid', header: 'SID' },
        { field: 'LinkedFIRNumber', header: 'FIR Number' },
        { field: 'PS', header: 'Police Station Name' },
        { field: 'DISTRICT', header: 'District Name' },
        { field: 'CurrentStatus', header: 'Current Status' },
        { field: 'SidOpeningDate', header: 'SID Opening Date' },
        // { field: 'SidClosingDate', header: 'SID closing date' },
        { field: 'SidUploadingDate', header: 'SID Uploading Date' },
        { field: 'MobileNumber', header: 'Mobile Number' },
        { field: 'name', header: 'IO Name From Esakshya' },
        { field: 'StaffDetails', header: 'IO Details From CCTNS' },
      ];
    }
  }


onPageChange(event: any): void {
  this.pageNumber = Math.floor(event.first / event.rows) + 1;
  this.pageSize = event.rows;
  this.loadLinkedStatusCountRecords(this.CurrentStatus);
}

loadLinkedStatusCountRecordsClick(Status: any): void {

    this.resetEsakshyaDataTablePaginator();
    this.pageNumber =1;
    this.pageSize = 10;

  if(Status == ''  || Status == undefined){
    Status = null
  }

  this.loaderService.show();
  let officeCodes = localStorage.getItem('mobileNumber');
  const userData = localStorage.getItem('userData');

    const districtCodes: PsCodeOption[] = this.formEsakshya.controls["districtCodes"].value || [];
    const DistrictCodes = districtCodes.length > 0 ? districtCodes.map((item: PsCodeOption) => Number(item.value)) : [];
    const psCodeArray: PsCodeOption[] = this.formEsakshya.controls["psCode"].value || [];
    const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];

    //this.fromDate = this.form.controls["FromDate"].value;
    //this.toDate = this.form.controls["ToDate"].value;
    this.fromDate = this.datePipe.transform(this.formEsakshya.controls["FromDate"].value, 'dd-MM-yyyy') || this.CurrentDefaultFromDate;
    this.toDate = this.datePipe.transform(this.formEsakshya.controls["ToDate"].value, 'dd-MM-yyyy') || this.CurrentDefaultToDate;
    this.districtsCodes = DistrictCodes;
    this.policeStationsCodes = psCodeValues;
    this.FilteredRecordsCount = 0;
    this.EsakshyaFilterData = [];
    this.columns = [];
    this.showResults = false;
    this.EsakshyaData = [];
    this.setColumnsEsakshya(Status);

  const payload = {
    status: Status,
    districtCodes:  this.districtsCodes,
    psCodes: this.policeStationsCodes,
    fromDate: this.fromDate,
    toDate: this.toDate,
    pageNumber: this.pageNumber,
    pageSize: this.pageSize
  };


  if (userData != null) {
    const userDataJson = JSON.parse(userData);
    officeCodes = userDataJson.mobileNumber;
  }

  const officeCodesString =
    officeCodes?.startsWith('91') ? officeCodes.substring(2) : officeCodes;

  this.esakshyaService
    .getLinkedstatusPolice(payload)
    .subscribe(
      (response: any) => {
        this.loaderService.hide();
        const parsedData = JSON.parse(response.data); // parse outer JSON string
        const data = JSON.parse(parsedData.linkedStatus); // parse linkedStatus JSON string
        
        this.total = data.Total;
        this.linked = data.Linked;
        this.notLinked = data.NotLinked;
      
        this.LastUpdated = data.LastUpdated;
        this.DeletedLinked = data.DeletedLinked;
        this.UniqueIOCount = data.UniqueIOCount;
        this.UniqueFirCount = data.UniqueFirCount;
        this.UniqueNotLinkedIOCount = data.UniqueNotLinkedIOCount;
        this.UniqueDeletedLinkedIOCount = data.UniqueDeletedLinkedIOCount;
        this.LaterLinked  = data.LaterLinked;
        console.log("LaterLinked", data.LaterLinked);

        this.EsakshyaData = JSON.parse(parsedData.data); // parse main data array
        this.EsakshyaFilterData = JSON.parse(parsedData.data); // parse main data array
        //this.FilteredRecordsCount = this.EsakshyaFilterData.length;
         this.columns = [];

        if(Status == 'Y'){    
           this.FilteredRecordsCount = this.EsakshyaFilterData[0].TotalCount;
           console.log("FilteredRecordsCount", this.FilteredRecordsCount);
           this.LinkedStatusName = "List of SID Linked with FIR";
           this.CurrentStatus ='Y';
        }
        else if(Status == 'N'){
           this.FilteredRecordsCount = this.FilteredRecordsCount = data.UniqueNotLinkedIOCount;
          this.LinkedStatusName = "Not Linked List";
          this.CurrentStatus ='N';
        }
        else if(Status == 'L'){
          this.FilteredRecordsCount =this.EsakshyaFilterData[0].TotalCount;
          this.LinkedStatusName = "Link to be later List";
          this.CurrentStatus ='L';
        }
        else if(Status == 'D'){
          this.FilteredRecordsCount = data.UniqueDeletedLinkedIOCount;
          this.LinkedStatusName = "Deleted List";  
          this.CurrentStatus ='D';
        }
       else if(Status == 'IO'){
          this.FilteredRecordsCount = data.UniqueIOCount;
          this.LinkedStatusName = "Unique List of IO";  
          this.CurrentStatus ='IO';
        }
        else{
          this.FilteredRecordsCount = data.Total;
          this.LinkedStatusName = "Total List Of SID";
          this.CurrentStatus = null;
        }

        if(Status == 'Y')
          {
            this.columns= [
               { field: 'RowNum', header: 'SNO' },        
               { field: 'DISTRICT', header: 'District Name' },
               { field: 'PS_Name', header: 'Police Station Name' },
               { field: 'SIDCount', header: 'SID Count' },
               { field: 'FIRCount', header: 'FIR Count' }
                ];
          }
          else if(Status == 'D'){
            this.columns= [
              { field: 'RowNum', header: 'SNO' },        
              { field: 'MobileNumber', header: 'Mobile Number' },
              { field: 'StaffDetails', header: 'IO Details From CCTNS' },
              { field: 'SIDCount', header: 'SID Count' },
            ];
          }
           else if (Status == 'N'){
            this.columns= [
              { field: 'RowNum', header: 'SNO' },        
              { field: 'name', header: 'IO Name From Esakshya' },
            //  { field: 'designation', header: 'Designation' },
              { field: 'StaffDetails', header: 'IO Details From CCTNS' },
              { field: 'MobileNumber', header: 'Mobile Number' },
              { field: 'SIDCount', header: 'SID Count' }
            ];
           }

            else if (Status == 'L'){
            this.columns= [
              { field: 'RowNum', header: 'SNO' },        
              { field: 'name', header: 'IO Name From Esakshya' },
            //  { field: 'designation', header: 'Designation' },
              { field: 'StaffDetails', header: 'IO Details From CCTNS' },
              { field: 'MobileNumber', header: 'Mobile Number' },
              { field: 'SIDCount', header: 'SID Count' }
            ];
           }

        else if (Status == 'IO'){
            this.columns= [
              { field: 'RowNum', header: 'SNO' },   
              { field: 'MobileNumber', header: 'Mobile Number' },
              { field: 'IOname', header: 'IO Name From Esakshya' },     
              { field: 'StaffDetails', header: 'IO Details From CCTNS' },
              //  { field: 'designation', header: 'Designation' },
              { field: 'TotalRecords', header: 'Total' },
              { field: 'Linked', header: 'Linked' },
              { field: 'NotLinked', header: 'Not Linked' },
              { field: 'LaterLinked', header: 'Linked be leter' },
              { field: 'Deleted', header: 'Deleted' }
              
            ];
           }
        else {
        this.columns = [      
        { field: 'RowNum', header: 'S.No' },
        { field: 'Sid', header: 'SID' },
        { field: 'LinkedFIRNumber', header: 'FIR Number' },
        { field: 'PS', header: 'Police Station Name' },
        { field: 'DISTRICT', header: 'District Name' },
        { field: 'CurrentStatus', header: 'Current Status' },
        { field: 'SidOpeningDate', header: 'SID Opening Date' },
        // { field: 'SidClosingDate', header: 'SID closing date' },
        { field: 'SidUploadingDate', header: 'SID Uploading Date' },
        { field: 'MobileNumber', header: 'Mobile Number' },
        { field: 'name', header: 'IO Name From Esakshya' },
        { field: 'StaffDetails', header: 'IO Details From CCTNS' },
      ];
      }
        //this.updatePageInfo();
        this.showResults = true; 
        this.cdr.detectChanges(); 

      },
      (error: any) => {
        console.error('Error loading data:', error);
        this.loaderService.hide();
      }
    );
}

get totalLinkedStatus(): number {
  return this.LinkedStatusYes + this.LinkedStatusNo;
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

  loadPoliceStations(){
    this.UtilityService.PoliceStationList("0").subscribe((data: any[]) => {
      this.policestations = data;
    });
  }
  updatePageInfo() {
    this.currentFirst = 1;
    this.currentLast = this.pageSize > this.FilteredRecordsCount ? this.FilteredRecordsCount : this.pageSize;
  }


    public navigateToNewDashboard() {       
      this.router.navigate(['./Esakshyandashboard']);
    }

    resetPaginator1() {
      this.firstRowIndex = 0;
  }

  resetPaginator() {
    if (this.popupTable) {
        if (this.popupTable && this.popupTable.reset) {
            this.popupTable.reset();
        }
    }
  }

  resetEsakshyaDataTablePaginator() {
  if (this.esakshyaDataTable) {
    this.esakshyaDataTable.reset();
  }
}




onQuickFilter(event: Event) {

  const filterValue = (event.target as HTMLInputElement).value;

  if (!this.EsakshyaData) return;


  if (!filterValue?.trim()) {

      this.EsakshyaFilterData = [...this.EsakshyaData];

      this.FilteredRecordsCount = this.EsakshyaData.length;

      return;

  }


  const searchText = filterValue.toLowerCase();

  this.EsakshyaFilterData = this.EsakshyaData.filter(item => {

      return Object.keys(item).some(key => {

          const value = item[key];

          if (typeof value === 'string') return value.toLowerCase().includes(searchText);

          if (typeof value === 'number') return value.toString().includes(searchText);

          return false;

      });

  });

  this.FilteredRecordsCount = this.EsakshyaFilterData.length;

  this.firstRowIndex = 0; 

}

onReset() {
    this.formEsakshya.controls["FromDate"].setValue('');
    this.formEsakshya.controls["ToDate"].setValue('');
    this.formEsakshya.controls["districtCodes"].setValue('');
    this.formEsakshya.controls["psCode"].setValue('');
    this.loadLinkedStatusCountRecords( this.CurrentStatus);
    this.cdr.detectChanges();
  }

 

   LoadDistricts(): void {
    this.IodashboardService.getDistrictsByState().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          this.ListDistict = response.data;
          this.errorMessage = '';
          this.cdr.detectChanges();
        }
        else {
          this.cdr.detectChanges();
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

  
DownalodLinkedStatusData() {
     this.loaderService.show();

     this.loaderService.show();
     let officeCodes = localStorage.getItem('mobileNumber');
     const userData = localStorage.getItem('userData');

    const districtCodes: PsCodeOption[] = this.formEsakshya.controls["districtCodes"].value || [];
    const DistrictCodes = districtCodes.length > 0 ? districtCodes.map((item: PsCodeOption) => Number(item.value)) : [];
    const psCodeArray: PsCodeOption[] = this.formEsakshya.controls["psCode"].value || [];
    const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];

    //this.fromDate = this.form.controls["FromDate"].value;
    //this.toDate = this.form.controls["ToDate"].value;
    this.fromDate = this.datePipe.transform(this.formEsakshya.controls["FromDate"].value, 'dd-MM-yyyy') || this.CurrentDefaultFromDate;
    this.toDate = this.datePipe.transform(this.formEsakshya.controls["ToDate"].value, 'dd-MM-yyyy') || this.CurrentDefaultToDate;
    this.districtsCodes = DistrictCodes;
    this.policeStationsCodes = psCodeValues;

  const payload = {
    status: this.CurrentStatus,
    districtCodes:  this.districtsCodes,
    psCodes: this.policeStationsCodes,
    fromDate: this.fromDate,
    toDate: this.toDate
  };


  if (userData != null) {
    const userDataJson = JSON.parse(userData);
    officeCodes = userDataJson.mobileNumber;
  }
   this.EsakshyaFilterDataDownload = []

  this.esakshyaService
    .getDownloadData(payload)
    .subscribe(
      (response: any) => {
        this.loaderService.hide();
        const parsedData = JSON.parse(response.data); // parse outer JSON string
        this.EsakshyaFilterDataDownload = JSON.parse(parsedData.data); // parse main data array
        this.convertJsonToExcel(this.EsakshyaFilterDataDownload);
      (error: any) => {
        console.error('Error loading data:', error);
        this.loaderService.hide();
      }
    });
}

convertJsonToExcel(EsakshyaFilterDataDownload:any) {

  this.EsakshyaFilterDataDownload = EsakshyaFilterDataDownload || [];

   if (this.EsakshyaFilterDataDownload && this.EsakshyaFilterDataDownload.length > 0) {
              const filteredData = this.removeEmptyColumns(this.EsakshyaFilterDataDownload);

              const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
              worksheet['!cols'] = this.generateColWidths(filteredData[0]);

              const workbook: XLSX.WorkBook = {
                  Sheets: { 'LinkedStatusData': worksheet },
                  SheetNames: ['LinkedStatusData']
              };

              const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
              this.saveAsExcelFile(excelBuffer, this.LinkedStatusName);
          } else {
              Swal.fire({
                  position: 'center',
                  title: 'No data found to download.',
                  showConfirmButton: false,
                  timer: 2000,
                  icon: 'warning',
                  background: '#fff3cd',
                  color: '#000000',
              });
          }
      this.loaderService.hide();
     this.cdr.detectChanges();
  }

private saveAsExcelFile(buffer: any, fileName: string): void {
  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  FileSaver.saveAs(data, `${fileName.trimStart()+'_Details'}_export_${new Date().getTime()}.xlsx`);
}

private generateColWidths(row: any): XLSX.ColInfo[] {
  return Object.keys(row).map(key => ({
      wch: Math.max(15, key.length + 5) // Minimum 15, adjusts based on header length
  }));
}

// Filter out keys that are empty/null/undefined in all rows
private removeEmptyColumns(data: any[]): any[] {
  if (!data.length) return [];

  const keys = Object.keys(data[0]);
  const usefulKeys = keys.filter(key =>
      data.some(item => item[key] !== null && item[key] !== undefined && item[key].toString().trim() !== '')
  );

  return data.map(item => {
      const filteredItem: any = {};
      usefulKeys.forEach(key => {
          filteredItem[key] = item[key];
      });
      return filteredItem;
  });
}

getLinkedFIRDisplay(row: any): string {
  if (row.CurrentStatus === 'Deleted') {
    return 'N/A';
  }
  return row.LinkedFIRNumber || 'Not linked';
}

}
