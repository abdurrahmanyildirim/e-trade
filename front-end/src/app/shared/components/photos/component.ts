import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CloudinaryPhoto } from 'src/app/shared/models/product';
import { ObjectHelper } from 'src/app/shared/util/helper/object';

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
  currentPhoto: CloudinaryPhoto;

  ngOnInit(): void {
    this.currentPhoto = this.photos[0];
  }

  ngAfterViewInit(): void {
    this.activeCurrentPhoto();
  }

  onPhotoClick(id: string): void {
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

  ngOnDestroy(): void {
    ObjectHelper.removeReferances(this);
  }
}
