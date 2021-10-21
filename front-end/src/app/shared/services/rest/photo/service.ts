import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudinaryPhoto } from 'src/app/shared/models/product';
import { BaseRestService } from '../base';
import { RequestMethod, RequestOptions, RequestRoute } from '../model';
import { ServiceMethod } from './model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService extends BaseRestService {
  route = RequestRoute.photo;

  constructor(protected injector: Injector) {
    super(injector);
  }

  uploadPhotos(photos: File[]): Observable<CloudinaryPhoto[]> {
    return new Observable<CloudinaryPhoto[]>((observer) => {
      const fd = new FormData();
      photos.forEach((photo) => {
        fd.append('photos', photo, photo.name);
      });
      this.uploadPhoto(fd).subscribe({
        next: (uploadedPhotos: CloudinaryPhoto[]) => {
          observer.next(uploadedPhotos);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  private uploadPhoto(photos: FormData): Observable<CloudinaryPhoto[]> {
    const options = {
      method: RequestMethod.post,
      serviceMethod: ServiceMethod.upload,
      body: photos
    } as RequestOptions;
    return this.send<CloudinaryPhoto[]>(options);
  }
}
