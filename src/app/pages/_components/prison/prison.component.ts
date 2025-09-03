import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-prison',
  templateUrl: './prison.component.html',
  styleUrl: './prison.component.css'
})
export class PrisonComponent {
  data:any;
  
  constructor(private ref: ChangeDetectorRef){

  }
  loadPrisonInfo(data: any) {
    this.data = data;
    console.log(this.data);
    this.ref.detectChanges();
  }
  activeSection: string = 'PrisonerDetail'; // Default open section
    toggleSection(section: string) {
        this.activeSection = this.activeSection === section ? '' : section;
    }
}
