import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { CloudinaryPhoto } from 'src/app/shared/models/product';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PhotoUploadComponent {
  @Output() filesChange = new EventEmitter<File[]>();
  uploadedPhotos: CloudinaryPhoto[] = [];
  files: File[] = [];
  counter = 11;
  suppotedPhotos = new Map<string, string>([
    ['jpg', 'jpg'],
    ['jpeg', 'jpeg'],
    ['png', 'png']
  ]);

  constructor(private snackBar: SnackbarService) {}

  onPhotoUpload(event: any): void {
    const files = event.target.files;
    if (this.files.length >= 4 || files.length > 4) {
      this.snackBar.showError('En fazla 4 fotoğraf yüklenebilir');
      return;
    }
    for (const file of files) {
      if (this.isSupportedFile(file)) {
        this.readFile(file).subscribe({
          next: (fileString) => {
            this.counter++;
            this.files.push(file);
            this.uploadedPhotos.push({
              path: fileString as string,
              publicId: 'photo' + this.counter,
              _id: 'photoId' + this.counter
            });
            this.emitFiles();
          },
          error: (err) => console.log(err)
        });
      }
    }
    event.target.files = null;
  }

  isSupportedFile(file: File): boolean {
    const ext = file.name.split('.')[file.name.split('.').length - 1];
    if (!this.suppotedPhotos.has(ext)) {
      return false;
    }
    return true;
  }

  readFile(file: File): Observable<string> {
    return new Observable<string>((observer) => {
      try {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          observer.next(reader.result as string);
          reader = null;
          observer.complete();
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.uploadedPhotos, event.previousIndex, event.currentIndex);
    moveItemInArray(this.files, event.previousIndex, event.currentIndex);
    this.emitFiles();
  }

  extractPhoto(photo: CloudinaryPhoto): void {
    const index = this.uploadedPhotos.indexOf(photo);
    this.uploadedPhotos.splice(index, 1);
    this.files.splice(index, 1);
    this.emitFiles();
  }

  reset() {
    this.files = [];
    this.uploadedPhotos = [];
  }

  emitFiles() {
    this.filesChange.emit(this.files);
  }
}
