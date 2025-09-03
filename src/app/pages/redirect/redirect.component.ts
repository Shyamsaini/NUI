import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  template: ''
})
export class RedirectComponent implements OnInit {

 constructor(private router: Router, private route: ActivatedRoute) {}

ngOnInit(): void {
    const currentUrl = this.router.url.toLowerCase();
    console.log('Current URL:', currentUrl);

    setTimeout(() => {
      if (currentUrl.includes('superadmin')) {
        this.router.navigateByUrl('/superadmindashboard'); 
      } else {
        this.router.navigateByUrl('/home');
      }
    });
  }
}
