import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  key = 'd0SeF';

  basicEncrypt(source: string): string {
    let encryptedString = '';
    for (let i = 0; i < source.length; i++) {
      const passOffset = i % this.key.length;
      const calAscii = source.charCodeAt(i) + this.key.charCodeAt(passOffset);
      encryptedString += String.fromCharCode(calAscii);
    }
    return encryptedString;
  }

  basicDecrypt(source: string): string {
    let decryptedCode = '';
    for (let i = 0; i < source.length; i++) {
      const passOffset = i % this.key.length;
      const calAscii = source.charCodeAt(i) - this.key.charCodeAt(passOffset);
      decryptedCode += String.fromCharCode(calAscii);
    }
    return decryptedCode;
  }
}
