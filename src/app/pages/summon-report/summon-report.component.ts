export interface SummonCategoryModel {
  id: number;
  summonCategory: string;
}

export interface SummonServedTypeModel {
  id: number;
  summonServedType: string;
  summonDescription: string;
  isImage: boolean;
}

import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SummonReportService } from '../services/summon-report.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SummonSubmitServeRequestModel } from '../models/summon-submit-serve-request-model';

@Component({
  selector: 'app-summon-report',
  templateUrl: './summon-report.component.html',
  styleUrls: ['./summon-report.component.css']
})
export class SummonReportComponent implements OnInit, OnDestroy {

  totalSummonsCount: number = 0;
  unAssignedCount: number = 0;
  servedCount: number = 0;

  actions: SummonCategoryModel[] = []; 
  actionId: number | null = null; 
  reasons: SummonServedTypeModel[] = [];
  // selectedReason: number | null = null; 
  selectedReason: SummonServedTypeModel | null = null;
  selectedReasonId: number | null = null;
  summonServedType: string = '';
  remarks: string = '';

  @ViewChild('detailModal') detailModal!: TemplateRef<any>;
  @ViewChild('combinedModal') combinedModal!: TemplateRef<any>;
  pdfViewerUrl: SafeResourceUrl = '';
  
  form!: FormGroup;
  isSubmitted = false;
  loading = false;
  SummonReports: any[] = [];
  totalRecords = 0;
  rowsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  isGridVisible = false;
  private subscription: Subscription | null = null;
  private searchSubject: Subject<string> = new Subject();
  
  imageData: string | null = null;
  selectedRowData: any = {};
  modalRef!: NgbModalRef;
  
  // Properties related to combined modal actions
  //assignUserList: any[] = [];
  //actions: any[] = [];
  //reasons: any[] = [];
 // pdfViewerUrl: string = '';
  assignUser: string = '';
  //actionId: string = '';
 // remarks: string = '';
  serveReason: string = '';
  serveDate: string = new Date().toISOString().split('T')[0]; // Default date to today's date
  isServePersonVisible: boolean = false;
  servePersonName: string = '';
  servePersonAddress: string = '';
  servePersonMobile: string = '';
  servePersonRelation: string = '';
  servePersonEmail: string = '';
  locality: string = '';
  judgeName: string = ''; // For selected judge name
  
   // List of reassign reasons
   // For assign data ID
  processId: string = ''; // Added processId
  cino: string = ''; // Added cino
  caseStatus: string = ''; // Added caseStatus
  policeStationCd: string = ''; // Added policeStationCd
  policeStationName: string = ''; // Added policeStationName
  fileToUpload: File | null = null; // File upload
  base64String: string | null = null; 
   // Updated from 'reassignReason' to 'reassignReasons'

  //For Assign Summon
  assignUserList: any[] = []; 
  judgeList: string[] = []; 
  reassignReasons: any[] = [];// Holds reasons for re-assign
  
  //reassignReason: any[] = [];// Selected re-assign reason
  reassignReason: number | null = null;
  assignDataId: string = '';
  serveTabDisabled: boolean = false;

  showSummonUserTo: boolean = false;
  presentSummonUserText: string = '';
  showReassignReasonDiv: boolean = false;
  showJudgeDiv: boolean = true;
  showLocalityDiv: boolean = true;

  

