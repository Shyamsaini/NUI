import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IcjsSearchService } from '../services/icjs-search.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColDef, GridApi, GridOptions, ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { ModalService } from '../services/modal.service';
import { OtherPillarInformation } from '../models/otherpillarinformation.model';
import { CourtComponent } from '../_components/court/court.component';
import { TabContainerComponent } from '../_components/tabs/tab-container.component';
import { OtherPillarsComponent } from '../_components/otherpillars/other-pillars.component';
import { LoaderService } from '../services/loader.service';
import { OtherPillarsServicesService } from '../services/other-pillars-services.service';
@Component({
  selector: 'app-icjs-search',
  templateUrl: './icjs-search.component.html',
  styleUrl: './icjs-search.component.css'
})
export class IcjsSearchComponent    {
  isLoaded = false;
  isSubmitted = false;
  policestations: any[] = [];
  firdata: any = [];
  psCode:any;
  Districts: any[] = [];
  AccusedData: any = [];
  firstRowIndex: number = 0;
  popupColumns: any[] = [];
  showPopup = false; popupData: any[] = []; 
  AccusedDataType: string = '';
  AccusedDataPOPHeader: string = '';

  selectedDistrictName: string = '';
selectedPoliceStationName: string = '';
formattedFir: string = '';
  @ViewChild('popupTable') popupTable!: any;
  loadPillarData(firNumber: string, firRegDate: string, firShortNumber: string, policeCode: string) {
    this.addOtherPillarTab(firNumber, firRegDate, firShortNumber, policeCode);   
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
    var data=this.form.getRawValue();
    this.psCode=data.psCode;
    this.icjsSearchService.SearchFir(data).subscribe(response => {
      this.isLoaded = true;
      if (response.isSuccess) {
        //this.firdata = response.data;
        this.firdata = []; // make sure it's an array
        this.AccusedData = [];
        if (response.data) {
         try {
         const data = JSON.parse(response.data); // ensure valid JSON
         this.AccusedData = data.AccusedData || []; // ensure accusedData is an array
         this.firdata.push(data); // works only if firdata is an array
        } catch (err) {
        if (err instanceof Error) {
          console.error("JSON parse error:", err.message);
        } else {
          console.error("JSON parse error:", err);
        }
        }
        } else {
         this.utilityService.ShowErrorPopup(response.message);
         console.warn("response.data is empty or undefined");
       }
        this.loaderService.hide();
       }
       else {
        this.utilityService.ShowErrorPopup(response.message);
        this.loaderService.hide();
      }
    },
    (error: HttpErrorResponse) => {
      console.error('API error:', error);
      this.loaderService.hide();
    });
    
  }

  constructor(private utilityService: UtilityService, private formBuilder: FormBuilder, private icjsSearchService: IcjsSearchService, protected  modalService: ModalService,
    private ref: ChangeDetectorRef,private loaderService: LoaderService,private otherPillarsServicesService: OtherPillarsServicesService
  ) {
    //this.loadPoliceStations();

  }

 get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    
    this.form = this.formBuilder.group(
      {
        district: [''], 
        psCode: ['', Validators.required],
        firNumber: [
          '',[Validators.required, Validators.pattern(/^[0-9]{1,7}$/)]
        ],
        year: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
      }
    );
    this.district();
  }

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
  loadPoliceStations(){
    this.utilityService.PoliceStationList("0").subscribe((data: any[]) => {
      this.policestations = data;
    });
  }
  tabCounter = 1;
  @ViewChild(TabContainerComponent) tabContainer!: TabContainerComponent;

addOtherPillarTab(firNumber : string, firRegDate: string, firShortNumber: string, policeCode: string) {
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
   console.log('Accused Data:',  this.AccusedData);
   this.resetPaginator()

    this.loaderService.show();
    this.showPopup = true;
    this.popupData = [];
    this.AccusedDataPOPHeader = arrestedStatus === 'Arrested' ? 'Arrested Accused Details' : 'Not Arrested Accused Details';

    this.popupColumns = [
          { field: 'firnumber', header: 'FIR No' },
          //{ field: 'LinkedFIRNumber', header: 'FIR Number' },
          { field: 'district', header: 'District' },
          { field: 'PS', header: 'Police Station' },
          { field: 'arrestName', header: 'Name' },
          { field: 'accusedAddress', header: 'Address' },
          { field: 'ARREST_SURRENDER_DT', header: 'ARREST DATE'},
          { field: 'CHARGSHEET_Status', header: 'CHARGSHEET(Y/N)'},
          { field: 'CHARGESHEET_DT', header: 'CHARGESHEET DATE'},
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

  closePopup(): void {
  this.popupData = []; 
  this.showPopup = false; 
}

  resetPaginator() {
    if (this.popupTable) {
        if (this.popupTable && this.popupTable.reset) {
            this.popupTable.reset();
        }
    }
}
}
