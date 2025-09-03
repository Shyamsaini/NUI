import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Injector, Input, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicModalService } from '../../services/dynamic-modal.service';
import { UtilityService } from '../../services/utility.service';
import { ModalService } from '../../services/modal.service';
import { LoaderService } from '../../services/loader.service';
@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrl: './dynamic-modal.component.css'
})
export class DynamicModalComponent {
  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true }) dynamicContent!: ViewContainerRef;
  private componentRef!: ComponentRef<any>;
  @Input() componentType!: Type<any>;
  @Input() componentData: any;
  header:string = "";

  constructor(public dynamicModalService: DynamicModalService, 
    private ref: ChangeDetectorRef,
    private utilityService: UtilityService, protected  modalService: ModalService,private loaderService: LoaderService) {}

  loadDynamicComponent(data: any) {
    
    if (this.componentType) {
      if(this.componentType.name == "_ForensicComponent"){
      
        this.loaderService.show();
        this.dynamicModalService.loadFslInformation(data).subscribe((resp: { isSuccess: any; data: string; message: string; })=>{
        
          if(resp.isSuccess){
            this.dynamicContent.clear();
            this.header = "FSL Information";
            this.componentRef = this.dynamicContent.createComponent(this.componentType);
            this.componentRef.instance.loadFslInfo(JSON.parse(resp.data,data.psCode));
            this.modalService.open("modal-dynamicpopup");
            this.loaderService.hide();
          }
          else{
            this.utilityService.ShowErrorPopup(resp.message);
            this.loaderService.hide();
          }
        });
      }
      else if(this.componentType.name == "_CourtComponent"){
        this.loaderService.show();
        this.dynamicModalService.loadCaseInformation(data).subscribe((resp: { isSuccess: any; data: string; message: string; })=>{
          if(resp.isSuccess){
            this.dynamicContent.clear();
            this.header = "Case Information";
            this.componentRef = this.dynamicContent.createComponent(this.componentType);
            this.componentRef.instance.loadCaseinformation(JSON.parse(resp.data));
            this.modalService.open("modal-dynamicpopup");
            this.loaderService.hide();
          }
          else{
            this.utilityService.ShowErrorPopup(resp.message);
            this.loaderService.hide();
          }
        });
      }
      else if(this.componentType.name == "_MedleprComponent"){
        this.loaderService.show();
        this.dynamicModalService.loadMedleparInformation(data).subscribe((resp: { isSuccess: any; data: string; message: string; })=>{
          if(resp.isSuccess){
            this.dynamicContent.clear();
            this.header = "Medleapr Information";
            this.componentRef = this.dynamicContent.createComponent(this.componentType);
            this.componentRef.instance.loadMedleprInfo(JSON.parse(resp.data));
            this.modalService.open("modal-dynamicpopup");
            this.loaderService.hide();
          }
          else{
            this.utilityService.ShowErrorPopup(resp.message);
            this.loaderService.hide();
          }
        });
      }
      else if(this.componentType.name == "_ProsecutionComponent"){
        this.loaderService.show();
        this.dynamicModalService.loadProsecutionInformation(data).subscribe((resp: { isSuccess: any; data: string; message: string; })=>{
          if(resp.isSuccess){
            this.dynamicContent.clear();
            this.header = "Prosecution Info";
            this.componentRef = this.dynamicContent.createComponent(this.componentType);
            this.componentRef.instance.loadProsecutionInfo(JSON.parse(resp.data).data,data.psCode);
            this.modalService.open("modal-dynamicpopup");
            this.loaderService.hide();
          }
          else{
            this.utilityService.ShowErrorPopup(resp.message);
            this.loaderService.hide();
          }
        });
      }
      else if (this.componentType.name == "_PrisonComponent") {
        this.loaderService.show();
        this.dynamicModalService.loadPrisonInformation(data).subscribe((resp: { isSuccess: any; data: string; message: string; }) => {
          if (resp.isSuccess) {
            this.dynamicContent.clear();
            this.header = "Prison Info";
            this.componentRef = this.dynamicContent.createComponent(this.componentType);
            this.componentRef.instance.loadPrisonInfo(JSON.parse(resp.data), data);
            this.modalService.open("modal-dynamicpopup");
            this.loaderService.hide();
          }
          else {
            this.utilityService.ShowErrorPopup(resp.message);
            this.loaderService.hide();
          }
        });
      }
    }
    this.ref.detectChanges();
  }


  close() {
    this.modalService.close();
  }
}
