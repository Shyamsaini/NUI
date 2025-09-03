import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActsearchService } from '../services/actsearch.service';
import { ModalService } from '../services/modal.service';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { UtilityService } from '../services/utility.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { LoaderService } from '../services/loader.service';
interface PsCodeOption {
  text: string;
  value: string;
}
@Component({
  selector: 'app-actsearch',
  templateUrl: './actsearch.component.html',
  styleUrl: './actsearch.component.css'
})
export class ActsearchComponent {
  currentFirst: number = 1;
  currentLast: number = 10;

  SecondListFirst: number = 1;
  SecondListLast: number = 10;

  isActDetailTable: boolean = false;
  isActSecondTable: boolean = false;
  isActThirdTable: boolean = false;
  totalRecords: number = 0;
  totalCountRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 0;
  ActWiseCountList: any;
  ActWiseList: any;
  policestations: any[] = [];
  actList: any[] = [];
  ListDistict: any[] = [];
  isSubmitted = false;
  BackPage: boolean = false;
  loading: boolean = false;
  headerText: string = '';
  columns: string[] = [];

  errorMessage: string = '';
  settings = {};
  Henioussettings = {};
  form!: FormGroup;
  ActWiseCountForm!: FormGroup;
  ActPSWiseListForm!: FormGroup;

