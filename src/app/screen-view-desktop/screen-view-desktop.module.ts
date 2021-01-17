import { FormCliAttachmentComponent } from './components/form-cli-attachment/form-cli-attachmentcomponent';
import { ViewContanerComponent } from './components/contaner/view-contaner/view-contaner.component';
import { ContanerComponent } from './components/contaner/contaner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { ScreenViewCoreModule } from '../screen-view-core/screen-view-core.module';
import { ScreenViewPopupManagerComponent } from './containers/screen-view-popup-manager.component';
import { ScreenViewManagerComponent } from './containers/screen-view-manager.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { ScreenViewComponent } from './components/screen-view/screen-view.component';
import { ScreenViewHeaderComponent } from './components/screen-view-header/screen-view-header.component';
import { FormCheckBoxComponent } from './components/form-check-box/form-check-box.component';
import { FormTimeComponent } from './components/form-time/form-time.component';
import { ForDatepickerComponent } from './components/form-datepicker/form-datepicker.component';
import {
  MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatTooltipModule,
  MAT_DATE_LOCALE, DateAdapter, MatIconModule
} from '@angular/material';
import { FormNumericBoxComponent } from './components/form-numeric-box/form-numeric-box.component';
import { FormCurrencyComponent } from './components/form-currency/form-currency.component';
import { DatepickerDialogComponent } from './components/datepicker-dialog/datepicker-dialog.component';
import { FormLableComponent } from './components/form-lable/form-lable.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { SharedModule } from '../shared/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScreenViewBoostrapComponent } from './containers/screen-view-boostrap.component';
import { ScreenContactDesktopModule } from '../screen-contact-desktop/screen-contact-desktop.module';
import { ContactSearchToolbarComponent } from './components/contact-search-toolbar/contact-search-toolbar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateFormat } from '../utils/date-format';
import { FormPostcodeComponent } from './components/form-postcode/form-postcode.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormMatAttachmentComponent } from './components/form-mat-attachment/form-mat-attachment.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ScreenViewCoreModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ScreenContactDesktopModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule
  ],
  declarations: [
    ScreenViewPopupManagerComponent,
    ScreenViewManagerComponent,
    ScreenViewBoostrapComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    FormInputComponent,
    FormTimeComponent,
    FormSelectComponent,
    FormCheckBoxComponent,
    ContanerComponent,
    ScreenViewComponent,
    ScreenViewHeaderComponent,
    ForDatepickerComponent,
    FormNumericBoxComponent,
    FormCurrencyComponent,
    FormCliAttachmentComponent,
    DatepickerDialogComponent,
    FormLableComponent,
    ViewContanerComponent,
    ContactSearchToolbarComponent,
    FormPostcodeComponent,
    FormMatAttachmentComponent,
  ],
  exports: [
    // DynamicFormComponent,
    // ScreenViewComponent,
    ScreenViewManagerComponent,
    ScreenViewPopupManagerComponent,
    ScreenViewManagerComponent,
    ScreenViewBoostrapComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    FormInputComponent,
    FormTimeComponent,
    FormSelectComponent,
    FormCheckBoxComponent,
    ContanerComponent,
    ScreenViewComponent,
    ScreenViewHeaderComponent,
    ForDatepickerComponent,
    FormNumericBoxComponent,
    FormCurrencyComponent,
    FormPostcodeComponent,
    FormCliAttachmentComponent,
    DatepickerDialogComponent,
    FormLableComponent,
    ViewContanerComponent,
    FormMatAttachmentComponent,
  ],
  entryComponents: [
    ScreenViewPopupManagerComponent,
    ScreenViewBoostrapComponent,
    FormInputComponent,
    FormTimeComponent,
    FormSelectComponent,
    FormCheckBoxComponent,
    ForDatepickerComponent,
    FormNumericBoxComponent,
    FormCurrencyComponent,
    FormPostcodeComponent,
    FormCliAttachmentComponent,
    DatepickerDialogComponent,
    FormLableComponent,
    FormMatAttachmentComponent,
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
    { provide: DateAdapter, useClass: DateFormat },
  ],
})
export class ScreenViewDesktop {
  popupComponent = ScreenViewPopupManagerComponent;
  boostrapComponent = ScreenViewBoostrapComponent;
}
