import { Injectable, isDevMode } from '@angular/core';
import { isPresent } from '../../util/common';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private v1 = isDevMode() ? 'd0SeF' : 'd0SFe';

  basicEncrypt(source: string): string {
    if (!isPresent(source)) {
      return '';
    }
    let encryptedString = '';
    for (let i = 0; i < source.length; i++) {
      const passOffset = i % this.v1.length;
      const calAscii = source.charCodeAt(i) + this.v1.charCodeAt(passOffset);
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
      const passOffset = i % this.v1.length;
      const calAscii = source.charCodeAt(i) - this.v1.charCodeAt(passOffset);
      decryptedCode += String.fromCharCode(calAscii);
    }
    return decryptedCode;
  }
}
