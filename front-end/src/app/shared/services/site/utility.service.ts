import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  photoShower(path: string): void {
    let overlay = this.overlay();
    const img = document.createElement('img');
    img.src = path;
    if (document.body.clientWidth >= document.body.clientHeight) {
      img.style.height = document.body.clientHeight * 0.8 + 'px';
    } else {
      img.style.width = document.body.clientWidth * 0.8 + 'px';
    }
    let imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    imgContainer.style.lineHeight = '0';
    let closeBtn = this.closeButton();
    imgContainer.appendChild(closeBtn);
    imgContainer.appendChild(img);
    overlay.appendChild(imgContainer);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (event) => {
      if (event.target !== img) {
        imgContainer.remove();
        imgContainer = null;
        closeBtn.remove();
        closeBtn = null;
        overlay.remove();
        overlay = null;
      }
    });
  }

  private overlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.position = 'fixed';
    overlay.style.zIndex = '15';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.height = '100%';
    overlay.style.width = '100%';
    overlay.style.top = '0';
    return overlay;
  }

  private closeButton(): HTMLElement {
    const closeBtn = document.createElement('div');
    closeBtn.classList.add('close-icon');
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.width = '20px';
    closeBtn.style.height = '20px';
    closeBtn.style.borderRadius = '10px';
    closeBtn.style.backgroundColor = '#ccc';
    return closeBtn;
  }
}
