import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class DecryptApiService {
   private key = CryptoJS.enc.Utf8.parse('cctnschandigarhp'); // 16-byte key
  private iv = CryptoJS.enc.Utf8.parse('cctnschandigarhp');  // 16-byte IV

  constructor() { }

  decryptAesFromDotNet(base64CipherText: string): string {
    const decrypted = CryptoJS.AES.decrypt(base64CipherText, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8); 
  }
  encryptAesToDotNet(ciphertext: string): string {
    const encrypted = CryptoJS.AES.encrypt(ciphertext, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }
}
