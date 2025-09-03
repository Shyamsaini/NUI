import { Component, OnInit } from '@angular/core';
import { BaseResponseModel, DropDownListModel } from '../models/drop-down-list-model';
import { SearchcaseService  } from '../services/searchcase.service';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { CaseInfo } from '../models/case-info';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-searchcase',
  templateUrl: './searchcase.component.html',
  styleUrl: './searchcase.component.css'
})
export class SearchcaseComponent implements OnInit {
  CourtComplex: DropDownListModel[] = [];
  selectedItem: string | null = null;
  selectedCaseStatusItem:string | null=null;
  selectedActItem:string |null=null;
  CaseType: DropDownListModel[] = [];  
  selectedSearchBy: string = 'CaseNumber'; 
  SearchCasesData: CaseInfo[]=[];
  selectedSubItem:  string | null = null;
  Act: DropDownListModel[] = [];
  SearchCases: boolean = false;
  CourtComplexValues: string = ''; 
  CasetypeValues: string = ''; 
  caseNumber: string = ''; 
  year: string = ''; 
  CaseStatus: any;
  isDivVisible = false;
  isSubmitted = false;
  courtComplexSubscription: any;
  formBuilder: any;
 
  constructor(private searchcaseService: SearchcaseService) { 
    this.courtComplexSubscription = this.form.get('CourtComplex')?.valueChanges.subscribe(selectedValue => {
      if (selectedValue) {
        this.loadCasetype(selectedValue);
      } else {
        this.CaseType = [];
      }
    });
  }


  ngOnInit(): void {
    this.bindCourtComplex();
    this. loadAct();
    this.GetCaseJudgementTypes();
    this.form = this.formBuilder.group({
      CourtComplex: [null],
      CaseType: [null],
      caseNumber: [''],
      year: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
      CaseStatus: [null],
      Act: [null]
    });

    // Subscribe to value changes
    this.form.get('CourtComplex')?.valueChanges.subscribe(selectedValue => {
      if (selectedValue) {
        this.loadCasetype(selectedValue);
      } else {
        this.CaseType = []; 
      }
    });

    

  }


  loadCasetype(selectedValue: string): void {
    this.searchcaseService.getSubDropDownList(selectedValue).subscribe(
      (response: any) => {
        if (response.isSuccess && response.data) {
          this.CaseType = response.data;
          // Optionally reset CaseType form control value if needed
          this.form.get('CaseType')?.setValue(null);
        } else {
          console.warn('No data received or operation was not successful', response);
          this.CaseType = [];
        }
      },
      (error) => {
        console.error('Error fetching sub-dropdown data', error);
        this.CaseType = [];
      }
    );
  }


