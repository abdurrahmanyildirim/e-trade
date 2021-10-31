import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class GTAGService {
  init(key: string): void {
    if (isDevMode()) {
      return;
    }
    const lib = document.createElement('script');
    lib.async = true;
    lib.src = 'https://www.googletagmanager.com/gtag/js?id=' + key;
    document.head.appendChild(lib);
    const trigger = document.createElement('script');
    trigger.innerHTML = `window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', '${key}');
    `;
    document.head.appendChild(trigger);
  }
}
