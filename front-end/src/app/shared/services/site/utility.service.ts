import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  photoShower(path: string): void {
    let back = this.backGroundElem();
    const img = document.createElement('img');
    img.src = path;
    const foo =
      document.body.clientWidth >= document.body.clientHeight
        ? document.body.clientHeight * 0.6
        : document.body.clientWidth * 0.6;
    img.style.width = foo + 'px';
    img.style.height = foo + 'px';
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    const closeBtn = this.closeButton();
    imgContainer.appendChild(closeBtn);
    imgContainer.appendChild(img);
    back.appendChild(imgContainer);
    document.body.appendChild(back);
    back.addEventListener('click', (event) => {
      if (event.target !== img) {
        back.remove();
        back = null;
      }
    });
  }

  private backGroundElem(): HTMLElement {
    const back = document.createElement('div');
    back.style.backgroundColor = 'rgba(0,0,0,0.5)';
    back.style.position = 'fixed';
    back.style.zIndex = '15';
    back.style.display = 'flex';
    back.style.alignItems = 'center';
    back.style.justifyContent = 'center';
    back.style.height = '100%';
    back.style.width = '100%';
    back.style.top = '0';
    return back;
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
