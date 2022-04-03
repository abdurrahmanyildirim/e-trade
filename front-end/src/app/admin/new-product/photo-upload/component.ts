import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/components/snackbar/service';
import { CloudinaryPhoto } from 'src/app/shared/models/product';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { isPresent } from 'src/app/shared/util/common';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './component.html',
  styleUrls: ['./component.css']
})
export class PhotoUploadComponent implements OnDestroy {
  @Output() filesChange = new EventEmitter<File[]>();
  subs = new Subscription();
  uploadedPhotos = [];
  files: File[] = [];
  suppotedPhotos = new Map<string, string>([
    ['jpg', 'jpg'],
    ['jpeg', 'jpeg'],
    ['png', 'png'],
    ['jfif', 'jfif']
  ]);
  uploadedFileCount = 0;
  fileCount = 0;
  showProgress = false;

  constructor(private snackBar: SnackbarService, private cd: ChangeDetectorRef) {}

  onPhotoUpload(event: any): void {
    const files = event.target.files;
    if (this.files.length + files.length > 4 || files.length > 4) {
      this.snackBar.showError('En fazla 4 fotoğraf yüklenebilir');
      return;
    }
    this.fileCount = files.length;
    this.showProgress = true;
    for (const file of files) {
      if (!this.isSupportedFile(file)) {
        return;
      }
      const subs = this.readFile(file).subscribe({
        next: (fileString) => {
          this.files.push(file);
          this.uploadedPhotos.push(fileString);
          this.uploadedFileCount++;
          if (this.uploadedFileCount === files.length) {
            this.showProgress = false;
            this.uploadedFileCount = this.fileCount = 0;
            event.target.value = event.target.files = null;
            this.emitFiles();
          }
          this.cd.detectChanges();
        },
        error: (err) => console.log(err)
      });
      this.subs.add(subs);
    }
  }

  isSupportedFile(file: File): boolean {
    const splitedName = file.name.split('.');
    const extension = splitedName[splitedName.length - 1];
    return this.suppotedPhotos.has(extension);
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

  drop(event: CdkDragDrop<string[]>): void {
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

  reset(): void {
    this.files = [];
    this.uploadedPhotos = [];
  }

  emitFiles(): void {
    this.filesChange.emit(this.files);
  }

  ngOnDestroy(): void {
    if (isPresent(this.subs)) {
      this.subs.unsubscribe();
    }
  }
}
