import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IpWhitelistService, IpWhitelist, CreateIpWhitelist, UpdateIpWhitelist } from '../services/ip-whitelist.service';
import Swal from 'sweetalert2';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-ip-whitelist-esakshya',
  templateUrl: './ip-whitelist-esakshya.component.html',
  styleUrls: ['./ip-whitelist-esakshya.component.css']
})
export class IpWhitelistEsakshyaComponent implements OnInit {
  ipAddresses: IpWhitelist[] = [];
  currentIp!: IpWhitelist;
  crudForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  showForm = false;
  errorMessage = '';
  successMessage = '';
  first: number = 0;
  rows: number = 10;

 ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  constructor(
    private fb: FormBuilder,
    private ipService: IpWhitelistService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadIpAddresses();
  }

  initializeForm(): void {
    this.crudForm = this.fb.group({
      ipAddress: ['', [Validators.required, Validators.pattern(this.ipPattern)]],
      description: [''],
      isActive: [true]
    });
  }
  loadIpAddresses(): void {
    this.loaderService.show();
    this.ipService.getAll().subscribe({
      next: (response: any) => {
        const parsedData = JSON.parse(response.data); // parse the stringified array
        this.ipAddresses = parsedData as IpWhitelist[];
        this.isLoading = false;
        this.loaderService.hide();
      },
      error: (err) => {
        this.handleError('Failed to load IP addresses', err);
        Swal.fire({
          position: 'top-end', 
          title: 'Failed to load IP addresses.',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'custom-alert',
            title: 'custom-title',
          },
          background: '#ff0000', 
         });
         this.loaderService.hide();
      }
    });
  }

  showAddForm(): void {
    this.isEditing = false;
    this.showForm = true;
    this.crudForm.reset({ isActive: true });
  }

  showEditForm(ip: IpWhitelist): void {
    this.currentIp = { ...ip };
    this.isEditing = true;
    this.showForm = true;
    this.crudForm.patchValue({
      ipAddress: this.currentIp.IpAddress,
      description: this.currentIp.Description,
      isActive: this.currentIp.IsActive
    });
  }

  handleSubmit(): void {
    if (this.crudForm.invalid) return;

    this.loaderService.show();
    const formData = this.crudForm.value;

    if (this.isEditing) {
      const updateData: UpdateIpWhitelist = {
        id: this.currentIp.Id,
        ...formData
      };
      
      this.ipService.update(updateData).subscribe({
        next: () => {
          this.handleSuccess('IP updated successfully');
             Swal.fire({
                    position: 'top-end', 
                    title: 'IP updated successfully.',
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: {
                      popup: 'custom-alert',
                      title: 'custom-title',
                    },
                    background: '#006400', 
             });
          this.loadIpAddresses();
          this.loaderService.hide();
        },
        error: (err) => {
          Swal.fire({
            position: 'top-end', 
            title: 'Failed to update IP.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400', 
           });
          this.handleError('Something went wrong', err);
          this.loaderService.hide();
        }
      });
    } else {
      const createData: CreateIpWhitelist = {
        ipAddress: formData.ipAddress,
        description: formData.description
      };

      this.ipService.create(createData).subscribe({
        next: () => {
          this.handleSuccess('IP added successfully');
          Swal.fire({
            position: 'top-end', 
            title: 'IP added successfully.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400', 
           });
          this.loadIpAddresses();
          this.loaderService.hide();
        },
        error: (err) => {
          this.handleError('Failed to add IP', err);
          Swal.fire({
            position: 'top-end', 
            title: 'Something went wrong.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#ff0000', 
           });
           this.loaderService.hide();
        }
      });
    }
  }

  deleteIp(id: number): void {
    if (confirm('Are you sure you want to delete this IP?')) {
      this.loaderService.show();
      this.ipService.delete(id).subscribe({
        next: () => {
          this.handleSuccess('IP deleted successfully');
          Swal.fire({
            position: 'top-end', 
            title: 'IP deleted successfully.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400', 
           });
          this.loadIpAddresses();
          this.loaderService.hide();
        },
        error: (err) => {
          this.handleError('Failed to delete IP', err);
          Swal.fire({
            position: 'top-end', 
            title: 'Something went wrongP.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#ff0000', 
           });
           this.loaderService.hide();
        }
      });
    }
  }

  private handleSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.showForm = false;
    this.isLoading = false;
    setTimeout(() => this.successMessage = '', 3000);
  }

  private handleError(message: string, error?: any): void {
    this.errorMessage = `${message}: ${error?.message || 'Unknown error'}`;
    this.successMessage = '';
    this.isLoading = false;
    console.error(error || message);
    setTimeout(() => this.errorMessage = '', 5000);
  }
}