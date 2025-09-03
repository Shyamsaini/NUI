import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ReportAuthorizationService } from '../../services/report-authorization.service';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-prosecution',
  templateUrl: './prosecution.component.html',
  styleUrl: './prosecution.component.css'
})
export class ProsecutionComponent {
  data: any = undefined;
  opinionAdviceInHtml: any = "";
  Ps_Code: any;
  @Input() psCode: string | undefined;
  isDownloadingPdf: boolean = false;
  isProsecutionDetailsHtml: boolean = false;


  constructor(private ref: ChangeDetectorRef, private utilityService: UtilityService, private sanitizer: DomSanitizer, private renderer: Renderer2, private el: ElementRef,
    private ReportAuthorizationService: ReportAuthorizationService, private loaderService: LoaderService
  ) {
    this.renderer.listen(this.el.nativeElement, 'click', (event: any) => {
      if (event.target && event.target.matches('[data-view-doc]')) {
        const eprocid = event.target.getAttribute('data-eprocid');
        const docid = event.target.getAttribute('data-docid');
        this.viewdocument(eprocid, docid);
      }
    });
  }

  loadProsecutionInfo(data: any, psCode: any) {
    this.data = data;
    this.ref.detectChanges();
    this.Ps_Code = psCode;
  }

  loadProsecutionHtml(eProcId: string) {

    this.loaderService.show();
    this.isProsecutionDetailsHtml = true;
    const body = { eProcId };
    this.utilityService.OpinionAdviceInHtml(body).subscribe((response) => {
      this.loaderService.hide();
      this.isProsecutionDetailsHtml = false;
      //console.log(response.data);

      if (response.isSuccess) {
        const data = JSON.parse(response.data);
        if (!data || !data.data || !data.data.htmlstring || !data.data.eprocid) {
          this.utilityService.ShowErrorPopup('Data is empty received from server');
          return;
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.data.htmlstring, 'text/html');

        doc.querySelectorAll('style, head').forEach((el) => el.remove());

        doc.querySelectorAll('[onclick]').forEach((el) => {
          const onclickValue = el.getAttribute('onclick');
          if (onclickValue) {
            const match = onclickValue.match(/viewdocument\('(.+?)',(\d+)\)/);
            if (match) {
              const [_, eprocid, docid] = match;
              el.setAttribute('data-eprocid', eprocid);
              el.setAttribute('data-docid', docid);
              el.classList.add('trigger-view-doc');
            }
            el.removeAttribute('onclick');
          }
        });

        doc.querySelectorAll('.collapse').forEach((el) => el.classList.remove('collapse'));
        doc.querySelectorAll('.menu-content').forEach((el) => {
          el.classList.remove('menu-content');
          el.classList.add('p-10');
        });
        doc.querySelectorAll('table').forEach((el) => {
          el.classList.add('table', 'table-bordered');
        });

        this.opinionAdviceInHtml = this.sanitizer.bypassSecurityTrustHtml(doc.body.innerHTML);
        this.ref.detectChanges();
      } else {
        this.utilityService.ShowErrorPopup(response.message);
      }
    });
  }

  // viewdocument(eprocid: any, docid: any) {      
  //     this.loaderService.show();
  //       const psCode=this.Ps_Code;
  //       const body = { eprocid, docid,psCode };
  //       this.utilityService.viewdocument_proc(body).subscribe(response => {
  //         this.loaderService.hide();
  //         if (response.isSuccess) {
  //           this.utilityService.DownloadPdfFileFromBase64(response.fileData, eprocid+".pdf");
  //         } else {
  //           this.utilityService.ShowErrorPopup(response.message);
  //         }
  //       });
  // } 


  viewdocument(eprocid: any, docid: any) {
    this.loaderService.show();

    // Find the FIR_REG_NUM in the current HTML content (you may keep the HTML as string or from a DOM element)
    const html = this.opinionAdviceInHtml?.toString() || '';
    let firRegNum = '';

    const firMatch = html.match(/FIR_REG_NUM=([0-9]+)/);
    if (firMatch && firMatch[1]) {
      firRegNum = firMatch[1];
      console.log('Extracted FIR_REG_NUM:', firRegNum);
    }

    const psCode = this.Ps_Code;
    const body = { eprocid, docid, psCode, firRegNum }; // You can now send it in the body if needed

    this.utilityService.viewdocument_proc(body).subscribe(response => {
      this.loaderService.hide();
      if (response.isSuccess) {
        this.utilityService.DownloadPdfFileFromBase64(response.fileData, eprocid + '.pdf');
      } else {
        this.utilityService.ShowErrorPopup(response.message);
      }
    });
  }

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('trigger-view-doc')) {
      const eprocid = target.getAttribute('data-eprocid');
      const docid = target.getAttribute('data-docid');
      if (eprocid && docid) {
        this.viewdocument(eprocid, docid);
      }
    }
  }


  // printProsecution(eProcId: string) {
  //     this.isDownloadingPdf = true;
  //     this.loaderService.show();  
  //     const body = { eProcId };
  //     this.utilityService.OpinionAdviceInPDF(body).subscribe((response) => {
  //     this.loaderService.hide();  
  //     this.isDownloadingPdf = false;
  //     if (response.isSuccess) {
  //       this.utilityService.DownloadPdfFileFromBase64(response.data, eProcId+".pdf");  
  //     } else {
  //       this.utilityService.ShowErrorPopup(response.message);
  //     }
  //   });
  // }

  // Component Code
  printProsecution(eProcId: string) {
    const body = { eProcId };
    this.isDownloadingPdf = true;
    this.loaderService.show();

    this.utilityService.OpinionAdviceInPDF(body).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.isDownloadingPdf = false;

        if (response.isSuccess) {
          this.utilityService.DownloadPdfFileFromBase64(response.data, `${eProcId}.pdf`);
        } else {
          this.utilityService.ShowErrorPopup(response.message || 'Failed to generate PDF');
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.isDownloadingPdf = false;

        let errorMessage = 'An error occurred while downloading the PDF';

        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        this.utilityService.ShowErrorPopup(errorMessage);
      },
      complete: () => {
        // Any cleanup if needed
      }
    });
  }
}
