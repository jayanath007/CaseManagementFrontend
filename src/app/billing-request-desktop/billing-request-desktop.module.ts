import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatIconModule,
  MatTabsModule,
  MatExpansionModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MAT_DATE_LOCALE,
  MatProgressBarModule,
  MatToolbarModule,
  MatNativeDateModule,
  MatListModule,
  MatRadioModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatMenuModule,
  MatFormFieldModule
} from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';
import { BillingRequestManagerComponent } from './containers/billing-request-manager.component';
import { BillingRequestRouterHostComponent } from './containers/billing-request-router-host.component';
import { BillingRequestCoreModule } from '../billing-request-core/billing-request-core.module';
import { BillingRequestLayoutComponent } from './components/billing-request-layout/billing-request-layout.component';
import { BillingDetailsDataComponent } from './components/billing-details-data/billing-details-data.component';
import { BillingRequestImportDataComponent } from './components/billing-request-import-data/billing-request-import-data.component';
import { BillingRequestAddRecordDataComponent }
  from './components/billing-request-add-record-data/billing-request-add-record-data.component';
import { PrintOptionsDataComponent } from './components/print-options-data/print-options-data.component';
import { BillingRequestEffects } from './effects/billing-request.effects';
import { BillingRequestImportDataManagerComponent } from './containers/billing-request-import-data-manager.Component';
import { AddRecordManagerComponent } from './containers/add-record-manager.component';
import { PrintSettingManagerComponent } from './containers/print-setting-manager.component';
import { BillingRequestEditTimeComponent } from './components/billing-request-edit-time/billing-request-edit-time.component';
import { BillingRequestEditTimeManagerComponent } from './containers/billing-request-edit-time-manager.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BillingRequestCoreModule,
    FlexLayoutModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMenuModule,
    MatRadioModule,
    MatFormFieldModule,
    EffectsModule.forFeature([BillingRequestEffects]),
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
  declarations: [
    BillingRequestManagerComponent,
    BillingRequestRouterHostComponent,
    BillingRequestLayoutComponent,
    BillingDetailsDataComponent,
    BillingRequestImportDataComponent,
    BillingRequestAddRecordDataComponent,
    PrintOptionsDataComponent,
    BillingRequestImportDataManagerComponent,
    AddRecordManagerComponent,
    PrintSettingManagerComponent,
    BillingRequestEditTimeComponent,
    BillingRequestEditTimeManagerComponent
  ],
  entryComponents: [BillingRequestRouterHostComponent,
    BillingRequestImportDataManagerComponent,
    AddRecordManagerComponent,
    PrintSettingManagerComponent,
    BillingRequestEditTimeManagerComponent]
})

export class BillingRequestDesktopModule {
  popupComponent = BillingRequestRouterHostComponent;
}

