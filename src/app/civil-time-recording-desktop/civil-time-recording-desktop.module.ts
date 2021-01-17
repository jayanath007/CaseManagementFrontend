

import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service'; import { AuthInterceptorService } from '../auth';
import {
  MatButtonModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule,
  MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule,
  MatListModule, MatNativeDateModule, MatProgressBarModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule,
  MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MAT_DATE_LOCALE, MatPaginatorModule, MatCardModule
} from '@angular/material';
import { CivilTimeRecordingManagerComponent } from './containers/civil-time-recording-manager.component';
import { CivilTimeRecordingRouterHostComponent } from './containers/civil-time-recording-router-host.component';
import { SharedModule } from '../shared/shared.module';
import {
  CivilTimeRecordingMainLayoutComponent
} from './components/civil-time-recording-main-layout/civil-time-recording-main-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { CivilTimeRecordEffects } from './effects/civil-time-records-effects';
import { CivilTimeRecordsService } from './services/civil-time-records.service';
import { LegalHelpTimeRecordingComponent } from './components/legal-help-time-recording/legal-help-time-recording.component';
import { TimeRecordedTabContentComponent } from './components/time-recorded-tab-content/time-recorded-tab-content.component';
import { CertificatedTimeRecordingComponent } from './components/certificated-time-recording/certificated-time-recording.component';
import { CkEditorModule } from '../ck-editor/ck-editor.module';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule, MatTableModule, MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
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
    StoreModule.forFeature('dpsCivilTimeRecording', reducers),
    EffectsModule.forFeature([CivilTimeRecordEffects]),
    MatGridListModule,
    MatPaginatorModule,
    CkEditorModule
  ],
  declarations: [CivilTimeRecordingManagerComponent,
    CivilTimeRecordingRouterHostComponent,
    CivilTimeRecordingMainLayoutComponent,
    TimeRecordedTabContentComponent,
    LegalHelpTimeRecordingComponent,
    CertificatedTimeRecordingComponent],
  entryComponents: [CivilTimeRecordingRouterHostComponent],
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
    CivilTimeRecordsService
  ],

})
export class CivilTimeRecordingDesktopModule {
  popupComponent = CivilTimeRecordingRouterHostComponent;
}


