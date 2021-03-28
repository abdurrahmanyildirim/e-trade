import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { CloudinaryPhoto } from 'src/app/shared/models/product';
import { ObjectHelper } from 'src/app/shared/util/helper/object';
import { isPresent } from '../../util/common';

@Component({
  selector: 'app-photos',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() photos: CloudinaryPhoto[];
  @Input() width: number;
  @Input() height: number;
  @ViewChild('cover') cover: ElementRef<HTMLElement>;
  currentPhoto: CloudinaryPhoto;
  subs = new Subscription();
  currentIndex = 0;
  touchStart: number;
  touchEnd: number;

  ngOnInit(): void {
    this.currentPhoto = this.photos[0];
  }

  ngAfterViewInit(): void {
    this.activeCurrentPhoto();
    if (document.body.clientWidth <= 650) {
      this.listenTouchEvents();
    }
  }

  listenTouchEvents(): void {
    let subs = fromEvent(this.cover.nativeElement, 'touchstart').subscribe((event: TouchEvent) => {
      this.touchStart = event.changedTouches[0].screenX;
    });
    this.subs.add(subs);
    subs = fromEvent(this.cover.nativeElement, 'touchend').subscribe((event: TouchEvent) => {
      this.touchEnd = event.changedTouches[0].screenX;
      if (this.touchStart < this.touchEnd) {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.currentPhoto = this.photos[this.currentIndex];
          this.changePhoto(this.currentIndex, this.currentPhoto._id);
        }
      } else {
        if (this.currentIndex < this.photos.length - 1) {
          this.currentIndex++;
          this.currentPhoto = this.photos[this.currentIndex];
          this.changePhoto(this.currentIndex, this.currentPhoto._id);
        }
      }
    });
    this.subs.add(subs);
  }

  onMiniPhotoClick(id: string): void {
    this.currentPhoto = this.photos.find((photo) => photo._id === id);
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
    const image = document.getElementById('curr-' + this.currentPhoto._id);
    image.style.backgroundPosition = 'center';
    image.style.backgroundSize = '100%';
  }

  onMouseEnter(event: MouseEvent): void {
    const image = document.getElementById('curr-' + this.currentPhoto._id);
    image.style.backgroundSize = 1.4 * 100 + '%';
  }

  onMouseMove(event: MouseEvent): void {
    const image = document.getElementById('curr-' + this.currentPhoto._id);
    const width = image.offsetWidth;
    const height = image.offsetHeight;
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    const bgPosX = (mouseX / width) * 100;
    const bgPosY = (mouseY / height) * 100;
    image.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
  }

  changePhoto(index: number, id: string): void {
    this.currentIndex = index;
    this.cover.nativeElement.style.transform = 'translateX(' + -index * this.width + 'px)';
    this.onMiniPhotoClick(id);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
    ObjectHelper.removeReferances(this);
  }
}
