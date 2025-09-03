import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalEventService } from './pages/services/global-event.service';
import { DynamicModalService } from './pages/services/dynamic-modal.service';
import { ForensicComponent } from './pages/_components/forensic/forensic.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showLayout: boolean = true;

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    this.globalEvenService.emitClickEvent(event);
  }

  constructor(private router: Router, private globalEvenService: GlobalEventService, private dyanmicModelService: DynamicModalService) {
    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide layout for the HomeComponent route, show it for other routes
        this.showLayout = !(event.url === '/' || event.url === '/home');
      }
    });
  }

 

}