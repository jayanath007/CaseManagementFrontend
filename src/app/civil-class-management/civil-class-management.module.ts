import { MatDatepickerModule, MatExpansionModule, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';
import { CivilClassManagementPopupComponent } from './containers/civil-class-management-popup/civil-class-management-popup.component';
import { CivilClassManagementLayoutComponent } from './components/civil-class-management-layout/civil-class-management-layout.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { SharedModule } from './../shared/shared.module';
import { reducers } from './reducers';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { CivilManagementService } from './services/civil-management.service';
import { CivilClassEffects } from './effects/civil-class-effects';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GridFilterDesktopModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    StoreModule.forFeature('dpsCivilManagement', reducers),
    EffectsModule.forFeature([CivilClassEffects])
  ],
  declarations: [CivilClassManagementPopupComponent, CivilClassManagementLayoutComponent],
  entryComponents: [CivilClassManagementPopupComponent],
  providers: [
    CivilManagementService,
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

export class CivilClassManagementModule {
  popupComponent = CivilClassManagementPopupComponent;
}

