import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {ESakshyadashboardService  } from '../services/e-sakshyadashboard.service';
import { UtilityService } from '../services/utility.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EsakshyaService } from '../services/dashboard.service';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { LogUtilityService } from '../services/log-utility.service';
import { ReportAuthorizationService } from '../services/report-authorization.service';
import { LoaderService } from '../services/loader.service';


interface PsCodeOption {
  text: string;
  value: string;
}

@Component({
  selector: 'app-esakshyadashboard',
  templateUrl: './esakshyadashboard.component.html',
  styleUrl: './esakshyadashboard.component.css'
})
export class EsakshyadashboardComponent  implements OnInit{
  ESakshyadashboardService: any;
  isNyaayShurutiDataLoaded: any;
  LinkedStatusYes: number=0 ;
  LinkedStatusNo: number=0;
  TotalCount:number=0;
  LinkedStatusDeleted:number =0;
  LinkedStatusCountRecords: any[] = [];  
  renderer: any;
  form:FormGroup = new FormGroup({ });
  policestations: any[] = [];
  settings = {};
  dateValue: any;
  minDateValue: any;
  maxDateValue: any;
  minDateValue2: any;
  maxDateValue2: any;
  isTotalSecondCount: boolean = false;
  isTotalFirstCount: boolean = true;
  EsakshyaRowData: any[] = [];
  nyaayShurutiRowData: any[] = [];
  CountListRowData:any;
  detailsListRowData:any;
  nyaayShurutiFilterData: any[] = [];
  errorMessage: string = '';
  TotalPendingFIR = 0;
  TotalType = 0;
  HeinousType: string = '';
  OtherType: string = '';
  Type: string = '';
  lablename:any;
  Cnt:any;
  showResults: boolean = false;
  searchValue : string = '';
  videoUrl: string | null = null;
  Total: number = 0;
  ReportsGenerated: number = 0;
  ReportsNotGenerated: number = 0;
  fromDate: string = '';
  toDate: string = '';
  pageSize: number = 10;
  selectedFullDispNo: string = '';
  EsakshyaFilterData: any[] = []; 
  FilteredRecordsCount: number = 0; 
  loading: boolean = false;
  columns: any[] = []; 
  currentFirst: number =1; 
  currentLast: number = 10; 
  first: number = 0; 
  rows: number = 10; 
  selectedData: { type: string; source: string } | null = null; 
  displayModal: boolean = false;
  OpenDoc: boolean = false;
  fileType: string | null = null; 
  pdfData: Uint8Array | null = null;
  message :string|null=null;
  modalData: any = {
    evidence_images_list: [],
    evidence_videos_list: [],
    witness_images_list: [],
    io_image_path: '',
    certificate_path: '',
    docket_file_path: ''
  };

  @ViewChild('content') modalTemplate!: TemplateRef<any>; // Reference to modal template
  @ViewChild('myButton') myButton: ElementRef | undefined;
  @ViewChild('esakshyaDataTableDetails') esakshyaDataTable!: any;
  MobileNumber: any;
  SidOpeningDate: any;
  ReferenceNumber: any;
  Sid: any;
  firstRowIndex: number = 0;
  LastUpdated = "";
  
  @ViewChild('popupTable') popupTable!: any;
  LaterLinked: any = 0;
  
