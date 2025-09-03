import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ChitrakhoziService } from '../services/chitrakhozi.service';
import { ChitrakhoziDetail } from '../models/chitra-khozi-model';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cctns-chitrakhozi',
  templateUrl: './cctns-chitrakhozi.component.html',
  styleUrl: './cctns-chitrakhozi.component.css'
})
export class CctnsChitrakhoziComponent  implements OnInit {
  
  courtCasesData: ChitrakhoziDetail[] = [];
  uploadedImage: string | ArrayBuffer | null = null;
  uploadedImageSrc: string | null = null;

  constructor(private chitrakhoziService: ChitrakhoziService,private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    // If you need to load any initial data, you can do it here
  }

  getChitraKhoziWithImage(): void {
    if (typeof this.uploadedImage === 'string') {
      const cleanedBase64 = this.uploadedImage.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

      this.chitrakhoziService.getChitraKhoziWithImageCCTNS(cleanedBase64).subscribe(
        response => {
          if (response.isSuccess) {
            this.courtCasesData = JSON.parse(response.data);
          
            // Check if the data is undefined, null, or empty
            if (!this.courtCasesData || this.courtCasesData.length === 0) {
              Swal.fire({
                position: 'top-end', // Or 'center-end' for center-right position
                title: 'No Data Found!',
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                  popup: 'custom-alert',
                  title: 'custom-title',
                },
                background: '#006400', // Green background
              });

              this.ref.detectChanges();
            }
          } else {

            this.courtCasesData = [];
            Swal.fire({
              position: 'top-end', // Or 'center-end' for center-right position
              title: 'No Data Found!',
              showConfirmButton: false,
              timer: 2000,
              customClass: {
                popup: 'custom-alert',
                title: 'custom-title',
              },
              background: '#006400', // Green background
            });
            this.ref.detectChanges();
          }          
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
    } else {
      console.error('Uploaded image is not a valid base64 string');
    }
  }

  onFileSelected(event: Event): void {
    const input = (event.target as HTMLInputElement).files?.[0];
    if (input) {
      this.convertToBase64(input);
    } else {
      console.error('No file selected or file is undefined');
    }
  }

  convertToBase64(file: File): void {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });

    observable.subscribe({
      next: (data) => {
        this.uploadedImage = data;       
      },
      error: (error) => {
        console.error('Error reading file:', error);
      }
    });
  }

  readFile(file: File, subscriber: Subscriber<any>): void {
    const fileReader = new FileReader();
    
    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    };
    
    fileReader.onerror = (error) => {
      subscriber.error(error);
    };

    fileReader.readAsDataURL(file);
  }

  onQuickFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Implement filtering logic based on the `filterValue` and `courtCasesData`
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}

