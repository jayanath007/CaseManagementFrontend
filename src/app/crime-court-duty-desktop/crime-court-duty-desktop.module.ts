import { CkEditorModule } from './../ck-editor/ck-editor.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrimeCourtDutyLayoutComponent } from './components/crime-court-duty-layout/crime-court-duty-layout.component';
// import { CrimeCourtDutyDesktopPopupComponent } from './crime-court-duty-desktop-popup.component';
import { CrimeCourtDutyDesktopManagerComponent } from './containers/crime-court-duty-desktop-manager.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import {
  MatIconModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, MatDatepickerModule, MatInputModule,
  MatCheckboxModule, MatTooltipModule,
  MatNativeDateModule, MatToolbarModule,
  MatProgressBarModule, MatExpansionModule,
  MatListModule, MAT_DATE_LOCALE, MatPaginatorModule, MatTabsModule
} from '@angular/material';
import { DocumentViewModule } from '../document-view/document-view.module';
import { BillingGuideCoreModule } from '../billing-guide-core/billing-guide-core.module';
import { CrimeCourtDutyDesktopPopupComponent } from './containers/crime-court-duty-desktop-popup.component';
import { CrimeCourtDutyCoreModule } from '../crime-court-duty-core/crime-court-duty-core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { EffectsModule } from '@ngrx/effects';
import { CourtDutyEffects } from './effects/court-duty-effects';

@NgModule({
  imports: [FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    DocumentViewModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTabsModule,
    MatPaginatorModule,
    BillingGuideCoreModule,
    MatListModule,
    CrimeCourtDutyCoreModule,
    CkEditorModule,
    EffectsModule.forFeature([CourtDutyEffects])
  ],

  declarations: [CrimeCourtDutyLayoutComponent,
    CrimeCourtDutyDesktopManagerComponent,
    CrimeCourtDutyDesktopPopupComponent],

  entryComponents: [CrimeCourtDutyDesktopPopupComponent],
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

})
export class CrimeCourtDutyDesktopModule {
  popupComponent = CrimeCourtDutyDesktopPopupComponent;
}
