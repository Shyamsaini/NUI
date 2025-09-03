import { Component,  ChangeDetectorRef, ViewChild} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from '../services/utility.service';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { ModalService } from '../services/modal.service';
import { LoaderService } from '../services/loader.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateCaseStatusService } from '../services/update-case-status.service';import { CourtComponent } from '../_components/court/court.component';
import { TabContainerComponent } from '../_components/tabs/tab-container.component';
import { OtherPillarsComponent } from '../_components/otherpillars/other-pillars.component';
import { OtherPillarsServicesService } from '../services/other-pillars-services.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-update-case-status',
  templateUrl: './update-case-status.component.html',
  styleUrl: './update-case-status.component.css'
})
export class UpdateCaseStatusComponent {
  Districts: any[] = [];
  policestations: any[] = [];
  isSubmitted = false;
  isSubmittedd = false;
  selectedDistrictName: string = '';
  selectedPoliceStationName: string = '';
  formattedFir: string = '';
  psCode: any;
  isLoaded = false;
  firdata: any = [];
  AccusedData: any = [];
  showPopup = false; popupData: any[] = [];
  AccusedDataPOPHeader: string = '';
  popupColumns: any[] = [];
  firstRowIndex: number = 0;
  otherPillarData: any[] = [];
  UpdateCaseForm!: FormGroup;
  CaseStatusTypes: any[] = [];
  isConvicted: boolean = false;
  cnrList: string[] = [];
  isCaseUpdateTable: boolean = false;
  firregnum: string = '';


  CountData: any[] = [];
  GetLogDetails: any[] = [];
  MobileNo: string = '';
  displayPopup = false;
  @ViewChild('popupTable') popupTable!: any;

  constructor(private fb: FormBuilder, private utilityService: UtilityService, private formBuilder: FormBuilder, private UpdateCaseStatusService: UpdateCaseStatusService, protected modalService: ModalService,
    private ref: ChangeDetectorRef, private loaderService: LoaderService, private otherPillarsServicesService: OtherPillarsServicesService,
    private dynamicModelService: DynamicModalService
  ) {
     }

