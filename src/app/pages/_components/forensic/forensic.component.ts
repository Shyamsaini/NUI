import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import Swal from 'sweetalert2';
import { LoaderService } from '../../services/loader.service';
@Component({
  selector: 'app-forensic',
  templateUrl: './forensic.component.html',
  styleUrl: './forensic.component.css'
})
export class ForensicComponent {
  data: any = undefined;
  fileData: any = undefined;
  ps_Code:any;
  constructor(private ref: ChangeDetectorRef, private utilityService: UtilityService,private loaderService: LoaderService){

  }


  downloadFile(){
    this.utilityService.DownloadPdfFileFromBase64(this.fileData, "Report.pdf");
  }

  loadFslInfo(data: any, psCode: any) {

    this.data = data;
    this.ps_Code = psCode !== null && psCode !== undefined ? psCode : data.policestationcode;
    this.ref.detectChanges();
  }


  downloadFSlReport(data:  any) {
    this.loaderService.show();
    let body = {
      fslid: data.fslid,
      cctnsfirno: data.cctnsfirno,
      psCode: this.ps_Code
    };
    this.utilityService.DownloadFslReport(body).subscribe(response=>{
      if (response.isSuccess) {
        let data = JSON.parse(response.data);
        this.fileData = data.rptimage;
        if(data.rptimage == null){
          this.loaderService.hide();
          this.utilityService.ShowErrorPopup('Report is not available at FSL');
          return;
        }
        Swal.fire({
          title: 'Report Information',
          html: this.reportPopup(data),
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          focusConfirm: false,
          didOpen: () => {
            // Add an event listener after the popup is fully rendered
            const customButton = document.getElementById('downloadreport');
            if (customButton) {
              customButton.addEventListener('click', () => this.downloadFile());
            }
          }
          
        });
        this.loaderService.hide();
      }
       else {
        this.utilityService.ShowErrorPopup(response.message);
        this.loaderService.hide();
      }
    });
  }


  reportPopup(data: any) {
    return `
     <div class="col-sm-12">
        <table class="table table-bordered">
                <thead class="table-head">
                    <tr>
                        <th>
                            FSL Registration Number
                        </th>
                        <th>
                            FIR No. / Year
                        </th>
                        <th>
                            State Code
                        </th>
                        <th>
                            PDF Password
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="fslregno">${data.fslregno}</td>
                        <td class="firno">${data.policefirnumber}</td>
                        <td class="statecode">${data.statecode}</td>
                        <td class="pdfpassword">${data.pdfpassword}</td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div class="col-sm-12">
            <div class="right-bn text-right">
                <button type="button" class="btn btn-primary text-white" id="downloadreport" >Download Report</button>
            </div>
        </div>
    `;
  }
}