  gridApi!: GridApi;
  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },
    pagination: true,
    paginationPageSize: 20,
    onGridReady: this.onGridReady.bind(this),
  };
  
   columnDefs: ColDef[] = [
     { headerName: 'S.No', valueGetter: "node.rowIndex + 1", width: 80 },
     {
      headerName: 'CNR',
      field: 'cino',
      flex: 1,
      cellRenderer: (params: { value: any; }) => {
        const cnrValue = params.value;
        return `<a href="javascript:void(0)" class="open-modal-link" data-cnr="${cnrValue}">${cnrValue}</a>`;
      }
    },    
     { headerName: 'Case Type', field: 'type_name', flex: 1 },
     { headerName: 'Filing Number', field: 'reg_no', flex: 1 },
     { headerName: 'Year', field: 'reg_year', flex: 1 },
     { headerName: 'Petitioner', field: 'pet_name', flex: 1 },
     { headerName: 'Respondent', field: 'res_name', flex: 1 }    
   ];


   selectedCNR: string | null = null;

  
  isSearchByCaseNumber(): boolean {
    return this.form.get('selectedSearchBy')?.value === 'CaseNumber';
  }

  isSearchFilingNumber(): boolean {
    return this.form.get('selectedSearchBy')?.value === 'FilingNumber';
  }

  isSearchByAct(): boolean {
    return this.form.get('selectedSearchBy')?.value === 'Act';
  }

  isSearchByPartyName(): boolean {
    return this.form.get('selectedSearchBy')?.value === 'PartyName';
  }


   form: FormGroup = new FormGroup({
    CourtComplex: new FormControl(''),
    CaseType: new FormControl(''),   
    caseNumber: new FormControl(''),
    CaseStatus: new FormControl(''),    
    Act: new FormControl(''),
    year: new FormControl(''),
    selectedSearchBy: new FormControl('')  
  });

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi?.sizeColumnsToFit();
  }

  onQuickFilter(event: any) {
    if (this.gridApi) {
      const filterValue = event.target.value;
      this.gridApi.getFilterInstance('prisoner_name', (filterInstance) => {
        filterInstance?.setModel({ type: 'contains', filter: filterValue });
        this.gridApi?.onFilterChanged();
      });
    }
  }

  splitText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
  onSearchByChange(event: Event): void {
    this.selectedItem = null;  
    this.selectedSubItem=null;
    this.CaseType = []; 
    this.caseNumber=''; 
    this.year='';
    this.SearchCasesData = [];

    const selectedValue = (event.target as HTMLInputElement).value;
    this.form.get('selectedSearchBy')?.setValue(selectedValue);
  }


  bindCourtComplex(): void {
    this.searchcaseService.getDropDownList().subscribe(
      (data: DropDownListModel[]) => {
        this.CourtComplex = data;
      },
      (error) => {
        console.error('Error fetching dropdown data', error);
      }
    );
  }


  

  onSearchClick(): void {
    // Retrieve values from the form controls
    const est_code = this.form.get('CourtComplex')?.value ?? '';
    const case_type = this.form.get('CaseType')?.value ?? '';
    const reg_no = this.form.get('caseNumber')?.value ?? '';
    const reg_year = this.form.get('year')?.value ;
    const pend_disp = this.form.get('CaseStatus')?.value ?? '';
    const national_act_code = this.form.get('Act')?.value ?? '';
    
  
    this.isDivVisible = !this.isDivVisible;
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.selectedSearchBy === 'CaseNumber') {
      this.searchcaseService.getSearchByCaseNumber(est_code, case_type, reg_no, reg_year)
      .subscribe(
        (resp: any) => {
          if (resp) {
            console.log('API Response:', resp);
            this.handleApiResponse(resp);
          } else {
            console.error('No response received');
          }
        },
        (error) => {
          console.error('API error:', error);
        }
      );
    } else if (this.selectedSearchBy === 'FilingNumber') {
      this.searchcaseService.getSSearchByFilingNumber(est_code, case_type, reg_no, reg_year).subscribe(
        (resp: any) => this.handleApiResponse(resp),
        (error) => console.error('API error:', error)
      );
    } else if (this.selectedSearchBy === 'Act') {
      this.searchcaseService.getSearchByAct(est_code, pend_disp, national_act_code, reg_year).subscribe(
        (resp: any) => this.handleApiResponse(resp),
        (error) => console.error('API error:', error)
      );
    } else if (this.selectedSearchBy === 'PartyName') {
      this.searchcaseService.getSearchByPartyName(est_code, pend_disp, reg_no, reg_year).subscribe(
        (resp: any) => this.handleApiResponse(resp),
        (error) => console.error('API error:', error)
      );
    }
  }
  
  private handleApiResponse(resp: any): void {
    this.SearchCasesData = [];
  
    if (resp.data) {
      try {
        const jsonData = typeof resp.data === 'string' ? JSON.parse(resp.data) : resp.data;
        if (jsonData.casenos != null) {
          this.SearchCasesData = Object.values(jsonData.casenos);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }


  loadAct(): void {
    this.searchcaseService.getSActDropDownList().subscribe(
      (response: any) => {
        if (response.isSuccess && response.data) {
          this.Act = response.data;
        }
      },
      (error) => {
        console.error('Error fetching sub-dropdown data', error);
      }
    );
  }

  GetCaseJudgementTypes(): void {
    this.searchcaseService.GetCaseJudgementTypes().subscribe(
      (response: any) => {
        if (response.isSuccess && response.data) {
          this.CaseStatus = response.data; 
        }
      },
      (error) => {
        console.error('Error fetching sub-dropdown data', error);
      }
    );
  }
}