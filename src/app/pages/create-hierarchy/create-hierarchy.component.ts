import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '../services/utility.service';
import { LoaderService } from '../services/loader.service';
import { CreatehierarchyService } from '../services/createhierarchy.service';
import Swal from 'sweetalert2';
import { DropDownListModel } from '../models/drop-down-list-model';
export interface RangeDetailsModel {
  state: string;
  district: string;
  range_name: string;
  created_on: string | null;
}
@Component({
  selector: 'app-create-hierarchy',
  templateUrl: './create-hierarchy.component.html',
  styleUrl: './create-hierarchy.component.css'
})

export class CreateHierarchyComponent {

  formRange!: FormGroup;
  formSubDivision!: FormGroup;
  formRangeType!: FormGroup;
  settings = {};
  ListDistict: any[] = [];
  isSubmitted = false;
  Districts: any[] = [];
  policestations: any[] = [];
  Ranges: DropDownListModel[] = [];

  rangeList: any[] = [];
  subdivisionList: any[] = [];
  isLoading = false;
  sortOrder1: 'asc' | 'desc' = 'asc';
  totalRecords: number = 0;
  loading: boolean = false;
  sortField: string = 'Created_on';
  sortOrder: number = 1;
  constructor(
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private loaderService: LoaderService,
    private CreatehierarchyService: CreatehierarchyService,
  ) { }
  ngOnInit(): void {
    this.loaderService.show();
    this.formRangeType = this.formBuilder.group({
      searchType: ['Range'],
    });

    this.formRange = this.formBuilder.group({
      searchType: ['Range'],
      districtCodes: [null, Validators.required],
      Name: ['', Validators.required],
    });

    this.formSubDivision = this.formBuilder.group({
      searchType: ['Range'],
      Range: ['', Validators.required],
      District: ['', Validators.required],
      PsCodes: [null, Validators.required],
      SubDivision: ['', Validators.required],
      district: [''],
    });

    this.formRangeType.get('searchType')?.valueChanges.subscribe(type => {
      if (type === 'Range') {
        this.loadRanges('ASC');
        this.formRange.patchValue({       
           
        });
      } else if (type === 'SubDivision') {
        this.getAllRanges();
        this.formSubDivision.patchValue({
          District: ['']
        });
      }
    });

    this.BindDistricts();
    this.settings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      allowSearchFilter: true,
      maxHeight: 200
    };
    this.loaderService.hide();

  }

  get f(): { [key: string]: AbstractControl } {
    return this.formRange.controls;
  }

   get s(): { [key: string]: AbstractControl } {
    return this.formSubDivision.controls;
  }
  BindDistricts(): void {
    this.utilityService.LoadDistricts().subscribe({
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

  onDistrictChange(event: any): void {
    this.loaderService.show();
    const distcode = Number((event.target as HTMLSelectElement).value);
    if (distcode) {
      this.utilityService.PoliceStationNyaySetu(distcode.toString()).subscribe((data: any[]) => {
        this.policestations = data;
        this.loaderService.hide();
      });
    }
    else {
      this.policestations = [];
      this.loaderService.hide();
    }
  }

  getAllRanges() {
    this.CreatehierarchyService.getAllRanges().subscribe({
      next: (res) => {
        if (res.isSuccess && Array.isArray(res.data)) {
          this.Ranges = res.data.map((item: any) => ({
            value: item.ID,
            text: item.Range_name
          }));
        }
      },
      error: (err) => {
        this.utilityService.ShowErrorPopup(err);
      }
    });
  }


  loadRanges(event: any) {
    this.loading = true;
    const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
    this.CreatehierarchyService.getRangeDetails(sortOrder).subscribe({
      next: (res) => {
        if (res?.isSuccess) {
          this.rangeList = JSON.parse(res.data);
          this.totalRecords = this.rangeList.length;
        }
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  bindsubdivision(event: any) {
    this.loading = true;
    const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
    this.CreatehierarchyService.GetSubDivisionDetails(sortOrder).subscribe({
      next: (res) => {
        if (res?.isSuccess) {
          this.subdivisionList = JSON.parse(res.data);
          this.totalRecords = this.subdivisionList.length;
        }
        this.loading = false;
      },
      error: () => (this.loading = false),
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

  onSubdivision() {
    this.isSubmitted = true;

    if (this.formSubDivision.invalid) {
      return;
    }
    const formData = this.formSubDivision.value;
    const requestPayload = {
      District_cd: formData.District ? [+formData.District] : [],
      Ps_cd: (formData.PsCodes || []).map((p: any) => +p.value),
      Sub_division: formData.SubDivision,
      Range: formData.Range,
    };
    this.CreatehierarchyService.Createsubdivision(requestPayload).subscribe({
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
        this.bindsubdivision('ASC');
      },
      error: (err) => {
        this.utilityService.ShowErrorPopup(err);
      }
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.formRange.invalid) {
      return;
    }
    const formData = this.formRange.value;
    const requestPayload = {
      District_cd: (formData.districtCodes || []).map((d: any) => +d.value),
      DistrictName: (formData.districtCodes || []).map((d: any) => d.text),
      Range: formData.Name
    };

    this.CreatehierarchyService.Createhierarchy(requestPayload).subscribe({
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
        //this.formRange.reset();
        this.loadRanges('ASC');
      },
      error: (err) => {
        this.utilityService.ShowErrorPopup(err);
      }
    });
  }
}
