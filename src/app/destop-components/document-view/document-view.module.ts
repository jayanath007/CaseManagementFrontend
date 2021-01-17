import { DocumenWindowPopupService } from './document-window-popup.service';
import { DocumentViewService } from './document-view.service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentViewComponent } from './document-view.component';
import { MatProgressBarModule, MatProgressSpinnerModule } from '@angular/material';
import { DocumentTranslationsService } from './document-translations.service';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    HttpClientModule,
    MatProgressSpinnerModule,
  ],
  exports: [DocumentViewComponent],
  declarations: [DocumentViewComponent],
  providers: [DocumenWindowPopupService, DocumentTranslationsService, DocumentViewService],
})
export class DocumentViewModule { }