  constructor(   
    private esakshyaService: ESakshyadashboardService,
    private UtilityService:UtilityService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private esakshyaServi: EsakshyaService,
    private router:Router,
    private datePipe: DatePipe,
    private logUtilService: LogUtilityService,   
    private ReportAuthorizationService: ReportAuthorizationService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadLinkedStatusCountRecords(null);  
    this.loadPoliceStations();
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
        ToDate: ['']
      });
      

      this.columns = [      
        { field: 'Sno', header: 'S.No' },
        { field: 'Sid', header: 'SID' },
        { field: 'LinkedFIRNumber', header: 'FiR number' },
        { field: 'PS', header: 'Police Station Name' },
        { field: 'DISTRICT', header: 'District Name' },
        { field: 'CurrentStatus', header: 'Current status' },
        { field: 'SidOpeningDate', header: 'SID opening date' },
        { field: 'SidClosingDate', header: 'SID closing date' },
        { field: 'SidUploadingDate', header: 'SID uploading date' },
        { field: 'MobileNumber', header: 'Mobile number' }
      ];
   
      
  }
  
  videoColumns = [
    { field: 'video', header: 'Video name' },
     { field: 'view', header: 'View video', icon: 'fa fa-eye' }
  ];
  
  imageColumns = [{ field: 'image', header: 'Image name' }
     , { field: 'view', header: 'View image', icon: 'fa fa-eye' }
  ];
  certificateColumns = [{ field: 'certificate', header: 'Certificate name' }, { field: 'view', header: 'View certificate', icon: 'fa fa-eye' }];
  
  WitnessColumns = [
    { field: 'Witness', header: 'Witness detail' },
    { field: 'view', header: 'View image', icon: 'fa fa-eye' }
  ];

  DashboardType: string = 'eSakshayaDashboard';

    toggleState() {
    if (this.DashboardType === 'eSakshayaDashboard') {
      this.router.navigate(['/Esakshyadashboard']);
    } else if (this.DashboardType === 'ConsolidatedDashboard') {
      this.router.navigate(['/EsakshyaCompleteDashboardComponent']);
    }
  }


  onSearch(): void { 
    this.resetEsakshyaDataTablePaginator();  
    var officeCodes = localStorage.getItem('mobileNumber');
    const userData =  localStorage.getItem('userData');
    if(userData != null){
      var userDataJson = JSON.parse(userData);
      officeCodes = userDataJson.mobileNumber;
    }
      const officeCodesString = officeCodes?.startsWith('91') ? officeCodes.substring(2)  : officeCodes;

    var OpeningDate = this.form.controls["FromDate"].value|| null;
    var ClosingDate = this.form.controls["ToDate"].value|| null;    
    if (OpeningDate != null && ClosingDate != null) {
      const formattedOpeningDate = this.datePipe.transform(OpeningDate, 'dd-MM-yyyy');
      const formattedClosingDate = this.datePipe.transform(ClosingDate, 'dd-MM-yyyy');
      this.message = `Total SID list from  ${formattedOpeningDate} to  ${formattedClosingDate}`;
    } 
this.logUtilService.logSearchAction(officeCodesString, OpeningDate, ClosingDate,this.message,null);

    OpeningDate = this.datePipe.transform(this.form.controls["FromDate"].value, 'dd-MM-yyyy') || null;
    ClosingDate =  this.datePipe.transform(this.form.controls["ToDate"].value, 'dd-MM-yyyy') || null; 

    this.esakshyaService.getLinkedstatus(officeCodesString,OpeningDate, ClosingDate,null).subscribe(
      (response: any) => {
       const parsedData = JSON.parse(response.data); // parse outer JSON string

        const data = parsedData.linkedStatus; // parse linkedStatus JSON string
        this.EsakshyaFilterData = parsedData.data; 
        this.FilteredRecordsCount = this.EsakshyaFilterData.length;
        this.Total = response.count;

        this.updatePageInfo(); 

        this.showResults = true;
        const linkedStatusParsed = JSON.parse(data);

        //this.LinkedStatusYes = linkedStatus.LinkedStatusYes || 0;

        //this.LinkedStatusNo = linkedStatus.LinkedStatusNo || 0;      

       // this.TotalCount = linkedStatus.TotalSIDCount || 0;  

        this.LinkedStatusYes = linkedStatusParsed.Linked || 0;
        this.LinkedStatusNo = linkedStatusParsed.NotLinked || 0;
        this.TotalCount = linkedStatusParsed.Total || 0;
        this.LinkedStatusDeleted = data.DeletedLinked || 0;
      },
      (error: any) => {
        console.error('Error loading data:', error);
      }
    );
  }
  onSidClick(sidData: any): void {
    //this.EsakshyaFilterData = []; 
    //this.FilteredRecordsCount = 0;
   // this.Total = 0;
   // this.resetEsakshyaDataTablePaginator();
    this.loading = true;
  
    let officeCodes = localStorage.getItem('mobileNumber');
    const userData = localStorage.getItem('userData');
  
    if (userData != null) {
      var userDataJson = JSON.parse(userData);
      officeCodes = userDataJson.mobileNumber;
    }
  
    const officeCodesString = officeCodes?.startsWith('91') ? officeCodes.substring(2) : officeCodes;
  
    const OpeningDate = this.form.controls["FromDate"].value || null;
    const ClosingDate = this.form.controls["ToDate"].value || null;
  
    if (OpeningDate != null && ClosingDate != null) {
      const formattedOpeningDate = this.datePipe.transform(OpeningDate, 'dd/MM/yyyy');
      const formattedClosingDate = this.datePipe.transform(ClosingDate, 'dd/MM/yyyy');
      this.message = `Total SID list from ${formattedOpeningDate} to ${formattedClosingDate}`;
    } else {
      this.message = "Click on SID";
    }
  
    this.logUtilService.logSearchAction(officeCodesString, OpeningDate, ClosingDate, this.message, sidData.Sid);
  
    this.esakshyaService.getSidDetails(sidData.Sid, sidData.OfficeCode).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.isSuccess) {         
          this.modalData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
          this.modalData.evidence_images_list = this.modalData.evidence_images_list || [];
          this.modalData.evidence_videos_list = this.modalData.evidence_videos_list || [];
          this.modalData.witness_images_list = this.modalData.witness_images_list || [];
          this.modalData.certificate_path = this.modalData.certificate_path ? [this.modalData.certificate_path] : [];
          this.displayModal = true;
          this.MobileNumber = sidData.MobileNumber;
          this.SidOpeningDate = sidData.SidOpeningDate;
          this.ReferenceNumber = sidData.ReferenceNumber;
          this.Sid = sidData.Sid;
          this.cdr.detectChanges();
        } else {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: response.message || 'Unable to fetch data',
            showConfirmButton: false,
            background: '#fff3cd', 
            color: '#000000',    
            timer: 3000,
          });
          
        }
      },
      (error: any) => {
        console.error('HTTP error:', error);
        this.loading = false;
        Swal.fire({
          position: 'center',
          title: 'Error fetching SID details.',
          icon: 'error',
          showConfirmButton: true,
          background: '#fff3cd', 
            color: '#000000', 
        });
      }
    );
  }
  

  
  closeModal(): void {
    this.displayModal = false;
  }
  close(): void {
    this.OpenDoc=false;
    this.videoUrl=null;
  }

  viewVideo(fileName: string): void {
    this.loaderService.show();
    var officeCodes = localStorage.getItem('mobileNumber');
    const userData =  localStorage.getItem('userData');
    if(userData != null){
      var userDataJson = JSON.parse(userData);
      officeCodes = userDataJson.mobileNumber;
    }
      const officeCodesString = officeCodes?.startsWith('91') ? officeCodes.substring(2)  : officeCodes;
    
    const OpeningDate = this.form.controls["FromDate"].value|| null;
    const ClosingDate = this.form.controls["ToDate"].value|| null;    
    if (OpeningDate != null && ClosingDate != null) {
      const formattedOpeningDate = this.datePipe.transform(OpeningDate, 'dd/MM/yyyy');
      const formattedClosingDate = this.datePipe.transform(ClosingDate, 'dd/MM/yyyy');
      this.message = `Total SID list from  ${formattedOpeningDate} to  ${formattedClosingDate}`;
    } 
    else
    {
      this.message ="Play Video/View Image";
    }
    
    this.esakshyaService.getVideoUrl(fileName).subscribe(
      (response) => {
        this.loaderService.hide();
        if (response.isSuccess) {
          const fileUrl = JSON.parse(response.data).url;
          this.logUtilService.logSearchAction(officeCodesString, OpeningDate, ClosingDate, this.message,fileUrl);
          this.fileType = this.getFileType(fileName); 
          if (this.fileType === 'pdf') {
            this.fetchPdf(fileUrl);
          } else {
            this.videoUrl = fileUrl;
            this.OpenDoc = true; 
          }
        } else {
          this.loaderService.hide();
          console.error('Failed to retrieve file URL:', response.message);
        }
      },
      (error) => {
        this.loaderService.hide();
        console.error('Error fetching file URL:', error);
      }
    );
  }
  fetchPdf(fileUrl: string): void {
    fetch(fileUrl)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        this.pdfData = new Uint8Array(data);
        this.OpenDoc = true; 
      })
      .catch((error) => console.error('Error loading PDF:', error));
  }

 
  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4':
      case 'webm':
      case 'ogg':
        return 'video';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'pdf':
        return 'pdf';
      default:
        return 'unknown';
    }
  }

 