  isDropdownChanged: boolean = false;
  HeniousList: any;
  isBtnDisabled: boolean = false;
  constructor(private renderer: Renderer2, private apiservice: ActsearchService, private el: ElementRef,
    protected modalService: ModalService, private utilityService: UtilityService, private formBuilder: FormBuilder,
    private dynamicModelService: DynamicModalService, private loaderService: LoaderService

  ) {

  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      Mobile: [''],
      districtCodes: [null, Validators.required],
      PsCds: [null, Validators.required],
      actName: [null, Validators.required],
    });
    this.BindDistricts();
    this.HeniousList = [
      // { value: "", text: 'Select' },
      { value: "All", text: 'All' },
      { value: "Y", text: 'Henious' },
      { value: "N", text: 'Non Henious' }
    ];
    this.Henioussettings = {
      singleSelection: true,      
      idField: 'value',
      textField: 'text',
      allowSearchFilter: false     
    };
    this.settings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      allowSearchFilter: true,
      maxHeight: 200
    };
    this.ActWiseCountForm = this.formBuilder.group({
      PageNumber: [null, Validators.required],
      PageSize: [null, Validators.required],
      MajorHeadCode: [null, Validators.required],
      PSCodes: [null, Validators.required]
    });
    this.ActPSWiseListForm = this.formBuilder.group({
      PageNumber: [null, Validators.required],
      PageSize: [null, Validators.required],
      MajorHeadCode: [null, Validators.required],
      PS_CD: [null, Validators.required],
      ACTTYPE: [null, Validators.required]
    });
    this.onSubmit();
  }

  @ViewChild('dropdownRef', { static: false }) dropdownRef: ElementRef | undefined;

  get actNameControl() {
    return this.form.get('actName');
  }

  BindDistricts(): void {
   //this.apiservice.LoadDistricts().subscribe({
   this.utilityService.LoadDistricts().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          this.ListDistict = response.data;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No data available for Nyaay Shuruti.';
          this.ListDistict = [];
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.ListDistict = [];
      },
    });
  }
  onDistrictDropdownChange(event: any): void {
    if (this.form) {
      const formValues = this.form.getRawValue();
      if (Array.isArray(formValues.districtCodes)) {
        const districtCodes = formValues.districtCodes.map((item: { value: any; }) => parseInt(item.value));
       // this.apiservice.LoadPoliceStations(districtCodes).subscribe((data: any) => {
        this.utilityService.LoadPoliceStationsList(districtCodes).subscribe((data: any) => {
          if (data.isSuccess) {
            this.policestations = data.data;
          }
        });
      } else {
      }
    } else {
    }
  }
  onpolicestationsDropdownChange(event: any): void {
    if (this.form) {
      const formValues = this.form.getRawValue();
      if (Array.isArray(formValues.PsCds)) {
        const policestationsCodes = formValues.PsCds.map((item: { value: any; }) => parseInt(item.value));
      } else {
      }
    } else {
    }
  }
  isDropdownOpen = false;


  onActDropdownChange(event: any): void {

    if (this.form) {

      const formValues = this.form.getRawValue();
      if (Array.isArray(formValues.actName)) {
        const actNameCodes = formValues.actName.map((item: { value: any; }) => parseInt(item.value));
        this.isDropdownChanged = true;
      } else {
        this.isDropdownChanged = false;
      }
    } else {
      this.isDropdownChanged = false;
    }
  }
  onCrimeTypeDropdownChange(event: any) {
    const selectedCrimeType = event.target.value;
    if (selectedCrimeType != "") {
      this.BindGetMAJORHEAD(selectedCrimeType);
    }
    else {
      this.actList = [];
    }
  }

  BindGetMAJORHEAD(HeniousType: any): void {

    this.apiservice.GetMajorHeadList(HeniousType).subscribe({
      next: (response) => {
        const parsedData = JSON.parse(response.data);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          this.actList = parsedData.map((item: any) => ({
            value: item.ACT_CD,
            text: item.ACT_LONG
          }));
          this.errorMessage = '';
        } else {
          this.actList = [];
          this.errorMessage = 'No data available.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.actList = [];
      },
    });
  }
  totalZeroFirDetails() {
    this.isActDetailTable = true;
    this.isActSecondTable = false;
    this.isActThirdTable = false;
  }

  onSubmit() {
    this.isBtnDisabled = true;
    this.loaderService.show();
    this.BackPage = false;
    this.isActDetailTable = true;
    this.isActSecondTable = false;
    this.isActThirdTable = false;
    const psCodeArray: PsCodeOption[] = this.form.controls["PsCds"].value || [];
    const psCodeValues = psCodeArray.length > 0 ? psCodeArray.map((item: PsCodeOption) => Number(item.value)) : [];
    const actNameCodes: PsCodeOption[] = this.form.controls["actName"].value || [];
    const ActNameCodes = actNameCodes.length > 0 ? actNameCodes.map((item: PsCodeOption) => Number(item.value)) : [];
    this.ActWiseCountForm.patchValue({
      PageNumber: 1,
      PageSize: 10,
      MajorHeadCode: ActNameCodes,
      PSCodes: psCodeValues
    });
    this.apiservice.LoadActWiseCount(this.ActWiseCountForm.value).subscribe({

      next: (response: any) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          try {
            this.ActWiseCountList = JSON.parse(response.data); 
            this.totalCountRecords = JSON.parse(response.count);
            this.currentLast = 10;
            this.loaderService.hide();
            this.isBtnDisabled = false;
          } catch (error) {
            this.loaderService.hide();
          }
        }
        else {
          this.errorMessage = 'No data availaible.';
          this.ActWiseCountList = [];
          this.loaderService.hide();
        }
      }
    });
  }

  loadFirstReports(event: TableLazyLoadEvent) {
    const pagesize = event.rows ?? 10;
    const first = event.first ?? 0;
    const pageNumber = Math.floor(first / pagesize) + 1;
    const pageSize = pagesize;
    this.currentFirst = first + 1;
    this.currentLast = first + pageSize > this.totalRecords ? this.totalRecords : first + pageSize;
    this.loaderService.show();
    this.ActWiseCountForm.patchValue({
      PageNumber: pageNumber,
      PageSize: pageSize
    });
    this.apiservice.LoadActWiseCount(this.ActWiseCountForm.value).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          try {
            this.ActWiseCountList = JSON.parse(response.data);
            this.totalCountRecords = JSON.parse(response.count);
            this.loaderService.hide();
          } catch (error) {
            this.loaderService.hide();
          }
        }
        else {
          this.errorMessage = 'No data availaible.';
          this.ActWiseCountList = [];
          this.loaderService.hide();
        }
      }
    });
  }
  openpsComponent(cino: string) {
    const actNameCodes: PsCodeOption[] = this.form.controls["actName"].value || [];
    const ActNameCodes = actNameCodes.length > 0 ? actNameCodes.map((item: PsCodeOption) => Number(item.value)) : [];
    this.loaderService.show();
    this.ActPSWiseListForm.patchValue({
      PageNumber: 1,
      PageSize: 10,
      MajorHeadCode: ActNameCodes,
      PS_CD: cino,
      ACTTYPE: "FIR"
    });

    this.apiservice.LoadActPSWiseList(this.ActPSWiseListForm.value).subscribe({
      next: (response: any) => {

        if (response.isSuccess && response.data && response.data.length > 0) {
          try {
            if (JSON.parse(response.data).length != 0) {
              this.ActWiseList = JSON.parse(response.data);
              this.isActSecondTable = true;
              this.isActDetailTable = false;
              this.isActThirdTable = false;
              this.BackPage = true;
              this.totalRecords = JSON.parse(response.count);
              this.headerText = "Total FIR";
              if (this.ActWiseList.length > 0) {
                this.columns = Object.keys(this.ActWiseList[0]); 
              }
              this.loaderService.hide();
            }
            else {
              this.loaderService.hide();
            }
          } catch (error) {
            this.loaderService.hide();
          }
        }
        else {
          this.errorMessage = 'No data availaible.';
          this.ActWiseList = [];
          this.loaderService.hide();
        }
      }
    });
  }
  openAccusedComponent(cino: string) {
    const actNameCodes: PsCodeOption[] = this.form.controls["actName"].value || [];
    const ActNameCodes = actNameCodes.length > 0 ? actNameCodes.map((item: PsCodeOption) => Number(item.value)) : [];

    this.loaderService.show();
    this.ActPSWiseListForm.patchValue({
      PageNumber: 1,
      PageSize: 10,
      MajorHeadCode: ActNameCodes,
      PS_CD: cino,
      ACTTYPE: "ACC"
    });
    this.apiservice.LoadActPSWiseList(this.ActPSWiseListForm.value).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          try {
            if (JSON.parse(response.data).length != 0) {
              this.ActWiseList = JSON.parse(response.data);
              this.isActSecondTable = false;
              this.isActDetailTable = false;
              this.isActThirdTable = true;
              this.BackPage = true;
              this.totalRecords = JSON.parse(response.count);
              this.headerText = "Total Accused ";
              this.loaderService.hide();
            }
            else {
              this.loaderService.hide();
            }
          } catch (error) {
            this.loaderService.hide();
          }
        }
        else {
          this.errorMessage = 'No data availaible.';
          this.ActWiseList = [];
          this.loaderService.hide();
        }
      }
    });
  }
  openArrestComponent(cino: string) {
    const actNameCodes: PsCodeOption[] = this.form.controls["actName"].value || [];
    const ActNameCodes = actNameCodes.length > 0 ? actNameCodes.map((item: PsCodeOption) => Number(item.value)) : [];
    this.loaderService.show();
    this.ActPSWiseListForm.patchValue({
      PageNumber: 1,
      PageSize: 10,
      MajorHeadCode: ActNameCodes,
      PS_CD: cino,
      ACTTYPE: "ARR"
    });
    this.apiservice.LoadActPSWiseList(this.ActPSWiseListForm.value).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          try {
            if (JSON.parse(response.data).length != 0) {
              this.ActWiseList = JSON.parse(response.data);
              this.isActSecondTable = false;
              this.isActDetailTable = false;
              this.isActThirdTable = true;
              this.BackPage = true;
              this.totalRecords = JSON.parse(response.count);
              this.headerText = "Total Arrest ";
              this.loaderService.hide();
            }
            else {
              this.loaderService.hide();
            }
          } catch (error) {
            this.loaderService.hide();
          }
        }
        else {
          this.errorMessage = 'No data availaible.';
          this.ActWiseList = [];
          this.loaderService.hide();
        }
      }
    });
  }
  fnback() {
    this.isActDetailTable = true;
    this.isActSecondTable = false;
    this.isActThirdTable = false;
    this.BackPage = false;
  }
  loadReports(event: TableLazyLoadEvent) {
    //;
    const pagesize = event.rows ?? 10;
    const first = event.first ?? 0;
    const pageNumber = Math.floor(first / pagesize) + 1;
    const pageSize = pagesize;
    this.SecondListFirst = first + 1;
    this.SecondListLast = first + pageSize > this.totalRecords ? this.totalRecords : first + pageSize;
    this.loaderService.show();
    this.ActPSWiseListForm.patchValue({
      PageNumber: pageNumber,
      PageSize: pageSize
    });
    this.apiservice.LoadActPSWiseList(this.ActPSWiseListForm.value).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          try {
            if (JSON.parse(response.data).length != 0) {
              this.ActWiseList = JSON.parse(response.data);
              this.isActSecondTable = true;
              this.isActDetailTable = false;
              this.isActThirdTable = false;
              this.BackPage = true;
              this.totalRecords = JSON.parse(response.count);
              this.loaderService.hide();
            }
            else {
              this.loaderService.hide();
            }
          } catch (error) {
            this.loaderService.hide();
          }
        }
        else {
          this.errorMessage = 'No data availaible.';
          this.ActWiseList = [];
          this.loaderService.hide();
        }
      }
    });
  }
  loadDataReports(event: TableLazyLoadEvent) {
    const pagesize = event.rows ?? 10;
    const first = event.first ?? 0;
    const pageNumber = Math.floor(first / pagesize) + 1;
    const pageSize = pagesize;
    this.SecondListFirst = first + 1;
    this.SecondListLast = first + pageSize > this.totalRecords ? this.totalRecords : first + pageSize;
    this.loaderService.show();
    this.ActPSWiseListForm.patchValue({
      PageNumber: pageNumber,
      PageSize: pageSize
    });
    this.apiservice.LoadActPSWiseList(this.ActPSWiseListForm.value).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          try {
            if (JSON.parse(response.data).length != 0) {
              this.ActWiseList = JSON.parse(response.data);
              this.isActSecondTable = false;
              this.isActDetailTable = false;
              this.isActThirdTable = true;
              this.BackPage = true;
              this.totalRecords = JSON.parse(response.count);
              this.loaderService.hide();
            }
            else {
              this.loaderService.hide();
            }
          } catch (error) {
            this.loaderService.hide();
          }
        }
        else {
          this.errorMessage = 'No data availaible.';
          this.ActWiseList = [];
          this.loaderService.hide();
        }
      }
    });
  }
}
