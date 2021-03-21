import { Injectable } from '@angular/core';
import { isPresent } from '../../util/common';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  key = 'd0SeF';

  basicEncrypt(source: string): string {
    if (!isPresent(source)) {
      return '';
    }
    let encryptedString = '';
    for (let i = 0; i < source.length; i++) {
      const passOffset = i % this.key.length;
      const calAscii = source.charCodeAt(i) + this.key.charCodeAt(passOffset);
      encryptedString += String.fromCharCode(calAscii);
    }
    return encryptedString;
  }

  basicDecrypt(source: string): string {
    if (!isPresent(source)) {
      return '';
    }
    let decryptedCode = '';
    for (let i = 0; i < source.length; i++) {
      const passOffset = i % this.key.length;
      const calAscii = source.charCodeAt(i) - this.key.charCodeAt(passOffset);
      decryptedCode += String.fromCharCode(calAscii);
    }
    return decryptedCode;
  }
}
