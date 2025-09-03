import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mini-statement',
  templateUrl: './mini-statement.component.html',
  styleUrl: './mini-statement.component.css'
})
export class MiniStatementComponent {

  miniStatementHtml: any = "";
  constructor(private ref: ChangeDetectorRef, private sanitized: DomSanitizer){

  }

  loadHtml(response: any){
        // Trust the sanitized HTML to render it safely
        this.miniStatementHtml = this.sanitized.bypassSecurityTrustHtml(response);
        this.ref.detectChanges();
  }
}
