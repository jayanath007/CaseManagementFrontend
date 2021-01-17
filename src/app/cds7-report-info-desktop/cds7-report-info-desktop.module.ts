import { MatDividerModule, MAT_DATE_LOCALE } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { Cds7ReportInfoPopupComponent } from './containers/cds7-report-info-popup.component';
import { Cds7ReportInfoPopupManagerComponent } from './containers/cds7-report-info-popup-manager.component';
import { Cds7ReportInfoContentComponent } from './components/cds7-report-info-content/cds7-report-info-content.component';
import { MatCheckboxModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { Cds7ReportInfoCoreModule } from '../cds7-report-info-core/cds7-report-info-core.module';
import { EffectsModule } from '@ngrx/effects';
import { Cds7ReportInfoEffects } from './effects/cds7-report-info.effects';

@NgModule({
  imports: [
    Cds7ReportInfoCoreModule,
    CommonModule,
    SharedModule,
    MatDividerModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EffectsModule.forFeature([Cds7ReportInfoEffects])
  ],
  declarations: [Cds7ReportInfoPopupComponent, Cds7ReportInfoPopupManagerComponent, Cds7ReportInfoContentComponent],
  entryComponents: [Cds7ReportInfoPopupComponent],
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
export class Cds7ReportInfoDesktopModule {
  popupComponent = Cds7ReportInfoPopupComponent;
}
