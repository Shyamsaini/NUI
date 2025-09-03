import { ChangeDetectorRef, Component } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrl: './court.component.css'
})
export class CourtComponent {
   data: any = undefined;
  constructor(private ref: ChangeDetectorRef, private utilityService: UtilityService){

  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  downloadOrder(cnr: string, orderNumber: string, orderDate: string){
    let body = {
      CNR: cnr,
      OrderNumber: orderNumber,
      OrderDate: orderDate
    };
    this.utilityService.DownloadOrder(body).subscribe(response=>{
      if (response.isSuccess) {
        this.utilityService.DownloadPdfFileFromBase64(response.fileData, "Order.pdf");
      } else {
        this.utilityService.ShowErrorPopup(response.message);
      }
    });
  }

   loadCaseinformation(data: any) {
    this.data = data;
    this.data.acts = Object.values(this.data.acts);
    if(this.data.historyofcasehearing != null){
      this.data.historyofcasehearing = Object.values(this.data.historyofcasehearing);
    }

    if(this.data.interimorder != null){
      this.data.interimorder = Object.values(this.data.interimorder);
    }

    if(this.data.finalorder != null){
      this.data.finalorder = Object.values(this.data.finalorder);
    }
    
    if(this.data.processes != null){
      this.data.processes = Object.values(this.data.processes);
    }
    if(this.data.transfer != null){
      this.data.transfer = Object.values(this.data.transfer);
    }
    
    this.ref.detectChanges();
  }
}