  columns: any[] = [
    { field: 'firRegNum', header: 'Fir Number' },
    { field: 'firRegDate', header: 'FIR Registration Date & Time' },
    { field: 'firStatus', header: 'Status' }
  ];
  form: FormGroup = new FormGroup({
    psCode: new FormControl(''),
    firNumber: new FormControl(''),
    year: new FormControl('')


  });

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  get ff(): { [key: string]: AbstractControl } {
    return this.UpdateCaseForm.controls;
  }
  ngOnInit(): void {
    this.CaseStatusList();
    this.form = this.formBuilder.group(
      {
        district: [''],
        psCode: ['', Validators.required],
        firNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{1,7}$/)]],
        year: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
      }
    );
    this.UpdateCaseForm = this.fb.group({
      selectedCnr: ['', Validators.required],
      district: ['', Validators.required],
      CaseStatusType: ['', Validators.required],
      Punishment: ['', [Validators.required, Validators.pattern(/^[0-9]{1,7}$/)]],
      Remarks: ['']
    });
    this.district();
  }

  // district() {
  //   this.utilityService.Districts().subscribe((data) => {
  //     if (data.isSuccess) {
  //       this.Districts = data.data;
  //     }
  //   });
  // }

    district() {
    this.utilityService.LoadDistricts().subscribe((data) => {
      // this.utilityService.Districts().subscribe((data) => {
      if (data.isSuccess) {
        this.Districts = data.data;
      }
    });
  }
   onDistrictChange(event: any): void {
    this.loaderService.show();
    const selectedDistrict = event.target.value;
    if (selectedDistrict) {
      this.utilityService.PoliceStationNyaySetu(selectedDistrict).subscribe((data: any[]) => {
        //  this.utilityService.PoliceStationList(selectedDistrict).subscribe((data: any[]) => {
        this.policestations = data;
        this.loaderService.hide();
      });
    }
    else {
      this.form.controls["district"].setValue('');
      this.form.controls["psCode"].setValue('');
      this.form.controls["firNumber"].setValue('');
      this.policestations = [];
      this.loaderService.hide();
    }
  }
  // onDistrictChange(event: any): void {
  //   this.loaderService.show();
  //   const selectedDistrict = event.target.value;
  //   if (selectedDistrict) {
  //     this.utilityService.PoliceStationList(selectedDistrict).subscribe((data: any[]) => {
  //       this.policestations = data;
  //       this.loaderService.hide();
  //     });
  //   }
  //   else {
  //     this.form.controls["district"].setValue('');
  //     this.form.controls["psCode"].setValue('');
  //     this.form.controls["firNumber"].setValue('');
  //     this.policestations = [];
  //     this.loaderService.hide();
  //   }
  // }

  onCaseStatusChange(event: any) {
    const selectedValue = event.target.value;

    this.isConvicted = selectedValue === 'Convicted';

    if (this.isConvicted) {
      if (!this.UpdateCaseForm.get('Punishment')) {
        this.UpdateCaseForm.addControl('Punishment', this.fb.control('', Validators.required));
      }
    } else {
      if (this.UpdateCaseForm.get('Punishment')) {
        this.UpdateCaseForm.removeControl('Punishment');
      }
    }
  }

  loadPillarData(firNumber: string, firRegDate: string, firShortNumber: string, policeCode: string) {
    this.addOtherPillarTab(firNumber, firRegDate, firShortNumber, policeCode);
  }
  tabCounter = 1;
  @ViewChild(TabContainerComponent) tabContainer!: TabContainerComponent;
  addOtherPillarTab(firNumber: string, firRegDate: string, firShortNumber: string, policeCode: string) {
    debugger
    this.modalService.close();
    this.loaderService.show();
    this.tabContainer.tabs = [];
    const TabTitle = `ICJS Pillars`;
    const TabData = {
      firNumber,
      firRegDate,
      firShortNumber,
      policeCode
    };
    const TabComponent = OtherPillarsComponent;
    this.otherPillarsServicesService?.setTabContainer(this.tabContainer);
    this.otherPillarsServicesService.addTab(TabTitle, TabComponent, TabData);
    this.ref.detectChanges();
  }
  ArrestedClickHandler(arrestedStatus: string) {
    console.log('Arrested Clicked with status:', arrestedStatus);
    console.log('Accused Data:', this.AccusedData);
    this.resetPaginator()
    this.loaderService.show();
    this.showPopup = true;
    this.popupData = [];
    this.AccusedDataPOPHeader = arrestedStatus === 'Arrested' ? 'Arrested Accused Details' : 'Not Arrested Accused Details';
    this.popupColumns = [
      { field: 'firnumber', header: 'FIR No' },
      { field: 'district', header: 'District' },
      { field: 'PS', header: 'Police Station' },
      { field: 'arrestName', header: 'Name' },
      { field: 'accusedAddress', header: 'Address' },
      { field: 'ARREST_SURRENDER_DT', header: 'ARREST DATE' },
      { field: 'CHARGSHEET_Status', header: 'CHARGSHEET(Y/N)' },
      { field: 'CHARGESHEET_DT', header: 'CHARGESHEET DATE' },
      { field: 'DaysPassed', header: 'Days Passed Since FIR/Arrest' }
    ];
    if (arrestedStatus === 'Arrested') {
      this.popupData = this.AccusedData.filter((item: any) => item.IsArrested === true || item.IsArrested === 'true');
    } else if (arrestedStatus === 'NotArrested') {
      this.popupData = this.AccusedData.filter((item: any) => item.IsArrested === false || item.IsArrested === 'false');
    } else if (arrestedStatus === 'All') {
      this.AccusedDataPOPHeader = 'Accused Details';
      this.popupData = this.AccusedData;
    }

    this.ref.detectChanges();
    this.loaderService.hide();
  }
  resetPaginator() {
    if (this.popupTable) {
      if (this.popupTable && this.popupTable.reset) {
        this.popupTable.reset();
      }
    }
  }
  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.selectedDistrictName = this.Districts.find(d => d.value === this.form.value.district)?.text || '';
    this.selectedPoliceStationName = this.policestations.find(ps => ps.value === this.form.value.psCode)?.text || '';
    const firNumber = this.form.value.firNumber;
    const firYear = this.form.value.year; // assuming it's in your form
    this.formattedFir = `${firNumber}/${firYear}`;
    this.loaderService.show();
    var data = this.form.getRawValue();
    this.psCode = data.psCode;
    this.UpdateCaseStatusService.SearchFir(data).subscribe(response => {
      debugger
      this.isLoaded = true;
      if (response.isSuccess) {
        debugger
        this.firdata = [];
        this.AccusedData = [];
        if (response.data) {
          try {
            const data = JSON.parse(response.data);
            this.AccusedData = data.AccusedData || [];
            this.firdata.push(data);
            this.extractFirRegNum(data);
            const firRegNum = data.firRegNum;
             this.loaderService.hide();
          }
          catch (err) {
            if (err instanceof Error) {
              this.loaderService.show();
              console.error("JSON parse error:", err.message);
            }
            else {
              this.loaderService.show();
              console.error("JSON parse error:", err);
            }
          }
        }
        else {
          this.loaderService.show();
          this.utilityService.ShowErrorPopup(response.message);
          console.warn("response.data is empty or undefined");
        }

      }
      else {
        this.utilityService.ShowErrorPopup(response.message);
        this.loaderService.show();
      }
    },
      (error: HttpErrorResponse) => {
        console.error('API error:', error);
        this.loaderService.hide();
      });

  }
  extractFirRegNum(data: any): void {
    this.UpdateCaseStatusService.GetPillarDataByFirNumber({ firRegNum: data.firRegNum }).subscribe((response) => {
      if (response.isSuccess) {
        this.otherPillarData = response.data.cnrs;
        this.cnrList = response.data.cnrs;
        this.firregnum = response.data.firregnum
        this.GetCourtDetailsList()
       
        this.isCaseUpdateTable = true;

      }
      else {
        this.utilityService.ShowErrorPopup(response.message);
        this.loaderService.hide();

      }
    });
  }

  GetCourtDetailsList() {
    this.UpdateCaseStatusService.CourtDetailsList().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.CountData = JSON.parse(response.data);

        }
      }
    );
  }
  onDelete(CNRNo: any): void {
    this.UpdateCaseStatusService.onDelete(CNRNo).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          debugger
          this.CountData = JSON.parse(response.data);
          this.GetCourtDetailsList();
        }
      }
    );
  }




  closePopup(): void {
    this.popupData = [];
    this.showPopup = false;
  }
  loadCaseInformation(data: string) {
    this.dynamicModelService.open(CourtComponent, data);
  }
  CaseStatusList(): void {
    this.UpdateCaseStatusService.getCaseStatusList().subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          this.CaseStatusTypes = response.data
            .filter((record: any) => record.caseStatus)
            .map((record: any) => ({
              value: record.caseStatus,
              display: record.caseStatus
            }));

        }
      },
      error: (err) => {
        console.error('Error fetching API URLs:', err);
        this.CaseStatusTypes = [];
      }
    });
  }


  onCaseSubmit() {
    this.firregnum = this.firregnum;
    if (!this.UpdateCaseForm.controls["selectedCnr"].value) {
      alert("Please select a CNR number.");
      return;
    }

    if (!this.UpdateCaseForm.controls["CaseStatusType"].value) {
      alert("Please Select Case Status.");
      return;
    }
    if (this.UpdateCaseForm.controls["CaseStatusType"].value === 'Convicted' && !this.UpdateCaseForm.controls["Punishment"].value) {
      alert("Please enter Punishment in Months for Convicted case.");
      return;
    }
    const formData = {
      DistrictCode: this.form.get('district')?.value,
      PoliceStationCode: this.form.get('psCode')?.value,
      FIRNumber: this.form.get('firNumber')?.value,
      FIRyear: this.form.get('year')?.value,
      caseStatusType: this.UpdateCaseForm.get('CaseStatusType')?.value,
      selectedCnr: this.UpdateCaseForm.get('selectedCnr')?.value,
      punishment: this.UpdateCaseForm.get('Punishment')?.value,
      Remarks: this.UpdateCaseForm.get('Remarks')?.value,
      firregnum: this.firregnum
    };
    this.UpdateCaseStatusService.createData(formData).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.message == 'SUCCESS') {
          Swal.fire({
            position: 'center',
            title: 'Record inserted successfully!',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400', color: '#ffffff'
          });
          this.GetCourtDetailsList();
          this.CaseStatusList();
          this.resetForm();
          this.isConvicted = false;

        }
        else if (response.result === -1 && response.message === 'UNSUCCESS') {
          Swal.fire({
            position: 'center',
            title: response.message || 'CNR Number already exists',
            icon: 'error',
            showConfirmButton: true,
            background: '#fff3cd',
            color: '#000000',
          });


        }

        else {
          // this.utilityService.ShowErrorPopup(response.message);
          Swal.fire({
            position: 'center',
            title: response.message || 'Something went wrong!',
            icon: 'error',
            showConfirmButton: true,
            background: '#fff3cd',
            color: '#000000',
          });
          this.resetForm();

        }
      },
      error: (err) => {
        Swal.fire({
          position: 'center',
          title: 'CNR Number already exists',
          icon: 'error',
          showConfirmButton: true,
          background: '#fff3cd',
          color: '#000000',
        });


      },
    });
  }
  resetForm() {
    this.UpdateCaseForm.controls["selectedCnr"].setValue('');
    this.UpdateCaseForm.controls["CaseStatusType"].setValue('');
    this.UpdateCaseForm.controls["Punishment"].setValue('');
    this.UpdateCaseForm.controls["Remarks"].setValue('');

  }
  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

}
