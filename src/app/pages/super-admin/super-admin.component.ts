import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentChildService } from '../services/parent-child.service';
import { LoaderService } from '../services/loader.service';
import Swal from 'sweetalert2';
import { User } from '../models/user.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  @ViewChild('content') otpModalTemplate: any;
  states: any[] = [];
  selectedStateCode: number = 0;
  isOtpButton: boolean = false;
  isOtpTextVisible: boolean = false;
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';
  otp6: string = '';
  selectedStateName: string = '';
  mobileNumber: string = '';
  isOtpReSendButton: boolean = false;
  isOtpVerfiy: boolean = false;
  modalRef: NgbModalRef | undefined;
  captchaId: string = '';
  captchaUrl: string = '';
  captch_input: string = '';

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
    private parentChildService: ParentChildService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private router: Router,
    private utilityService: UtilityService
  ) { }



  ngOnInit(): void {

    this.renderer.addClass(document.body, 'super-admin-page');

    this.authService.getStates().subscribe((data: any[]) => {
      this.states = data;
    });
    this.createCaptcha();
    console.log(this.states);
  }

  verifyMobile() {
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
          // ✅ Open the OTP modal
          // this.modalService.open(this.otpModalTemplate, { centered: true, backdrop: 'static' });
          this.modalRef = this.modalService.open(this.otpModalTemplate, { centered: true, backdrop: 'static' });

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
          this.createCaptcha();
          this.isOtpTextVisible = false;
          this.isOtpVerfiy = false;
          this.isOtpButton = true;
          this.isOtpReSendButton = false;
          this.utilityService.ShowErrorPopup(response.message);
          this.loaderService.hide();
        }
      },
      error => {
        this.loaderService.hide();
      }
    );
  }
  openOtpModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, { centered: true });
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
          localStorage.setItem('roleName', data.name || '');

          this.modalService.dismissAll(); 

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
        }
      },
      error => {
      }
    );
  }


  allowOnlyNumbers(event: KeyboardEvent): void {
  const charCode = event.charCode;

  // Allow only digits (0-9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault(); // block non-numeric keys
  }
}

  openLoginModal(content: any) {
    this.ResetLoginModel();
    this.modalRef = this.modalService.open(content, { centered: true });
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
  CaptchaRefresh() {
    this.createCaptcha();
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


//   ngOnDestroy(): void {
//     console.log('SuperAdminComponent destroyed');
//     this.renderer.removeClass(document.body, 'super-admin-page');
//   }

 }