loadLinkedStatusCountRecords(Status:any): void {

  this.columns = [];

    this.loaderService.show();
    var officeCodes = localStorage.getItem('mobileNumber');
    const userData =  localStorage.getItem('userData');
    this.EsakshyaFilterData = []; 
    this.FilteredRecordsCount = 0;
    this.Total = 0;
    this.resetEsakshyaDataTablePaginator();
    if(userData != null){
      var userDataJson = JSON.parse(userData);
      officeCodes = userDataJson.mobileNumber;
    } 
    const officeCodesString = officeCodes?.startsWith('91')? officeCodes.substring(2) : officeCodes;
    var OpeningDate = this.form.get("FromDate")?.value || null;
    var ClosingDate = this.form.get("ToDate")?.value || null;

  if(Status=='Y') {

          
      this.columns = [      
        { field: 'Sno', header: 'S.No' },
        { field: 'Sid', header: 'SID' },
        { field: 'LinkedFIRNumber', header: 'FIR number' },
        { field: 'PS', header: 'Police Station Name' },
        { field: 'DISTRICT', header: 'District Name' },
        { field: 'CurrentStatus', header: 'Current status' },
        { field: 'SidOpeningDate', header: 'SID opening date' },
        { field: 'SidClosingDate', header: 'SID closing date' },
        { field: 'SidUploadingDate', header: 'SID uploading date' },
        { field: 'MobileNumber', header: 'Mobile number' }
      ];

    if (OpeningDate != null && ClosingDate != null) {
      const formattedOpeningDate = this.datePipe.transform(OpeningDate, 'dd/MM/yyyy');
      const formattedClosingDate = this.datePipe.transform(ClosingDate, 'dd/MM/yyyy');
      this.message = `List of SID Linked with FIR from  ${formattedOpeningDate} to  ${formattedClosingDate}`;   
    } 
else
    {
    this.message = `List of SID Linked with FIR`;   
    }
  }
  else if(Status=='N' || Status=='L') {
          this.columns = [      
        { field: 'Sno', header: 'S.No' },
        { field: 'Sid', header: 'SID' },
        { field: 'LinkedFIRNumber', header: 'FIR Number' },
        { field: 'CurrentStatus', header: 'Current status' },
        { field: 'SidOpeningDate', header: 'SID opening date' },
        { field: 'SidClosingDate', header: 'SID closing date' },
        { field: 'SidUploadingDate', header: 'SID uploading date' },
        { field: 'MobileNumber', header: 'Mobile number' }
      ];
    if (OpeningDate != null && ClosingDate != null) {
      const formattedOpeningDate = this.datePipe.transform(OpeningDate, 'dd/MM/yyyy');
      const formattedClosingDate = this.datePipe.transform(ClosingDate, 'dd/MM/yyyy');  
      if(Status=='N')  
      {
      this.message = `Not Linked SID from  ${formattedOpeningDate} to  ${formattedClosingDate}`;    
      }
      else{
      this.message = `Link to be later SID from  ${formattedOpeningDate} to  ${formattedClosingDate}`;
      }
    } 
    else
    {
      if(Status=='N')  
      {
        this.message = `Not Linked SID `;
      }
      else{
        this.message = `Link to be later SID `;
      }
    }
  }

  else if(Status=='D') {
       
       this.columns = [      
        { field: 'Sno', header: 'S.No' },
        { field: 'Sid', header: 'SID' },
        { field: 'LinkedFIRNumber', header: 'FIR number' },
        { field: 'CurrentStatus', header: 'Current status' },
        { field: 'SidOpeningDate', header: 'SID opening date' },
        { field: 'SidClosingDate', header: 'SID closing date' },
        { field: 'SidUploadingDate', header: 'SID uploading date' },
        { field: 'MobileNumber', header: 'Mobile number' }
      ];
    if (OpeningDate != null && ClosingDate != null) {
      const formattedOpeningDate = this.datePipe.transform(OpeningDate, 'dd/MM/yyyy');
      const formattedClosingDate = this.datePipe.transform(ClosingDate, 'dd/MM/yyyy');    
      this.message = `Deleted Linked SID from  ${formattedOpeningDate} to  ${formattedClosingDate}`;    
    } 
    else
    {
    this.message = `Deleted Linked SID `;
   
    }
    
    }
  else if(Status=='' || Status==null) {
          
      this.columns = [      
        { field: 'Sno', header: 'S.No' },
        { field: 'Sid', header: 'SID' },
        { field: 'LinkedFIRNumber', header: 'FIR number' },
        { field: 'PS', header: 'Police Station Name' },
        { field: 'DISTRICT', header: 'District Name' },
        { field: 'CurrentStatus', header: 'Current status' },
        { field: 'SidOpeningDate', header: 'SID opening date' },
        { field: 'SidClosingDate', header: 'SID closing date' },
        { field: 'SidUploadingDate', header: 'SID uploading date' },
        { field: 'MobileNumber', header: 'Mobile number' }
      ];

    if (OpeningDate != null && ClosingDate != null) {
      const formattedOpeningDate = this.datePipe.transform(OpeningDate, 'dd/MM/yyyy');
      const formattedClosingDate = this.datePipe.transform(ClosingDate, 'dd/MM/yyyy');
      this.message = `Total List of SID from  ${formattedOpeningDate} to  ${formattedClosingDate}`;      
    } 
    else
    {
    this.message = `Total List of SID`;
    }
  }
  this.logUtilService.logSearchAction(officeCodesString, OpeningDate, ClosingDate, this.message,Status);
 if (OpeningDate != null && ClosingDate != null) {
      OpeningDate = this.datePipe.transform(this.form.controls["FromDate"].value, 'dd-MM-yyyy') || null;
      ClosingDate =  this.datePipe.transform(this.form.controls["ToDate"].value, 'dd-MM-yyyy') || null; 
     }
  this.esakshyaService.getLinkedstatus(officeCodesString,OpeningDate,ClosingDate,Status).subscribe(
  
    (response: any) => {
      this.loaderService.hide();

      const parsedData = JSON.parse(response.data); // parse outer JSON string
      const data = JSON.parse(parsedData.linkedStatus); // parse linkedStatus JSON string
      this.EsakshyaFilterData = parsedData.data; 
      this.FilteredRecordsCount = this.EsakshyaFilterData.length;
      this.Total = response.count;
      this.updatePageInfo(); 
      this.showResults = true;

      const linkedStatusParsed = data;
      this.LinkedStatusYes = linkedStatusParsed.Linked || 0;
      this.LinkedStatusNo = linkedStatusParsed.NotLinked || 0;
      this.TotalCount = linkedStatusParsed.Total || 0;
      this.LinkedStatusDeleted = data.DeletedLinked || 0;
      this.LaterLinked = data.LaterLinked || 0;
      this.LastUpdated =  data.LastUpdated || 0;
      this.cdr.detectChanges();   
      
    },
    (error: any) => {
      this.loaderService.hide();
      console.error('Error loading data:', error);
    }
  );
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

  DownloadPDF(fileName: string): void {
    this.loaderService.show();
    var officeCodes = localStorage.getItem('mobileNumber');
    const userData =  localStorage.getItem('userData');
    if(userData != null){
      var userDataJson = JSON.parse(userData);
      officeCodes = userDataJson.mobileNumber;
    }
      const MobileNumber = officeCodes?.startsWith('91') ? officeCodes.substring(2)  : officeCodes;
    
    const OpeningDate = this.form.controls["FromDate"].value|| null;
    const ClosingDate = this.form.controls["ToDate"].value|| null;    
    if (OpeningDate != null && ClosingDate != null) {
      const formattedOpeningDate = this.datePipe.transform(OpeningDate, 'dd/MM/yyyy');
      const formattedClosingDate = this.datePipe.transform(ClosingDate, 'dd/MM/yyyy');
      this.message = `Total SID list from  ${formattedOpeningDate} to  ${formattedClosingDate}`;
    } 
    else
    {
      this.message ="Play Video/View Image";
    }

    this.esakshyaService.getVideoUrl(fileName).subscribe(
        (response) => {
          this.loaderService.hide();
          if (response.isSuccess) {
            const fileUrl = JSON.parse(response.data).url;
            this.logUtilService.logSearchAction(MobileNumber, OpeningDate, ClosingDate, this.message,fileUrl);
            const a = document.createElement('a');
            a.href = fileUrl;
            a.target = '_blank'; 
            const downloadFileName = fileName.split('/').pop() || 'default-file-name.pdf'; 
            a.download = downloadFileName;            
            a.click(); 
          } else {
            this.loaderService.hide();
            console.error('Failed to retrieve file URL:', response.message);
          }
        },
     
     error => {
      this.loaderService.hide();
          Swal.fire({
            position: 'top-end',
            title: 'You are not authorized for this report !',
            showConfirmButton: false,
            timer: 5000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',              
            },
            background: '#EDE04D',
          }).then(() => {
            console.log('Swal Popup closed');
          });
        });
  

    }     

    public RefresheSakshya():void {      
      this.loading = true;      
      this.esakshyaService.getRefresheSakshya().subscribe(
        (response: any) => {
          this.loading = false;
          this.loadLinkedStatusCountRecords(null); 
          Swal.fire({
            position: 'top-end', 
            title: 'eSakshya data refresh successful !.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },            
            background: '#006400', 
          });          
        }
      )
    }
     resetEsakshyaDataTablePaginator() {
      if (this.esakshyaDataTable) {
          if (this.esakshyaDataTable && this.esakshyaDataTable.reset) {
              this.esakshyaDataTable.reset();
          }
      }
}
}
