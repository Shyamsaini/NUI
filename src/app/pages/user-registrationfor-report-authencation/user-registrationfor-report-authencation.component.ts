import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UtilityService } from '../services/utility.service';
import { ReportAuthorizationService } from '../services/report-authorization.service';
import { CreatehierarchyService } from '../services/createhierarchy.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
export interface DropdownOption {
  value: number;
  text: string;
}



export interface ModuleAssignUpdateRequestModel {
  StateCode: number;
  DistrictCode: number;
  PsCode: number;
  block: boolean;
  ReportName: string[];
  MobileNumber: string;
}

@Component({
  selector: 'app-user-registrationfor-report-authencation',
  templateUrl: './user-registrationfor-report-authencation.component.html',
  styleUrls: ['./user-registrationfor-report-authencation.component.css']
})
export class UserRegistrationforReportAuthencationComponent {

  isLoaded = false;
  isSubmitted = false;
  firdata: any = [];
  form!: FormGroup;
  fg!: FormGroup;
  nameQuery: string = '';
  nameSuggestions: any[] = [];
  policestations: any[] = [];
  ListDistict: any[] = [];
  errorMessage: string = '';
  settings = {};
  selectedPerson: any;
  states: any[] = [];
  isOtpButton: boolean = false;
  selectedStateCode: number = 0;
  selectedType: 'state' | 'district' | 'police' = 'state';
  //suggestions: string[] = []
  suggestions: any[] = [];
  suggestionsUserDetails: any[] = [];
  moduleAssignList: any[] = [];
  Name: string = '';
  selectedRows: any[] = [];
  isModuleChecked = false;
  moduleAssignColumns: any[] = [];
  selectedModules: any[] = [];
  selectedModule: string | null = null;
  userLevel: any;
  Ranges: any[] = [];
  Subdivision: any[] = [];
  Districts: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilityService: UtilityService,
    private ReportAuthorizationService: ReportAuthorizationService,
    private CreatehierarchyService: CreatehierarchyService,
  ) { }
  ListReport: DropdownOption[] = [
    { value: 1, text: 'FSL' },
    { value: 2, text: 'Prosecution' },
    { value: 3, text: 'eSakshaya' }
  ];

  UserType: DropdownOption[] = [
    { value: 1, text: 'Admin' },
    { value: 2, text: 'Normal' }
  ];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      searchType: ['state'],
      districtCodes: [null],
      modulename: [null],
      PsCodes: [null],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', Validators.required],
      ReportName: [[], Validators.required],
      userType: ['', Validators.required],
      Range: [''],
      SubDivision: [''],
    });

    this.fg = this.formBuilder.group({
      districtCodes: [null],
      PsCodes: [null],
      state: ['', Validators.required],
      ReportName: [[], Validators.required],
      buttonType: [''],
      MobileNumber: [''],
    });
    this.BindDistricts();
    this.getAllRanges();
    this.settings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      allowSearchFilter: true,
      maxHeight: 200
    };
    const stateCode = localStorage.getItem('stateCode') ?? '';
    this.authService.getStates().subscribe((data: any[]) => {
      this.states = data.filter(state => state.StateCode === stateCode);
    });
    this.form.get('Name')?.valueChanges.subscribe(val => {
      if (!val) {
        this.suggestions = [];
      }
    });
    this.utilityService.LoadUserDetails().subscribe(response => {
      this.userLevel = response[0].useR_LEVEL || '';
      if (['state', 'district', 'police', 'superadmin', 'range', 'subdivision'].includes(this.userLevel)) {
        this.form.get('searchType')?.setValue(this.userLevel);
      }
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmit(): void {
    debugger;
    const formData = this.form.value;
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.clearValidators();
      control?.setErrors(null);
    });
    const searchTypeRequiredFields: { [key: string]: string[] } = {
      state: ['state', 'userType'],
      district: ['state', 'districtCodes', 'userType'],
      police: ['state', 'districtCodes', 'PsCodes', 'userType'],
      subdivision: ['state', 'Range', 'SubDivision', 'userType'],
      range: ['state', 'Range', 'userType'],
    };

    const requiredFields = searchTypeRequiredFields[formData.searchType] || [];

    let hasValidationError = false;
    requiredFields.forEach(field => {
      const value = formData[field];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        this.form.get(field)?.setValidators(Validators.required);
        hasValidationError = true;
      }
    });

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.updateValueAndValidity();
      control?.markAsTouched();
    });

    if (hasValidationError || this.form.invalid) {
      this.utilityService.ShowErrorPopup(`Please fill all required fields for "${formData.searchType}" search.`);
      return;
    }
    this.isSubmitted = true;
    const requestPayload = {
      Mobile: String(formData.Name?.MOBILE_1 ?? ''),
      State: formData.state,
      DistrictCodes: (formData.districtCodes || []).map((d: any) => +d.value),
      PsCodes: (formData.PsCodes || []).map((p: any) => +p.value),
      DistrictName: (formData.districtCodes || []).map((d: any) => d.text),
      PsName: (formData.PsCodes || []).map((p: any) => p.text),
      ReportNames: [],
      UserType: formData.userType,
      UserLevel: formData.searchType,
      Range: formData.Range,
      SubDivision: formData.SubDivision,
    };

    this.ReportAuthorizationService.ModuleAssign(requestPayload).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            position: 'top-end',
            title: response.message,
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400',
          });
        } else {
          this.utilityService.ShowErrorPopup(response.message);
        }
        this.loadModuleAssignData(String(formData.Name?.MOBILE_1));
      },
      error: (err) => {
        this.utilityService.ShowErrorPopup(err);
      }
    });
  }


  getAllRanges() {
    this.CreatehierarchyService.getAllRanges().subscribe({
      next: (response: { isSuccess: any; data: any[]; }) => {
        if (response.isSuccess && Array.isArray(response.data)) {
          this.Ranges = response.data.map((item: any) => ({
            value: item.ID,
            text: item.Range_name
          }));
        }
      },
      error: (err: any) => {
        this.utilityService.ShowErrorPopup(err);
      }
    });
  }


  BindSubDivision(event: Event): void {
    const selecteddistrict = +(event.target as HTMLSelectElement).value;
    this.CreatehierarchyService.getSubDivision(selecteddistrict).subscribe({
      next: (response: { isSuccess: any; data: any[]; }) => {
        if (response.isSuccess && Array.isArray(response.data)) {
          this.Subdivision = response.data.map((item: any) => ({
            value: item.SubdivisionID,
            text: item.SubdivisionName
          }));
        }
      },
      error: (err: any) => {
        this.utilityService.ShowErrorPopup(err);
      }
    });
  }

  BindDistricts(): void {
    this.utilityService.LoadDistricts().subscribe({
      //this.IodashboardService.LoadDistricts().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          this.ListDistict = response.data;
        } else {
          this.ListDistict = [];
        }
      },
      error: (err) => {
        this.utilityService.ShowErrorPopup(err);
      },
    });
  }

  onDistrictDropdownChange(event: any): void {
    const formValues = this.form.getRawValue();
    if (Array.isArray(formValues.districtCodes)) {
      const districtCodes = formValues.districtCodes.map((item: { value: any; }) => parseInt(item.value));
      // this.IodashboardService.getPoliceStation(districtCodes).subscribe((data: any) => {
      this.utilityService.LoadPoliceStationsList(districtCodes).subscribe((data: any) => {
        if (data.isSuccess) {
          this.policestations = data.data;
        }
      });
    } else {
      console.error('districtCodes is not an array');
    }
  }


  onModuleCheckboxChange(row: any, event?: any): void {
    const isChecked = event ? event.target.checked : !this.isRowSelected(row);
    row.moduleChecked = isChecked;
    if (isChecked) {
      this.fg.patchValue({
        districtCodes: row.DISTRICT_CD,
        PsCodes: row.PS_CD,
        state: row.STATE_CD,
        MobileNumber: row.MOBILE_NO
      });
    }
    this.selectedModules = this.moduleAssignList.filter(x => x.moduleChecked);
    this.isModuleChecked = this.selectedModules.length > 0;
  }

  readonly HIDDEN_COLUMNS = ['STATE_CD', 'DISTRICT_CD', 'PS_CD', 'BLOCK'];

  loadModuleAssignData($event: any): void {
    const formData = this.form.value;
    const mobileNumber = String(formData.Name?.MOBILE_1);
    const fullNumber = mobileNumber.slice(-10);
    this.Name = String(formData.Name?.FullName);
    this.authService.SearchByName(fullNumber).subscribe({
      next: (response: any) => {
        const parsedData = JSON.parse(response.data);  // Parse once
        if (parsedData && parsedData.length > 0) {
          this.suggestionsUserDetails = parsedData.map((person: any) => ({
            PS_STAFF_CD: person.PS_STAFF_CD,
            PERSON_CODE: person.PERSON_CODE,
            STATE: person.STATE,
            DISTRICT: person.DISTRICT,
            PS: person.PS,
            BELTNO: person.BELTNO,
            ROLE: person.ROLE,
            MOBILE_1: person.MOBILE_1,
            FullName: person.FullName
          }));
        } else {
          this.suggestionsUserDetails = [];
        }
      },
      error: (err) => {
        this.utilityService.ShowErrorPopup(err);
        this.suggestions = [];
      }
    });

    this.ReportAuthorizationService.getModuleAssignList(mobileNumber).subscribe({

      next: (res) => {
        if (res.isSuccess) {
          this.moduleAssignList = res.data;
          if (this.moduleAssignList.length > 0) {
            const excludedColumns = ['STATE_CD', 'DISTRICT_CD', 'PS_CD', 'BLOCK'];
            this.moduleAssignColumns = Object.keys(this.moduleAssignList[0])
              .filter(key => !excludedColumns.includes(key))
              .map(key => ({
                field: key,
                header: this.formatHeader(key)
              }));
          }
        } else {
          this.moduleAssignList = [];
        }
      },
      error: (err) => {
        this.utilityService.ShowErrorPopup(err);
        this.moduleAssignList = [];
      }
    });
  }
  loadDistricts(event: Event): void {
    const selectedRange = +(event.target as HTMLSelectElement).value;
    if (selectedRange) {
      this.CreatehierarchyService.getDistrictsByRange(selectedRange).subscribe({
        next: (res) => {
          if (res.isSuccess && Array.isArray(res.data)) {
            this.Districts = res.data.map((item: any) => ({
              value: item.value,
              text: item.text
            }));
          } else {
            this.Districts = [];
          }
        },
        error: (err) => {
          this.utilityService.ShowErrorPopup(err);
          this.Districts = [];
        }
      });
    } else {
      this.Districts = [];
    }
  }



  formatHeader(key: string): string {
    return key.replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toUpperCase();
  }
  getBrands($event: any) {
    this.authService.SearchByName($event.query).subscribe({
      next: (response: any) => {
        const parsedData = JSON.parse(response.data);  // Parse once
        if (parsedData && parsedData.length > 0) {
          this.suggestions = parsedData.map((person: any) => ({
            PS_STAFF_CD: person.PS_STAFF_CD,
            PERSON_CODE: person.PERSON_CODE,
            STATE: person.STATE,
            DISTRICT: person.DISTRICT,
            PS: person.PS,
            BELTNO: person.BELTNO,
            ROLE: person.ROLE,
            MOBILE_1: person.MOBILE_1,
            FullName: person.FullName
          }));
        } else {
          this.suggestions = [];
        }
      },
      error: (err) => {
        this.suggestions = [];
      }
    });
  }

  onSubmitSelected(): void {
    const psCodeArray: DropdownOption[] = this.form.controls["ReportName"].value || [];
    const textValues = psCodeArray.map(item => item.text);
    this.fg.patchValue({
      buttonType: 'Assign',
      ReportName: textValues
    });
    if (this.selectedRows && this.selectedRows.length > 0) {
    } else {
      this.utilityService.ShowErrorPopup('Please select at least one row');
    }
  }

  onAssignModule(): void {
    const reportControl = this.form.get("ReportName");
    let reportNames = [];
    if (reportControl && reportControl.value) {
      const reportValue = Array.isArray(reportControl.value) ? reportControl.value : [reportControl.value];
      reportNames = reportValue.filter(item => item && (item.text || item.value)).map(item => item.text || String(item.value));
    }
    const formData = this.fg.value;
    const requestPayload = {
      stateCode: formData.state,
      districtCode: formData.districtCodes,
      psCode: formData.PsCodes,
      reportName: reportNames,
      buttonType: 'Assign',
      mobileNumber: String(formData.MobileNumber)
    };
    this.ReportAuthorizationService.UpdateModuleAssign(requestPayload).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          Swal.fire({
            position: 'top-end',
            title: response.message,
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400',
          });
        } else {
          this.utilityService.ShowErrorPopup('Failed to Update Module Assignment');

        }
        this.loadModuleAssignData(String(formData.MobileNumber));
      },
      error: (error) => {
        this.utilityService.ShowErrorPopup(error);
      }
    });
  }

  onHeaderCheckboxToggle(event: any): void {
    const isChecked = event.checked;
    this.moduleAssignList.forEach(row => {
      if (!row.BLOCK) {
        row.moduleChecked = isChecked;
      }
    });

    this.selectedRows = isChecked
      ? this.moduleAssignList.filter(row => !row.BLOCK)
      : [];
    this.selectedModules = this.moduleAssignList.filter(row => row.moduleChecked);
    this.isModuleChecked = this.selectedModules.length > 0;
  }



  isRowChecked(row: any): boolean {
    const isBlocked = row.BLOCK === true || row.BLOCK === 'true';
    return isBlocked || this.isRowSelected(row);
  }

  getSelectedValues(): ModuleAssignUpdateRequestModel[] {
    return this.selectedRows.map(row => ({
      StateCode: row.STATE_CD,
      DistrictCode: row.DISTRICT_CD,
      PsCode: row.PS_CD,
      block: this.isRowSelected(row),
      ReportName: row['MODULE NAME']?.split(',') || [],
      MobileNumber: row.MOBILE_NO

    }));
  }

  submitSelectedModules() {
    const selectedData = this.getSelectedValues();
    if (selectedData.length === 0) {
      this.utilityService.ShowErrorPopup('Please select at least one row');
      return;
    }
    const mobileNumber = selectedData[0].MobileNumber;
    forkJoin(
      selectedData.map(data => this.ReportAuthorizationService.UpdateModuleAssign(data))
    ).subscribe({
      next: (responses) => {
        const allSuccess = responses.every(r => r.isSuccess);
        if (allSuccess) {
          Swal.fire({
            position: 'top-end',
            title: 'Record updated successfully.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400',
          });
          this.loadModuleAssignData(mobileNumber);
        } else {
          this.utilityService.ShowErrorPopup('Failed to Update Module Assignment');
        }
      },
      error: (err) => {
        this.loadModuleAssignData(mobileNumber);
      }
    });
  }
  hasBlockedRows(): boolean {
    return this.moduleAssignList?.every(row => row.BLOCK) || false;
  }




  isAllSelected(): boolean {
    const selectable = this.moduleAssignList?.filter(r => !r.BLOCK) || [];
    return (
      selectable.length > 0 &&
      selectable.every(r =>
        this.selectedRows.some(sel => sel.PS_CD === r.PS_CD)
      )
    );
  }

  hasOnlyBlockedRows(): boolean {
    return this.moduleAssignList?.every(row => row.BLOCK) || false;
  }

  isRowSelected(row: any): boolean {
    return this.selectedRows.some(r => r.PS_CD === row.PS_CD);
  }
}