  constructor(private fb: FormBuilder, private summonReportService: SummonReportService, private modalService: NgbModal, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fromDate: [''],
      toDate: [''],
      summonType: ['2', Validators.required],
      process_id: [''],
      ci_no: [''],
      fir_no: [''],
      year_no: [''],
      name_address: ['']
    });

    this.loadMPsStaffInfo();
    this.loadJudgeList();
    this.loadReassignReasons();
    this.loadSummonCounts();

    this.searchSubject.pipe(
      debounceTime(750) // 0.75-second delay before making the request
    ).subscribe((searchTerm) => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
      this.loadSummonReports();
    });
  }

  loadSummonCounts(): void {
    const formData = {
      fromDate: null,
      toDate: null,
      summonType: '2' // or any default summon type
    };

    this.summonReportService.getSummonCountDetails(formData).subscribe(
      (response: any) => {
        if (response && response.data && response.data.length > 0) {
          const countData = response.data[0];
          this.totalSummonsCount = countData.TotalSummons || 0;
          this.unAssignedCount = countData.UnAssigned || 0;
          this.servedCount = countData.Servered || 0;
        }
      },
      (error: any) => {
        console.error('Error fetching summon count data on load', error);
      }
    );
  }

  

  loadMPsStaffInfo(): void {
    this.summonReportService.getMPsStaffInfo().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.assignUserList = response.data;  // Assign the data to the user list
        } else {
          console.error('Failed to load staff info:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching MPs Staff Info:', error);
      }
    );
  }


  loadJudgeList(): void {
    this.summonReportService.getJudgeList().subscribe(
      (response) => {
        if (response.isSuccess) {
          this.judgeList = response.data;
        }
      },
      (error) => {
        console.error('Error fetching judge list:', error);
      }
    );
  }

  
  loadReassignReasons(): void {
    this.summonReportService.getReassignReasonsbyservedCategory().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.reassignReasons = response.data;  // Populate the reassignReasons array
        } else {
          console.error('Failed to load summon served reasons:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching summon served reasons:', error);
      }
    );
  }


  get f() {
    return this.form.controls;
  }


  onSubmit(): void {
    this.isSubmitted = true;
  
    if (this.form.invalid) {
      return;
    }
  
    this.currentPage = 1;
    this.isGridVisible = true;
  
    const fromDate = this.form.value.fromDate ? this.formatDate(this.form.value.fromDate) : null;
    const toDate = this.form.value.toDate ? this.formatDate(this.form.value.toDate) : null;
  
    this.loadSummonReports(fromDate, toDate);
  }
  
  loadSummonReports(fromDate: string | null = null, toDate: string | null = null): void {
    const formData = {
      fromDate: fromDate, // Can be null if not selected
      toDate: toDate,     // Can be null if not selected
      summonType: this.form.value.summonType,
      districtID: null,
      policeStationID: null,
      processID: this.form.value.process_id,
      ciNo: this.form.value.ci_no,
      pageNumber: this.currentPage,
      pageSize: this.rowsPerPage,
      searchTerm: this.searchTerm,
      caseType: null,
      purposeType: null,
      summonName: null,
      sortBy: null,
      courtName: null,
      firNo: this.form.value.fir_no || null,
      firYear: this.form.value.year_no || null,
      name: this.form.value.name_address || null,
    };
  
    this.loading = true;
  
    this.subscription = this.summonReportService.getSummonReports(formData).subscribe(
      (response: any) => {
        this.SummonReports = response.data;
        this.totalRecords = response.data[0]?.filteredRecords || response.data.length;
  
        // Fetch the count details for TotalSummons, UnAssigned, and Served
        this.summonReportService.getSummonCountDetails(formData).subscribe(
          (countResponse: any) => {
            if (countResponse && countResponse.data && countResponse.data.length > 0) {
              const countData = countResponse.data[0];
              this.totalSummonsCount = countData.TotalSummons || 0;
              this.unAssignedCount = countData.UnAssigned || 0;
              this.servedCount = countData.Servered || 0;
            }
          },
          (error: any) => {
            console.error('Error fetching summon count data', error);
          }
        );
  
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching summon report data', error);
        this.loading = false;
      }
    );
  }


  PaginationSummonReport(event: any): void {
    this.currentPage = event.first / event.rows + 1;
    this.rowsPerPage = event.rows;
    this.loadSummonReports();
  }

  onReset(): void {
    this.isSubmitted = false;
    this.isGridVisible = false;
    this.form.reset({
      summonType: '2',
      process_id: '',
      ci_no: '',
      fir_no: '',
      name_address: ''
    });
    this.loadSummonReports(); // Reload data after reset
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    let day = '' + d.getDate();
    let month = '' + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) {
      day = '0' + day;
    }
    if (month.length < 2) {
      month = '0' + month;
    }

    return [day, month, year].join('-');
  }

  getImageData(processId: string): void {
    this.summonReportService.getImageData(processId).subscribe(
      (response) => {
        this.imageData = response.imageData;
      },
      (error) => {
        console.error('Error fetching image data', error);
      }
    );
  }

  onQuickFilter(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.searchSubject.next(filterValue);
  }

  // Method to download PDF
  DownloadPDF(processId: string): void {
    console.log('Downloading PDF for Process ID:', processId);

    this.summonReportService.downloadPdf(processId).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${processId}_Summon.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error downloading PDF', error);
      }
    );
  }

  ShowDetailsModal(rowData: any): void {
    this.selectedRowData = rowData;

    this.summonReportService.getImageData(rowData.process_id).subscribe(
      (response) => {
        if (response && response.imageData) {
          this.imageData = response.imageData;
        } else {
          this.imageData = null;
        }

        this.modalRef = this.modalService.open(this.detailModal, { size: 'xl' });
      },
      (error) => {
        console.error('Error fetching image data', error);
        this.imageData = null;
        this.modalRef = this.modalService.open(this.detailModal, { size: 'xl' });
      }
    );
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  openCombinedModal(processId: string, rowData: any): void {
    this.selectedRowData = rowData;
    this.processId = rowData.process_id;  // Assuming `process_id` is part of rowData
    this.cino = rowData.cino;  // Make sure `ci_no` is present in `rowData`
    this.caseStatus = rowData.case_status;
    this.policeStationCd=rowData.police_national_code;
    this.policeStationName=rowData.police_station_name
    //this.serveTabDisabled = true;

    // Check if it's a Re-Assign case where the summon is already assigned and still pending
  if (rowData.summon_assign_id !== null && rowData.summonStatus === 'Pending') {
    this.serveTabDisabled = true; // Disable the Serve tab
    this.showSummonUserTo = true; // Show the "Present Summon User" div
    this.presentSummonUserText = `Present Summon User: ${rowData.assignName}`; // Set the text
    this.showReassignReasonDiv = true; // Show the Reassign Reason div
    this.showJudgeDiv = false; // Hide the Judge div
    this.showLocalityDiv = false; // Hide the Locality div
  } else {
    this.serveTabDisabled = false; // Enable the Serve tab
    this.showSummonUserTo = false; // Hide the "Present Summon User" div
    this.showReassignReasonDiv = false; // Hide the Reassign Reason div
    this.showJudgeDiv = true; // Show the Judge div
    this.showLocalityDiv = true; // Show the Locality div
  }
    this.loadPdf(processId);
    this.loadActionsData();

     // Set initial visibility to false
  this.isServePersonVisible = false;
    this.modalRef = this.modalService.open(this.combinedModal, { size: 'xl' });
  }
  
  
  loadPdf(processId: string): void {
    this.summonReportService.downloadPdf(processId).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Sanitize the URL before assigning it to the PDF viewer
        this.pdfViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      (error) => {
        console.error('Error loading PDF data:', error);
      }
    );
  }


  loadActionsData(): void { 
    this.summonReportService.getSummonServeCategory().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.actions = response.data;
          
        } else {
          console.error('No actions found');
        }
      },
      (error) => {
        console.error('Error loading serve actions:', error);
      }
    );
  }
  

  loadSummonServeReasonsData(actionId: number | null): void {
    if (actionId === null) {
      console.warn('Invalid actionId: actionId is null');
      return;
    }

    if(actionId ==3 || actionId == 0 || actionId == 2 || actionId == 4)
    {
      this.isServePersonVisible = false;
      this.remarks="";
      this.selectedReasonId = null;
    }
    else
    {
      this.isServePersonVisible = true;
    }
  
    this.summonReportService.getSummonServedReasons(actionId).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.reasons = response.data; 
          this.remarks="";
        } else {
          console.warn('No reasons found for the selected action.');
        }
      },
      (error) => {
        console.error('Error loading served types:', error);
      }
    );
  }
  


  // Method to handle reason selection and populate remarks
  onReasonChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    
    if (target && target.value) {
      const selectedReasonId = Number(target.value); // Convert the value to a number
      const selected = this.reasons.find(reason => reason.id === selectedReasonId);
  
      if (selected) {
        this.selectedReason = selected;
        this.remarks = selected.summonDescription;

        // Accessing summonServedType from the selected reason
      this.summonServedType = selected.summonServedType;
      this.selectedReasonId = selected.id;

      //console.log('Selected Summon Served Type:', summonServedType);

      // If you want to store it in a property for later use
      //this.summonServedType = summonServedType;
      }
    } else {
      console.warn('Event target is null or value is undefined.');
    }
  }
  
  selectTab(tabId: string): void {
    const assignTab = document.getElementById('assign-tab-pane');
    const serveTab = document.getElementById('serve-tab-pane');

    if (tabId === 'assign-tab-pane') {
      assignTab?.classList.add('show', 'active');
      serveTab?.classList.remove('show', 'active');
    } else {
      assignTab?.classList.remove('show', 'active');
      serveTab?.classList.add('show', 'active');
    }
  }


  handleSubmit(): void {
    const assignTabActive = document.getElementById('assign-tab-pane')?.classList.contains('active');
    const serveTabActive = document.getElementById('serve-tab-pane')?.classList.contains('active');
  
    if (assignTabActive) {
      this.submitAssignSummon();
    } else if (serveTabActive) {
      this.submitServeSummon();
    }
  }
  
  submitAssignSummon(): void { 
    // Ensure the required fields are filled
    if (!this.assignUser || !this.selectedRowData) {
      console.warn('Required fields are missing.');
      return;
    }
  
    const isReassign = this.selectedRowData.summon_assign_id !== null && this.selectedRowData.summonStatus === 'Pending';

    let reasonAssignId: any = this.reassignReason;

  if (reasonAssignId === undefined || isNaN(reasonAssignId)) {
    reasonAssignId = 0;
  }

    const dataToSend = {
      Id: this.selectedRowData.Id || 0,
      Cino: this.selectedRowData.cino || '',
      ProcessId: this.selectedRowData.process_id || '',
      CaseStatus: this.selectedRowData.case_status || '',
      PoliceStationCd: this.selectedRowData.police_national_code || '',
      PoliceStationName: this.selectedRowData.police_station_name || '',
      AssignTo: this.assignUser,
      AssignOn: new Date().toISOString(),
      AssignBy: this.selectedRowData.userId,
      DeliveredOn: this.selectedRowData.delivered_on,
      SummonStatus: this.selectedRowData.summonStatus || '',
      RecordStatus: 'C',
      Type: this.selectedRowData.Type || 0,
     // AssignName: isReassign ? `Reassigned to ${this.assignUser}` : this.selectedRowData.assignName,
      //ReasonAssignId: isReassign ? (this.reassignReason[0] || 0) : null,  // Include if it's a reassignment
      ReasonAssignId: reasonAssignId,
      ReassignRemarks: isReassign ? this.remarks : null,
      JudgeName: !isReassign ? this.judgeName : null,
      Locality: !isReassign ? this.locality : null, 
      NextDate: this.selectedRowData.next_date,
    };
  
    // Call the service to submit the data
    this.summonReportService.submitAssignSummon(dataToSend).subscribe(
      (response: any) => {
        console.log('Summon assigned or reassigned successfully', response);
        this.modalRef.close();  // Close the modal on success
        this.clearServeTabFields();  // Reset fields after submission
        this.loadSummonReports();  // Refresh the list
      },
      (error) => {
        console.error('Error submitting assign or reassign summon', error);
      }
    );
  }
  

  submitServeSummon(): void { 

    if (!this.actionId || !this.selectedReasonId || !this.remarks || !this.serveDate || !this.actions) {
      console.warn('Required fields are missing.');
      return;
    }

  //const selectedAction = this.actions.find(action => action.id === this.actionId);
  const selectedAction = this.actions.find(action => action.id === Number(this.actionId));
  const selectedCategory = selectedAction ? selectedAction.summonCategory : '';

    const submitData: SummonSubmitServeRequestModel = {
      processId: this.processId,
      cino: this.cino,
      caseStatus: this.caseStatus,
      policeStationCd: this.policeStationCd,
      policeStationName: this.policeStationName,
      longitude: '',
      latitude: '',
      serveDate: this.serveDate,
      serveType: this.selectedReasonId || 0, //reasonId=13 ok
      userId: '',
      base64String: this.base64String || '',
      fileName: this.fileToUpload ? this.fileToUpload.name : '',
      location: '',
      reasonType: this.actionId, //actionId=3     
      reason: this.summonServedType , //dropdown2Data="Not Related to PO and Summon Staff"
      summonDescription: this.remarks,
      category: selectedCategory,  //dropdown1Data="Not Applicable"
    };

    if (this.isServePersonVisible && this.actionId !== 3) {
      submitData.servePersonName = this.servePersonName;
      submitData.servePersonAddress = this.servePersonAddress;
      submitData.servePersonMobile = this.servePersonMobile;
      submitData.servePersonRelation = this.servePersonRelation;
      submitData.servePersonEmail = this.servePersonEmail;
    }
  
    this.summonReportService.submitSummon(submitData).subscribe(
      (response: any) => {
        console.log('Summon served successfully', response);
        this.modalRef.close(); // Close modal on success
        this.onSubmit();
        this.clearServeTabFields();
      },
      (error) => {
        console.error('Error submitting summon', error);
      }
    );
  }

  clearServeTabFields(): void {
    this.actionId = null;
    this.selectedReasonId = null;
    this.summonServedType = '';
    this.remarks = '';
    this.servePersonName = '';
    this.servePersonAddress = '';
    this.servePersonMobile = '';
    this.servePersonRelation = '';
    this.fileToUpload = null;
    this.base64String = null;
    this.isServePersonVisible = false;
    this.serveReason = '';
    this.assignUser='';
    this.judgeName='';
    this.reassignReason=0;
    this.judgeName='';
    this.reassignReason=0;

  }
  
  closeCombinedModal(): void { 
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.serveTabDisabled = false;
    this.clearServeTabFields();
  }

  toggleServePersonFields(): void {
    this.isServePersonVisible = !this.isServePersonVisible;
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.convertFileToBase64(file);
    }
  }
  

  convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().replace("data:", "").replace(/^.+,/, "") || null;
      if (base64String) {
        this.base64String = base64String;
        console.log('Base64 string:', this.base64String);
      }
    };
    reader.readAsDataURL(file);
  }
}
