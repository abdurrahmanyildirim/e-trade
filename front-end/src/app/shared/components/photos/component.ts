import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { CloudinaryPhoto } from 'src/app/shared/models/product';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { MobileDetectionService } from '../../services/site/mobile-detection';
import { isPresent } from '../../util/common';

@Component({
  selector: 'app-photos',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() photos: CloudinaryPhoto[];
  @Input() width: number;
  @Input() height: number;
  @ViewChild('cover') cover: ElementRef<HTMLElement>;
  currentPhoto: CloudinaryPhoto;
  subs = new Subscription();
  currentIndex = 0;
  touchStart: number;
  touchEnd: number;
  timeOut: any;

  constructor(public mobileDet: MobileDetectionService) {}

  ngOnInit(): void {
    this.currentPhoto = this.photos[0];
  }

  ngAfterViewInit(): void {
    this.activeCurrentPhoto();
    if (this.mobileDet.isMobile.value) {
      this.listenTouchEvents();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentIndex = 0;
    this.currentPhoto = this.photos[0];
    if (isPresent(this.cover)) {
      this.cover.nativeElement.style.transform = 'translate3d(0px,0,0)';
      setTimeout(() => {
        this.activeCurrentPhoto();
      }, 10);
    }
  }

  listenTouchEvents(): void {
    let subs = fromEvent(this.cover.nativeElement, 'touchstart').subscribe((event: TouchEvent) => {
      this.cover.nativeElement.classList.remove('transiton');
      clearTimeout(this.timeOut);
      this.touchStart = event.changedTouches[0].screenX;
    });
    this.subs.add(subs);
    subs = fromEvent(this.cover.nativeElement, 'touchmove').subscribe((event: TouchEvent) => {
      const xloc =
        -this.currentIndex * this.width - (this.touchStart - event.changedTouches[0].screenX);
      this.cover.nativeElement.style.transform = 'translate3d(' + xloc + 'px, 0,0)';
    });
    this.subs.add(subs);
    subs = fromEvent(this.cover.nativeElement, 'touchend').subscribe((event: TouchEvent) => {
      this.touchEnd = event.changedTouches[0].screenX;
      if (this.touchEnd - this.touchStart > 30) {
        if (this.currentIndex > 0) {
          this.currentIndex--;
        }
      } else if (this.touchStart - this.touchEnd > 30) {
        if (this.currentIndex < this.photos.length - 1) {
          this.currentIndex++;
        }
      }
      this.changePhoto(this.currentIndex);
    });
    this.subs.add(subs);
  }

  changePhoto(index: number): void {
    this.currentIndex = index;
    this.currentPhoto = this.photos[index];
    this.cover.nativeElement.classList.add('transiton');
    this.cover.nativeElement.style.transform = 'translate3d(' + index * -this.width + 'px,0,0)';
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.cover.nativeElement.classList.remove('transiton');
    }, 550);
    this.activeCurrentPhoto();
  }

  activeCurrentPhoto(): void {
    this.photos.forEach((photo) => {
      const img = document.getElementById(photo._id);
      if (photo._id === this.currentPhoto._id) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0.5';
      }
    });
  }

  onMouseLeave(event: MouseEvent): void {
    if (!this.mobileDet.isMobile.value) {
      const image = document.getElementById('curr-' + this.currentPhoto._id);
      image.style.backgroundPosition = 'center';
      image.style.backgroundSize = '100%';
    }
  }

  onMouseEnter(event: MouseEvent): void {
    if (!this.mobileDet.isMobile.value) {
      const image = document.getElementById('curr-' + this.currentPhoto._id);
      image.style.backgroundSize = 2 * 100 + '%';
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.mobileDet.isMobile.value) {
      const image = document.getElementById('curr-' + this.currentPhoto._id);
      const width = image.offsetWidth;
      const height = image.offsetHeight;
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      const bgPosX = (mouseX / width) * 100;
      const bgPosY = (mouseY / height) * 100;
      image.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
    }
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    clearTimeout(this.timeOut);
    ObjectHelper.removeReferances(this);
  }
}
