import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EditorComponent } from './component';

@NgModule({
  declarations: [EditorComponent],
  imports: [AngularEditorModule, FormsModule],
  exports: [EditorComponent]
})
export class EditorModule {}
