import { ChangeDetectorRef, Component } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-medlepr',
  templateUrl: './medlepr.component.html',
  styleUrl: './medlepr.component.css'
})
export class MedleprComponent {

  data: any;

  constructor(private ref: ChangeDetectorRef, private utilityService: UtilityService, private datePipe: DatePipe){

  }

  loadMedleprInfo(data: any){
    this.data = data[0];
    this.data.cdExaminationStartDate = this.datePipe.transform(this.data.cdExaminationStartDate, 'dd/MM/yyyy')
    this.data.cdArrivalDate = this.datePipe.transform(this.data.cdArrivalDate, 'dd/MM/yyyy')
    this.data.cdTranactionDate = this.datePipe.transform(this.data.cdTranactionDate, 'dd/MM/yyyy')
    this.ref.detectChanges();
  }

  downloadFile(base64: string)
  {
    this.utilityService.DownloadPdfFileFromBase64(base64, "Report.pdf");
  }
}
