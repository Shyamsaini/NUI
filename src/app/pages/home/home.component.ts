import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { User } from './../models/user.model';
import Swal from 'sweetalert2';

import { ParentChildService } from '../services/parent-child.service';
import { LoaderService } from '../services/loader.service';
import { UtilityService } from '../services/utility.service';
import { DecryptApiService } from '../services/decrypt-api.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit, AfterViewInit {

  captchaId: string = '';
  captchaUrl: string = '';
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';
  otp6: string = '';
  isOtpTextVisible: boolean = false;
  isOtpButton: boolean = false;
  isOtpReSendButton: boolean = false;
  isOtpVerfiy: boolean = false;
  modalRef: NgbModalRef | undefined;
  selectedStateCode: number = 0;
  mobileNumber: string = '';
  captch_input: string = '';
  code: string = '';
  resultCode: any = 0;
  selectedStateName: string = '';
  states: any[] = [];

  config = {
    cssClass: 'custom-captcha-class',
    type: 2,
    font: { size: '20px', family: 'Arial', color: '#000000' },
    back: { stroke: '#2F9688', solid: '#f2efd2' },
    length: 6
  };


  constructor(private modalService: NgbModal, private router: Router, private authService: AuthService, private route: ActivatedRoute, private ref: ChangeDetectorRef,
    private parentChildService: ParentChildService, private loaderService: LoaderService, private utilityService: UtilityService,
    private encryptApiService: DecryptApiService
  ) { }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    // Load states
    this.authService.getStates().subscribe((data: any[]) => {
      this.states = data;
    });


    this.createCaptcha();
    debugger;
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const state = params['state'];
      if (code && state && code.trim() !== '' && state.trim() !== '') {
        this.authService.exchangeToken(this.encryptApiService.encryptAesToDotNet(code), this.encryptApiService.encryptAesToDotNet(state)).subscribe(
          (response) => {
            localStorage.setItem('AuthorizationToken', response.data.access_token);
            this.authService.UserDetails(response.data.access_token).subscribe(
              (response) => {
                const mobileNo = response.data.mobileNo;
                const stateCode = localStorage.getItem('stateCode') ?? '';
                this.verfiyloginwithJanParichay(stateCode, mobileNo);
              }
            )
          }
        );
      }
    });
  }

  verfiyloginwithJanParichay(savedState: string, mobileNo: string): void {
    debugger
    this.loaderService.show();
    this.authService.loginWithJanParichay(savedState, mobileNo).subscribe(
      response => {
        if (response.isSuccess) {
          this.isOtpTextVisible = false;
          this.isOtpVerfiy = false;
          this.isOtpButton = false;
          this.isOtpReSendButton = false;
          const data: User = response.data;
          if (localStorage.getItem('userData')) {
            localStorage.removeItem('userData');
          }

          if (localStorage.getItem('userName')) {
            localStorage.removeItem('userName');
          }

          localStorage.setItem('userData', JSON.stringify(data));
          localStorage.setItem('userName', data.name || '');

          if (this.modalRef) {
            this.modalRef.close();
          }

          Swal.fire({
            position: 'top-end',
            title: 'User is login successfully',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400', color: '#ffffff'
          });
          this.loaderService.hide();

          this.parentChildService.callParentFunction();
          this.router.navigate(['/dashboard']);
          // this.router.navigate(['/io-dashboard']).then(() => {
          //   window.location.reload();
          // });   
        }
        else {
          this.loaderService.hide();
          this.isOtpTextVisible = true;
          this.isOtpVerfiy = true;
          this.isOtpButton = false;
          this.isOtpReSendButton = true;

          this.clearSession();
          Swal.fire({
            position: 'center',
            title: response.message,
            showConfirmButton: false,
            timer: 2000,
            icon: 'warning',
            background: '#fff3cd',
            color: '#000000',
          });
        }
      },
      error => {
        this.loaderService.hide();
      }
    );
  }


  openLoginModal(content: any) {
    this.ResetLoginModel();
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  private clearSession(): void {
    localStorage.removeItem('userData');
    localStorage.removeItem('userName');
    localStorage.removeItem('AuthorizationToken');
    this.router.navigate(['']);
  }


  moveFocus(event: any, nextInput: any, prevInput: any) {

    const input = event.target as HTMLInputElement;
    const key = event.key;

    if (key === 'Backspace') {
      if (input.value === '' && prevInput) {
        prevInput.focus();

      } else {
        input.value = '';
      }
      return;
    }
    if (/^\d$/.test(input.value) && nextInput) {
      nextInput.focus();
    } else if (!/^\d$/.test(input.value)) {
      input.value = '';
    }
  }


  VerifyJanParichay() {
    if (!this.selectedStateCode || this.selectedStateCode.toString().trim() === '') {
      this.utilityService.ShowErrorPopup('Please select a state.');
      return;
    }

    localStorage.setItem('stateCode', this.selectedStateCode.toString());
    const stateCode= this.encryptApiService.encryptAesToDotNet(this.selectedStateCode.toString());
    this.authService.authorize(stateCode).subscribe(
      (response) => {
        if (response && response.isSuccess && response.data) {
          const authorizationUrl = response.data;
          window.location.href = authorizationUrl;
        } else {
          this.handleAuthorizationError('Invalid or empty response from server.');
        }
      },

      error => {
        console.error('API error:', error);
        this.handleAuthorizationError('Failed to connect to the server.');
      }
    );
  }

  private handleAuthorizationError(message: string): void {
    Swal.fire({
      position: 'center',
      title: message,
      showConfirmButton: false,
      timer: 2000,
      icon: 'warning',
      background: '#fff3cd',
      color: '#000000',
    });
  }



  resetOtpState(message: string) {
    this.createCaptcha();
    this.isOtpTextVisible = false;
    this.isOtpVerfiy = false;
    this.isOtpButton = true;
    this.isOtpReSendButton = false;
    Swal.fire({
      position: 'center',
      title: message,
      showConfirmButton: false,
      timer: 2000,
      background: '#fff3cd',
      color: '#000000',
    });
  }

  verifyMobile() {
    debugger
    this.loaderService.show();

    const mobileNumber = this.mobileNumber;
    const stateCode: number = this.selectedStateCode;
    this.authService.verifyMobile(mobileNumber, stateCode, this.captch_input, this.captchaId).subscribe(

      response => {
        if (response.isSuccess) {
          this.isOtpTextVisible = true;
          this.isOtpVerfiy = true;
          this.isOtpButton = false;
          this.isOtpReSendButton = true;

          Swal.fire({
            position: 'top-end',
            title: 'The OTP has been sent successfully to the user’s registered mobile number.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400', color: '#ffffff'
          });
          this.loaderService.hide();
        }
        else {
          debugger
          this.createCaptcha();
          this.isOtpTextVisible = false;
          this.isOtpVerfiy = false;
          this.isOtpButton = true;
          this.isOtpReSendButton = false;
          this.utilityService.ShowErrorPopup(response.message);
          // Swal.fire({            
          //   position: 'center',
          //   title: response.message,
          //   showConfirmButton: false,
          //  // timer: 2000, icon: 'warning', background: '#efefef',
          //   color: '#000000',
          // });
          this.loaderService.hide();
        }
      },
      error => {
        this.loaderService.hide();
      }
    );
  }


  CaptchaRefresh() {
    this.createCaptcha();
  }

  getOtpValue(): string {
    return `${this.otp1}${this.otp2}${this.otp3}${this.otp4}${this.otp5}${this.otp6}`;
  }
  verfiyOTPUser() {
    this.loaderService.show();
    const otp = this.getOtpValue();
    const mobileNumber = this.mobileNumber;
    const stateCode: number = this.selectedStateCode;
    this.authService.verifyOtp(stateCode, mobileNumber, otp).subscribe(
      response => {
        if (response.isSuccess) {
          this.isOtpTextVisible = false;
          this.isOtpVerfiy = false;
          this.isOtpButton = false;
          this.isOtpReSendButton = false;
          console.log('API true response:', response);
          const data: User = response.data;
          if (localStorage.getItem('userData')) {
            localStorage.removeItem('userData');
          }

          if (localStorage.getItem('userName')) {
            localStorage.removeItem('userName');
          }

          if (localStorage.getItem('roleName')) {
            localStorage.removeItem('roleName');
          }
          const selected = this.states.find(state => state.StateCode == this.selectedStateCode);
          this.selectedStateName = selected ? selected.stateName : '';
          localStorage.setItem('statename', this.selectedStateName);
          // localStorage.setItem('IsStaging', response.data.isStaging);

          // Set in localStorage


          if (localStorage.getItem('selectedStateName')) {
            localStorage.removeItem('selectedStateName');
          }
          localStorage.setItem('selectedStateName', this.selectedStateName);


          localStorage.setItem('userData', JSON.stringify(data));
          localStorage.setItem('userName', data.name || '');
          localStorage.setItem('stateCode', data.stateCode.toString() || '');
          localStorage.setItem('roleName', response.data.roles[0].roleName || '');


          if (this.modalRef) {
            this.modalRef.close();
          }

          Swal.fire({
            position: 'top-end',
            title: 'User is login successfully',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              popup: 'custom-alert',
              title: 'custom-title',
            },
            background: '#006400',
          });
          this.loaderService.hide();
          this.router.navigate(['/dashboard']);

        }
        else {
          this.loaderService.hide();
          this.isOtpTextVisible = true;
          this.isOtpVerfiy = true;
          this.isOtpButton = false;
          this.isOtpReSendButton = true;
          this.utilityService.ShowErrorPopup(response.message);
          // Swal.fire({
          //   position: 'center',
          //   title: response.message,
          //   showConfirmButton: false,
          //   icon: 'warning',
          //   timer: 2000,
          //   // background: '#fff3cd', 
          //   // color: '#000000', 
          //   background: '#006400', color: '#ffffff'
          // });
        }
      },
      error => {
      }
    );
  }

  createCaptcha(): void {

    this.loaderService.show();

    this.authService.generateCaptcha().subscribe(response => {

      this.loaderService.hide();

      if (response.isSuccess) {
        this.captchaUrl = `data:image/png;base64, ${response.data.captcha}`;
        this.captchaId = response.data.captchaId;
      }
      else {
        Swal.fire({
          position: 'center',
          title: response.message,
          showConfirmButton: false,
          timer: 2000,
          icon: 'warning',
          background: '#fff3cd',
          color: '#000000',
        });
      }
    });
  }

  ResetLoginModel() {
    this.createCaptcha();
    this.captch_input = '';
    this.mobileNumber = '';
    //this.selectedStateCode = 0;
    this.otp1 = '';
    this.otp2 = '';
    this.otp3 = '';
    this.otp4 = '';
    this.otp5 = '';
    this.otp6 = '';
    this.isOtpTextVisible = false;
    this.isOtpVerfiy = false;
    this.isOtpButton = true;
    this.isOtpReSendButton = false;
  }
}

