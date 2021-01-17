import { CrimeManagementManagerComponent } from './containers/crime-management-manager.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule,
  MatDatepickerModule, MatSelectModule, MatExpansionModule, MatListModule, MatToolbarModule, MatProgressBarModule, MatProgressSpinnerModule, MAT_DATE_LOCALE
} from '@angular/material';

import { CrimeManagementLayoutComponent } from './components/crime-management-layout/crime-management-layout.component';
import { CrimeManagementContentComponent } from './components/crime-management-content/crime-management-content.component';
import { SharedModule } from '../shared/shared.module';
import { CrimeManagementHeaderBarComponent } from './components/crime-management-header-bar/crime-management-header-bar.component';
import { CrimeManagementBoostrapComponent } from './containers/crime-management-boostrap.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { CrimeClassGridRowComponent } from './components/crime-class-grid-row/crime-class-grid-row.component';
import { CrimeGridButtonsComponent } from './components/crime-grid-buttons/crime-grid-buttons.component';
import { CrimeManagerDesktopPopupComponent } from './containers/crime-management-desktop-popup.component';
import { CrimeManagementPopupLayoutComponent } from './components/crime-management-popup-layout/crime-management-popup-layout.component';
import { CrimeManagementCoreModule } from '../crime-management-core/crime-management-core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { EffectsModule } from '@ngrx/effects';
import { CrimeManagementEffects } from './effects/crime-management.effects';
import { CrimeClassSummeryComponent } from './components/crime-class-summery/crime-class-summery.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatExpansionModule,
    GridFilterDesktopModule,
    MatSelectModule,
    MatListModule,
    MatToolbarModule,
    MatProgressBarModule,
    CrimeManagementCoreModule,
    MatProgressSpinnerModule,
    EffectsModule.forFeature([CrimeManagementEffects]),
  ],
  declarations: [
    CrimeManagementLayoutComponent,
    CrimeManagementContentComponent,
    CrimeManagementHeaderBarComponent,
    CrimeManagementManagerComponent,
    CrimeManagementBoostrapComponent,
    CrimeClassGridRowComponent,
    CrimeGridButtonsComponent,
    CrimeManagerDesktopPopupComponent,
    CrimeClassSummeryComponent,
    CrimeManagementPopupLayoutComponent
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
  entryComponents: [CrimeManagementBoostrapComponent, CrimeManagerDesktopPopupComponent],
  exports: [CrimeManagementLayoutComponent]
})
export class CrimeManagementDesktopModule {
  boostrapComponent = CrimeManagementBoostrapComponent;
  popupComponent = CrimeManagerDesktopPopupComponent;
}
