// tab.service.ts
import { Injectable } from '@angular/core';
import { TabContainerComponent } from '../_components/tabs/tab-container.component';

@Injectable({
  providedIn: 'root'
})
export class OtherPillarsServicesService {
  private tabContainer?: TabContainerComponent;
  private tabCounter = 1;

  setTabContainer(container: TabContainerComponent) {
    this.tabContainer = container;
  }

  addTab(title: string, component: any, data: any) {
    if (this.tabContainer) {
      this.tabContainer.addTab(title, component, data);
      this.tabCounter++;
    }
  }

  getCounter() {
    return this.tabCounter;  
  }
}