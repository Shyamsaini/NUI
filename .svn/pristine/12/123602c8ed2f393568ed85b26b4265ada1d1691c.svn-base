import { Component,OnInit,ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NyaayShurutiService } from '../services/nyaay-shuruti.service';
import { ModalService } from '../services/modal.service';
import { UtilityService } from '../services/utility.service';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { EsakshyaService } from '../services/dashboard.service';
@Component({
  selector: 'app-nyaay-shuruti',
  templateUrl: './nyaay-shuruti.component.html',
  styleUrl: './nyaay-shuruti.component.css'
})
export class NyaayShurutiComponent  implements OnInit{
 PillarData:any;
    nyaayShurutiRowData: any[] = [];
   isNyaayShurutiDataLoaded = false;
     nyaayShurutiFilterData: any[] = [];
     errorMessage: string = '';
     showNyaayShurutiGrid = false;
      policestations: any[] = [];
        Districts: any[] = [];
  form:FormGroup = new FormGroup({
    psCode: new FormControl(''),
     district: new FormControl('')
  });
  
   constructor(private NyaayShurutiService: NyaayShurutiService,private cdr: ChangeDetectorRef, private el: ElementRef,private renderer: Renderer2
  ,protected  modalService: ModalService,private utilityService: UtilityService, private formBuilder: FormBuilder, private dynamicModelService: DynamicModalService,
  private esakshyaService: EsakshyaService)
   {
    
  }
    ngOnInit(): void {
       this.form = this.formBuilder.group(
      {
         psCode: [''],
         district: ['']
       
      }
    );
    this.district();
   // this.loadPoliceStations();
    this.loadNyaayShurutiData(0);
    }
   
// loadPoliceStations(){
//     this.utilityService.PoliceStationList().subscribe((data: any[]) => {
//       this.policestations = data;
//     });
//   }
  onPoliceStationChange() : void{
    if(this.form.controls['psCode']?.value != ''){
      this.loadNyaayShurutiData(this.form.controls['psCode']?.value)
    }
    else{
      this.nyaayShurutiRowData = [];
    }
  }
   loadNyaayShurutiData(domaintype: number): void {
    this.esakshyaService.getNyaayShurutiData(domaintype).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          this.nyaayShurutiRowData = response.data;
          this.nyaayShurutiFilterData = response.data;
          this.errorMessage = '';
          this.isNyaayShurutiDataLoaded = true;
        } else {
          this.errorMessage = 'No data available for Nyaay Shuruti.';
          this.nyaayShurutiRowData = [];
        }
      },
      error: (err) => {
        console.error('Error fetching Nyaay Shuruti data:', err);
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.nyaayShurutiRowData = [];
      },
    });
}
 onQuickFilterNyaayShurut(event: any): void {  
      const filterValue = event.target.value;

      if(filterValue =='')
      {
        this.nyaayShurutiFilterData = this.nyaayShurutiRowData;
      }
      this.nyaayShurutiFilterData  = this.nyaayShurutiRowData.filter((obj) => {
        return Object.values(obj).some((val) =>
          String(val).toLowerCase().includes(filterValue)
        );
      });
      this.cdr.detectChanges();  
  }
  district(){
    this.utilityService.Districts().subscribe((data) => {
      if(data.isSuccess){
        this.Districts = data.data;
      }
    });
  }
    onDistrictChange(event: any): void {
    const selectedDistrict = event.target.value;
    if (selectedDistrict) {
       this.utilityService.PoliceStationList(selectedDistrict).subscribe((data: any[]) => {
      this.policestations = data;
    });
    }  
    else {
    this.form.controls["psCode"].setValue('');
    this.form.controls["district"].setValue('');
      this.policestations = [];
    }
  }
}
