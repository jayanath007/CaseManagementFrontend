import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNoteFolderComponent } from './components/add-note-folder/add-note-folder.component';
import { AddNoteTimeAndCostComponent } from './components/add-note-time-and-cost/add-note-time-and-cost.component';
import { AddNoteAttachmentsComponent } from './components/add-note-attachments/add-note-attachments.component';
import { AddNoteActionComponent } from './components/add-note-action/add-note-action.component';
import { AddNoteDiaryTypeComponent } from './components/add-note-diary-type/add-note-diary-type.component';
import { AddNoteForUserComponent } from './components/add-note-for-user/add-note-for-user.component';
import { AddNoteFileUploadComponent, } from './components/add-note-file-upload/add-note-file-upload.component';
import { AddNoteMainComponent } from './components/add-note-main/add-note-main.component';
import { AddNoteLayoutComponent } from './components/add-note-layout/add-note-layout.component';
import { MatterLinkedDesktopModule } from './../matter-linked-desktop/matter-linked-desktop.module';
import { SharedModule } from '../shared/shared.module';
import { AddNoteCoreModule } from '../add-note-core/add-note-core.module';

import {
  MatTabsModule, MatTableModule, MatCheckboxModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatExpansionModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatIconModule,
  MatToolbarModule,
  MatListModule,
  MatTooltipModule,
  MatDialogModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MAT_DATE_LOCALE,
  MatMenuModule

} from '@angular/material';
import { AddNoteManagerComponent } from './containers/add-note-manager.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import { AddNotePopupComponent } from './containers/add-note-popup.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { DocumentViewModule } from '../document-view/document-view.module';
import { EffectsModule } from '@ngrx/effects';
import { AddNoteEffects } from './effects/add-note-effects';
import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';
import { AddNoteFolderMenuComponent } from './components/add-note-folder-menu/add-note-folder-menu.component';

@NgModule({
  imports: [FormsModule,
    CommonModule,
    SharedModule,
    MatTabsModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatToolbarModule,
    AddNoteCoreModule,
    MailDesktopSharedModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSnackBarModule,
    DocumentViewModule,
    MatterLinkedDesktopModule,
    MatMenuModule,
    EffectsModule.forFeature([AddNoteEffects]),
  ],
  declarations: [AddNoteLayoutComponent,
    AddNoteMainComponent,
    AddNoteAttachmentsComponent,
    AddNoteFileUploadComponent,
    AddNoteForUserComponent,
    AddNoteFolderComponent,
    AddNoteDiaryTypeComponent,
    AddNoteActionComponent,
    AddNoteTimeAndCostComponent,
    AddNoteManagerComponent,
    AddNotePopupComponent,
    AddNoteFolderMenuComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  entryComponents: [AddNoteFileUploadComponent, AddNotePopupComponent]
})
export class AddNoteDesktopModule {
  popupComponent = AddNotePopupComponent;
}
