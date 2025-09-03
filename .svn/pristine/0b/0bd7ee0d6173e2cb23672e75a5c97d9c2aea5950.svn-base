import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { IodashboardService } from '../services/iodashboard.service';
import Swal from 'sweetalert2';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-fir-view-dashboard-update',
  templateUrl: './fir-view-dashboard-update.component.html',
  styleUrls: ['./fir-view-dashboard-update.component.css']
})
export class FirViewDashboardUpdateComponent {
  
  logSearchForm!: FormGroup;
  apiLogs: any[] = [];
  showTable: boolean = false;
  modalRef: NgbModalRef | undefined; 
  selectedStateCode: number = 0; 
  apiEndpoints: string[] = [];
  isLoading: boolean = false;
  popupData: any = null;
  showPopup: boolean = false;

  requestDialogVisible = false;
  responseDialogVisible = false;
  exceptionDialogVisible = false;

  requestDialogData: string = '';
  responseDialogData: string = '';
  exceptionDialogData: string = '';

  errorDialogVisible = false;
  errorDialogMessage = 'An unexpected error occurred';

  isLoadingFirViewUpdated = false;

  progressMessage: string = '';
  estimatedTime: string = 'about 5 minutes';
    
  states: any[] = [];

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private IodashboardService: IodashboardService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadStates();
  }

  initializeForm() {
    this.logSearchForm = this.fb.group({
      updateType: ['select'], // Default to 'select'
      selectedStateCodeform: ['']
    });
  }

  loadStates() {
    this.authService.getStates().subscribe((data: any[]) => {
      this.states = data;
    });
  }

get isSearchDisabled(): boolean {
  const selectedValue = this.logSearchForm.get('updateType')?.value;
  // Disable if either:
  // 1. Nothing selected (null/undefined)
  // 2. The "--Select--" option is chosen
  // 3. The form is invalid (if you have other validations)
  return !selectedValue || selectedValue === 'select' || this.logSearchForm.invalid;
}

  UpdateFirViewLogs(): void {
    this.isLoadingFirViewUpdated = true;
    const formValues = this.logSearchForm.value;
    //const stateCode = formValues.selectedStateCodeform || null;
    const updateType = formValues.updateType;

    this.IodashboardService.FirViewDashboardUpdate(updateType).subscribe({
      next: (res: any) => {
        this.isLoadingFirViewUpdated = false;
        if (res.isSuccess) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: res.message || 'Data Updated Successfully',
            showConfirmButton: false,
            background: '#fff3cd', 
            color: '#000000',    
            timer: 3000,
          });
        } else {
          Swal.fire({
            position: 'center',
            title: 'Failed to Update View Dashboard',
            icon: 'error',
            showConfirmButton: true,
            background: '#fff3cd', 
            color: '#000000', 
          });
        }
      },
      error: () => {
        this.isLoadingFirViewUpdated = false;
        Swal.fire({
          position: 'center',
          title: 'Failed to Update Fir View Dashboard',
          icon: 'error',
          showConfirmButton: true,
          background: '#fff3cd', 
          color: '#000000', 
        });
      }
    });
  }

  
  resetForm(): void {
    this.logSearchForm.reset({
      updateType: 'select', // Reset to 'select' option
      selectedStateCodeform: ''
    });
    this.selectedStateCode = 0;
  }
}