import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { OtherPillarInformation } from '../../models/otherpillarinformation.model';
import { IcjsSearchService } from '../../services/icjs-search.service';
import { ModalService } from '../../services/modal.service';
import { TabContainerComponent } from '../tabs/tab-container.component';
import { CourtComponent } from '../court/court.component';
import { ForensicComponent } from '../forensic/forensic.component';
import { ProsecutionComponent } from '../prosecution/prosecution.component';
import { PrisonComponent } from '../prison/prison.component';
import { MiniStatementComponent } from '../mini-statement/mini-statement.component';
import { MedleprComponent } from '../medlepr/medlepr.component';
import { LoaderService } from '../../services/loader.service';
import { OtherPillarsServicesService } from '../../services/other-pillars-services.service';

@Component({
  selector: 'app-other-pillars',
  templateUrl: './other-pillars.component.html',
  styleUrls: ['./other-pillars.component.css']
})
export class OtherPillarsComponent {
  componentName = '_OtherPillarsComponent';
  @Input() data: string = '';
  otherPillarData?: OtherPillarInformation;

  constructor(
    private icjsSearchService: IcjsSearchService,
    private ref: ChangeDetectorRef,
    protected modalService: ModalService,
    private loaderService: LoaderService,
    private tabService: OtherPillarsServicesService // Inject TabService instead of IcjsSearchComponent
  ) { }

  loadPillarData(data: any) {
    this.otherPillarData = data;
    this.ref.detectChanges();
    this.modalService.open("modal-othterpillerdata");
  }

  loadCaseInformation(cnrNumber: string) {
    this.tabService.addTab(cnrNumber, CourtComponent, cnrNumber);
  }

  loadFslInformation(fslid: string) {
    this.tabService.addTab(fslid, ForensicComponent, fslid);
  }

  loadProsecutionInformation(eProcId: string) {
    this.tabService.addTab(eProcId, ProsecutionComponent, eProcId);
  }

  // loadPrisonerInfo(prisonerId: string, stateCode: string) {    

  //   this.tabService.addTab(prisonerId, PrisonComponent, { stateCode, prisonerId });
  // }
  loadPrisonerInfo(prisonerId: string, stateCode: string) {
    const firnumber = (localStorage.getItem('FIRNO') || '').replace(/['"\\]/g, '');
    const PS_CD = (localStorage.getItem('PS_CD') || '').replace(/['"\\]/g, '');

    this.tabService.addTab(prisonerId, PrisonComponent, {
      stateCode,
      prisonerId,
      firnumber,
      PS_CD
    });
  }

  loadMiniStatement(firNumber: string) {

    this.tabService.addTab(firNumber, MiniStatementComponent, firNumber);
  }

  loadMedleprInfo(transactionNumber: string) {
    const firnumber = (localStorage.getItem('FIRNO') || '').replace(/['"\\]/g, '');
    const PS_CD = (localStorage.getItem('PS_CD') || '').replace(/['"\\]/g, '');
    this.tabService.addTab(transactionNumber, MedleprComponent, {
      transactionNumber,
      firnumber,
      PS_CD
    });
  }
  // loadMedleprInfo(transactionNumber: string) {
  //   this.tabService.addTab(transactionNumber, MedleprComponent, transactionNumber);
  // }
}