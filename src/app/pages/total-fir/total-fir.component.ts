import { Component, OnInit, ChangeDetectorRef, ViewChild,ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../services/modal.service';
import { UtilityService } from '../services/utility.service';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { TotalFirService } from '../services/total-fir.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { TabContainerComponent } from '../_components/tabs/tab-container.component';
import { OtherPillarsComponent } from '../_components/otherpillars/other-pillars.component';
import { OtherPillarsServicesService } from '../services/other-pillars-services.service';

@Component({
  selector: 'app-total-fir',
  templateUrl: './total-fir.component.html',
  styleUrl: './total-fir.component.css'
})

export class TotalFirComponent implements OnInit {
  lbltype: string = '';
  isSubmitted = false;
  TotalFirData: any;
  DetailsAccusedPettyCrimeData: any;
  DetailsAccusedPettyCrimeBySPInner: any;
  DetailsAccusedPettyCrimeBySPInnerSearch: any;
  DetailsAccusedByPSData: any;
  DetailsAccusedPettyCrimeDataFilter: any;
  DetailsAccusedPettyCrimeDataFilterAccusedFIR: any;
  DetailsAccusedPettyCrimeDataFilterTotalFIR: any;
  DetailsAccusedAccusedFIRSerach: any;
  DetailsAccusedFIRData: any;
  DetailsccusedFIRData: any;
  TotalDetailData: any;
  TotalDetailDataByspInner: any;
  isAccusedPettyCrimeListTable: boolean = false;
  isAccusedFIRListTable: boolean = false;
  isAccusedFIRListTableSp: boolean = false;
  isAccusedPettyCrimeBySPInnerSPTable: boolean = false;
  isTotalListTable: boolean = false;
  isTotalListTableBYSP: boolean = false;
  isTotalListByspInnerTable: boolean = false;
  policestations: any[] = [];
  BackPage: boolean = false;
  DetailsccusedFIRDataBySp: any;
  Districts: any[] = [];
  openCourtComponent(cino: string) {

  }


  constructor(private totalFirService: TotalFirService, private cdr: ChangeDetectorRef, private el: ElementRef, private renderer: Renderer2
    , protected modalService: ModalService, private utilityService: UtilityService, private formBuilder: FormBuilder, private dynamicModelService: DynamicModalService,
    private loaderService: LoaderService, private otherPillarsServicesService: OtherPillarsServicesService) {
    //this.loadPoliceStations();
  }
  ngOnInit(): void {
    this.district();
    this.form = this.formBuilder.group(
      {
        district: [''],
        psCode: [''],
        FromDate: [''],
        ToDate: ['']
      });
    const toDate = new Date();
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    this.form.setValue({
      psCode: '',
      FromDate: fromDate.toISOString().split('T')[0],
      ToDate: toDate.toISOString().split('T')[0],
    });

    this.onSubmit();
  }
district(){
      this.utilityService.LoadDistricts().subscribe((data) => {
   // this.utilityService.Districts().subscribe((data) => {
      if(data.isSuccess){
        this.Districts = data.data;
      }
    });
  }
  onDistrictChange(event: any): void {
    const selectedDistrict = event.target.value;
    if (selectedDistrict) {
      this.utilityService.PoliceStationNyaySetu(selectedDistrict).subscribe((data: any[]) => {
      // this.utilityService.PoliceStationList(selectedDistrict).subscribe((data: any[]) => {
      this.policestations = data;
    });
    }  
    else {
    this.form.controls["district"].setValue('');
     this.form.controls["psCode"].setValue('');
      this.form.controls["FromDate"].setValue('');
      this.form.controls["ToDate"].setValue('');
      
      this.policestations = [];
    }
  }

  loadPoliceStations() {
    this.utilityService.PoliceStationList("0").subscribe((data: any[]) => {
      this.policestations = data;
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  onQuickFilterNyaayShurut(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue == '') {
      this.DetailsAccusedPettyCrimeDataFilter = this.DetailsAccusedPettyCrimeData;
    }
    this.DetailsAccusedPettyCrimeDataFilter = this.DetailsAccusedPettyCrimeData.filter((obj: any) => {
      return Object.values(obj).some((val) =>
        String(val).toLowerCase().includes(filterValue)
      );
    });
    this.cdr.detectChanges();
  }

  onQuickFilterNyaayShurutAccused(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue == '') {
      this.DetailsAccusedPettyCrimeDataFilterAccusedFIR = this.DetailsccusedFIRData;
    }
    this.DetailsAccusedPettyCrimeDataFilterAccusedFIR = this.DetailsccusedFIRData.filter((obj: any) => {
      return Object.values(obj).some((val) =>
        String(val).toLowerCase().includes(filterValue)
      );
    });
    this.cdr.detectChanges();
  }
  onQuickFilterNyaayShurutTotal(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue == '') {
      this.DetailsAccusedPettyCrimeDataFilterTotalFIR = this.TotalDetailData;
    }
    this.DetailsAccusedPettyCrimeDataFilterTotalFIR = this.TotalDetailData.filter((obj: any) => {
      return Object.values(obj).some((val) =>
        String(val).toLowerCase().includes(filterValue)
      );
    });
    this.cdr.detectChanges();
  }
  onQuickFilterArrestsFir(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue == '') {
      this.DetailsAccusedPettyCrimeDataFilterAccusedFIR = this.DetailsccusedFIRDataBySp;
    }
    this.DetailsAccusedPettyCrimeDataFilterAccusedFIR = this.DetailsccusedFIRDataBySp.filter((obj: any) => {
      return Object.values(obj).some((val) =>
        String(val).toLowerCase().includes(filterValue)
      );
    });
    this.cdr.detectChanges();
  }
  onQuickFilterArrestsFirSearch(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue == '') {
      this.DetailsAccusedAccusedFIRSerach = this.DetailsccusedFIRDataBySp;
    }
    this.DetailsAccusedAccusedFIRSerach = this.DetailsccusedFIRDataBySp.filter((obj: any) => {
      return Object.values(obj).some((val) =>
        String(val).toLowerCase().includes(filterValue)
      );
    });
    this.cdr.detectChanges();
  }
  onQuickFilterArrestspettySearch(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue == '') {
      this.DetailsAccusedPettyCrimeBySPInnerSearch = this.DetailsAccusedPettyCrimeBySPInner;
    }
    this.DetailsAccusedPettyCrimeBySPInnerSearch = this.DetailsAccusedPettyCrimeBySPInner.filter((obj: any) => {
      return Object.values(obj).some((val) =>
        String(val).toLowerCase().includes(filterValue)
      );
    });
    this.cdr.detectChanges();
  }
  setValueCase(psCode: string, fromDate: string, toDate: string): any {
    this.totalFirService.TotalFir(psCode, fromDate, toDate).subscribe(
      response => {
        if (response.isSuccess) {
          this.isAccusedPettyCrimeListTable = false;
          this.isAccusedFIRListTable = false;
          this.isTotalListTable = false;
          this.TotalFirData = JSON.parse(response.data);
          let totalAccusedFir = this.TotalFirData.totalAccusedFir;
          let totalAccusedPettyCrime = this.TotalFirData.totalAccusedPettyCrime;
          let totalAccusedAndPettyCount = this.TotalFirData.totalAccusedAndPettyCount;
          var TotalFIR = 0;
          var AccusedFIR = 0;
          var AccusedPettyCrime = 0;
          this.renderer.setProperty(this.el.nativeElement.querySelector('#totalOnGoing'), 'textContent', totalAccusedFir);
          this.renderer.setProperty(this.el.nativeElement.querySelector('#listedToday'), 'textContent', totalAccusedPettyCrime);
          this.renderer.setProperty(this.el.nativeElement.querySelector('#listedThisWeek'), 'textContent', totalAccusedAndPettyCount);
          this.loaderService.hide();
        }
        else {
          console.log('API false response1:', response);
          this.loaderService.hide();
        }
      },
      (error: HttpErrorResponse) => {
        console.error('API error:', error);
        this.loaderService.hide();
      }
    );
  }
  loadCounts() {
    this.setValueCase(this.form.controls["psCode"].value, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value);
  }
  form: FormGroup = new FormGroup({
    FromDate: new FormControl('01-11-2024'),
    ToDate: new FormControl('01-12-2024')
  });
  onSubmit(): void {
    this.loaderService.show();
    this.isSubmitted = true;
    this.BackPage = false;
    this.loadCounts();
    const psCodeValue = this.form.controls["psCode"].value;
    if (psCodeValue === 'Select All' || psCodeValue === '' || psCodeValue === null) {
      this.isTotalListTableBYSP = true;
      this.loadCountbyPS();
    }
    else {
      this.isTotalListTableBYSP = false;
    }

  }
  totalDetailsWithSPCode(event: MouseEvent, PSCode: string, type: string) {
    event.preventDefault();
    switch (type) {
      case 'ArrestsFir':
        if (this.form.controls["psCode"].value === '') {
          this.isTotalListTableBYSP = false;
          this.isAccusedFIRListTableSp = true;
          this.ArrestsFirBySpinner(PSCode)
        }
        else {
          alert("2")
        }
        break;
      case 'ArrestsPettyCrimes':
        if (this.form.controls["psCode"].value === '') {
          this.isTotalListTableBYSP = false;
          this.isAccusedFIRListTableSp = false;
          this.isAccusedPettyCrimeBySPInnerSPTable = true;
          this.AccusedPettyCrimeBySPInner(PSCode)
        }
        else {
          alert("4")
        }
        break;
      case 'TotalArrests':
        if (this.form.controls["psCode"].value === '') {
          this.isTotalListByspInnerTable = true;
          this.isTotalListTableBYSP = false;
          this.isAccusedFIRListTableSp = false;
          this.TotalListFIRBySPInner(PSCode)
        }
        else {
          alert("6")
        }

        break;

    }
  }
  loadCountbyPS() {
    this.setValueCaseByPS(this.form.controls["psCode"].value, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value);
  }

  setValueCaseByPS(psCode: string, fromDate: string, toDate: string): any {
    this.totalFirService.BindDataByPS(psCode, fromDate, toDate).subscribe(
      response => {
        if (response.isSuccess) {
          this.isAccusedPettyCrimeListTable = false;
          this.isAccusedFIRListTable = false;
          this.isTotalListTable = false;
          this.DetailsAccusedByPSData = JSON.parse(response.data);

        }
        else {
          console.log('API false response1:', response);

        }
      },
      (error: HttpErrorResponse) => {
        console.error('API error:', error);

      }
    );
  }
  totalDetails(event: MouseEvent, type: string) {
    this.loaderService.show();
    this.BackPage = false;
    this.isTotalListByspInnerTable = false
    this.isAccusedPettyCrimeBySPInnerSPTable = false;
    this.isTotalListTableBYSP = false;
    event.preventDefault();
    this.AccusedPettyCrime("ongoing", "")
  }
  AccusedPettyCrime(ongoing: string, pscode: any): any {
    this.totalFirService.AccusedPettyCrime(this.form.controls["psCode"].value, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.isAccusedFIRListTable = false;
            this.isTotalListTable = false;
            this.isAccusedFIRListTableSp = false

            this.isAccusedPettyCrimeListTable = true;
            this.DetailsAccusedPettyCrimeData = JSON.parse(response.data);
            this.DetailsAccusedPettyCrimeDataFilter = JSON.parse(response.data);
            this.cdr.detectChanges();
            this.loaderService.hide();

          }
          else {
            console.log('API false response:', response);
            this.loaderService.hide();
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
          this.loaderService.hide();
        }
      );



  }
  totalAccusedFIR(event: MouseEvent, type: string) {
    this.loaderService.show();
    this.BackPage = false;
    this.isAccusedPettyCrimeBySPInnerSPTable = false;

    this.isTotalListByspInnerTable = false;
    this.isAccusedFIRListTableSp = false;
    this.isTotalListTableBYSP = false;
    event.preventDefault();
    this.AccusedFIR("ongoing", "")
  }
  AccusedFIR(ongoing: string, pscode: any): any {
    this.totalFirService.AccusedFIR(this.form.controls["psCode"].value, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.isAccusedPettyCrimeListTable = false;
            this.isTotalListTable = false;
            this.isAccusedFIRListTable = true;
            this.DetailsccusedFIRData = JSON.parse(response.data);
            this.DetailsAccusedPettyCrimeDataFilterAccusedFIR = JSON.parse(response.data);
            this.cdr.detectChanges();
            this.loaderService.hide();

          }
          else {
            console.log('API false response:', response);
            this.loaderService.hide();
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
          this.loaderService.hide();
        }
      );
  }
  GetTotalListFIR(event: MouseEvent, type: string) {
    this.loaderService.show();
    event.preventDefault();
    this.BackPage = false;
    this.isAccusedPettyCrimeBySPInnerSPTable = false
    this.isAccusedFIRListTableSp = false;
    this.isTotalListByspInnerTable = false;
    this.isTotalListTableBYSP = false;
    this.isAccusedPettyCrimeListTable = false;
    this.isAccusedFIRListTable = false;


    this.isTotalListTable = true;
    this.TotalListFIR("ongoing", "")
  }
  TotalListFIR(ongoing: string, pscode: any): any {
    this.totalFirService.TotalList(this.form.controls["psCode"].value, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.TotalDetailData = JSON.parse(response.data);
            this.DetailsAccusedPettyCrimeDataFilterTotalFIR = JSON.parse(response.data);
            this.cdr.detectChanges();
            this.loaderService.hide();

          }
          else {
            console.log('API false response:', response);
            this.loaderService.hide();
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
          this.loaderService.hide();
        }
      );
  }
  lnkbackClick() {
    this.BackPage = false;
    this.isTotalListTableBYSP = true;
    this.isAccusedFIRListTableSp = false;
    this.isTotalListByspInnerTable = false;
    this.isAccusedPettyCrimeBySPInnerSPTable = false;
    this.cdr.detectChanges();
  }
  ArrestsFirBySpinner(pscode: string): any {
    this.totalFirService.AccusedFIRBYSp(pscode, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.BackPage = true;
            this.DetailsccusedFIRDataBySp = JSON.parse(response.data);
            this.DetailsAccusedAccusedFIRSerach = JSON.parse(response.data);

            this.lbltype = response.data.records[0].PoliceStation;
            this.cdr.detectChanges();

          }
          else {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
  }
  AccusedPettyCrimeBySPInner(pscode: string): any {
    this.totalFirService.AccusedPettyCrimeBYSP(pscode, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.BackPage = true;

            this.DetailsAccusedPettyCrimeBySPInner = JSON.parse(response.data);
            this.DetailsAccusedPettyCrimeBySPInnerSearch = JSON.parse(response.data);
            this.cdr.detectChanges();

          }
          else {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
  }
  TotalListFIRBySPInner(pscode: string): any {
    this.totalFirService.TotalListBySp(pscode, this.form.controls["FromDate"].value, this.form.controls["ToDate"].value)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.BackPage = true;
            this.TotalDetailDataByspInner = JSON.parse(response.data);
            this.cdr.detectChanges();

          }
          else {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
  }
  tabCounter = 1;
  @ViewChild(TabContainerComponent) tabContainer!: TabContainerComponent;
   loadPillarData(firNumber: string, firRegDate: string, firShortNumber: string, policeCode: string): void {
    debugger
    this.addOtherPillarTab(firNumber, firRegDate, firShortNumber, policeCode);
  }
  
   addOtherPillarTab(firNumber: string, firRegDate: string, firShortNumber: string, policeCode: string) {
    this.modalService.close();
    this.loaderService.show();
    this.tabContainer.tabs = [];
    const TabTitle = `ICJS Pillars`;
    const TabData = {
      firNumber,
      firRegDate,
      firShortNumber:String(firShortNumber),
      policeCode: String(policeCode)
    };
    const TabComponent = OtherPillarsComponent;
    this.otherPillarsServicesService?.setTabContainer(this.tabContainer);
    this.otherPillarsServicesService.addTab(TabTitle, TabComponent, TabData);
  
  }
showImagePopup: boolean = false;
selectedImage: string | null = null;
openImagePopup(photo: string): void {
  this.selectedImage = photo;
  this.showImagePopup = true;
}
closeImagePopup(): void {
  this.showImagePopup = false;
  this.selectedImage = null;
}
}