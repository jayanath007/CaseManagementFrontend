
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpsCkEditorComponent } from './dps-ck-editor.component';
import { InstanceRef } from './instance-ref';
import { InlineImageRendereDirective } from './inline-image-rendere.directive';
import { DpsCkSignatureDirective } from './dps-ck-signature.directive';
import { DpsCkAutoResizeDirective } from './dps-ck-auto-resize.directive';
import { DpsCkEditorImgDirective } from './dps-ck-editor-img.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DpsCkEditorComponent, InlineImageRendereDirective, DpsCkSignatureDirective,
     DpsCkAutoResizeDirective, DpsCkEditorImgDirective],
  exports: [DpsCkEditorComponent, InlineImageRendereDirective, DpsCkSignatureDirective,
    DpsCkAutoResizeDirective, DpsCkEditorImgDirective]

})
export class CkEditorModule { }
