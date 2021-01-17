import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule, MatToolbarModule, MatExpansionModule,
  MatRadioModule, MatProgressBarModule, MatListModule, MatCheckboxModule, MatDatepickerModule, MAT_DATE_LOCALE
} from '@angular/material';

import { SharedModule } from '../shared/shared.module';

import { EmailListPopupComponent } from './containers/email-list-popup.component';
import { EmailListManagerComponent } from './containers/email-list-manager.component';
import { EmailListLayoutComponent } from './components/email-list-layout/email-list-layout.component';
import { EmailListCoreModule } from '../email-list-core/email-list-core.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { RecipientInputManagerComponent } from './containers/recipient-input-manager.component';
import { OrganizerDesktopSharedModule } from '../organizer-desktop-shared/organizer-desktop-shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '../../../node_modules/@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { EffectsModule } from '../../../node_modules/@ngrx/effects';
import { EmailListEffects } from './effects/emai-list-effects';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    MatRadioModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatDatepickerModule,
    EmailListCoreModule,
    GridFilterDesktopModule,
    OrganizerDesktopSharedModule,
    EffectsModule.forFeature([EmailListEffects]),
  ],
  declarations: [
    EmailListPopupComponent,
    EmailListManagerComponent,
    EmailListLayoutComponent,
    RecipientInputManagerComponent,
  ],
  entryComponents: [EmailListPopupComponent],
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
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class EmailListDesktopModule {
  popupComponent = EmailListPopupComponent;
}
