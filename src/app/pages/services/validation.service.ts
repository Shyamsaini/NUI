import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      required: 'Required',
      invalidCreditCard: 'Is invalid credit card number',
      invalidEmailAddress: 'Invalid email address',
      invalidPassword:
        'Invalid password. Password must be at least 6 characters long, and contain a number.',
      minlength: `Minimum length ${validatorValue.requiredLength}`,
      invalidCurrency: 'Value must be number',
      invalidInteger: 'Value must be number',
      invalidTime: 'Invalid time'
    };

    if(validatorName == 'required'){
      return config.required;
    }
    else if(validatorName == 'invalidCreditCard'){
      return config.invalidCreditCard;
    }
    else if(validatorName == 'invalidEmailAddress'){
      return config.invalidEmailAddress;
    }
    else if(validatorName == 'invalidPassword'){
      return config.invalidPassword;
    }
    else if(validatorName == 'minlength'){
      return config.minlength;
    }
    else if(validatorName == 'invalidCurrency'){
      return config.invalidCurrency;
    }
    else if(validatorName == 'invalidInteger'){
      return config.invalidCurrency;
    }
    else if(validatorName == 'invalidTime'){
      return config.invalidTime;
    }

    return '';
  }

  static creditCardValidator(control: any) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  static emailValidator(control: any) {
    // RFC 2822 compliant regex
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static passwordValidator(control: any) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  static currencyValidator(control: any){
    if(typeof control.value.match !== 'undefined'){
      if(control.value == ''){
        return null;
      }
      if (control.value.match(/^[1-9]\d*(\.\d+)?$/)) {
        return null;
      } else {
        return { invalidCurrency: true };
      }
    }
    return null;
  }

  static integerValildator(control: any){
    if(typeof control.value.match !== 'undefined'){
      if (control.value.match(/^[0-9]+$/)) {
        return null;
      } else {
        return { invalidInteger: true };
      }
    }
    return null;
  }

  static validTime(control: any){
    if(control.value != null){
      if (typeof control.value.match !== 'undefined'){
        if(control.value !== '' || control.value != 'undefined'){
          if (control.value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
            return null;
          } else {
            if(control.value !== ''){
              return { invalidTime: true };
            }
          }
        }
        else{
          return null; 
        }
      }
    }
   
    return null;
  }
}
