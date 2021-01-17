import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import {
  MAT_DATE_LOCALE, MatFormFieldModule, MatSelectModule, MatInputModule,
  MatDatepickerModule, MatNativeDateModule, MatToolbarModule, MatIconModule, MatButtonModule
} from '@angular/material';
import { PriceCapLimitsLayoutComponent } from './components/price-cap-limits-layout/price-cap-limits-layout.component';
import { PriceCapLimitsManagerComponent } from './containers/price-cap-limits-manager.component';
import { PriceCapLimitsCoreModule } from './../price-cap-limits-core/price-cap-limits-core.module';
import { AuthInterceptorService } from '../auth';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PriceCapLimitsEffect } from './effects/price-cap-limits-effect';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PriceCapLimitsCoreModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    EffectsModule.forFeature([PriceCapLimitsEffect]),
  ],
  declarations: [PriceCapLimitsManagerComponent, PriceCapLimitsLayoutComponent],
  entryComponents: [PriceCapLimitsManagerComponent],
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
    DatePipe
  ],
})
export class PriceCapLimitsDesktopModule {
  popupComponent = PriceCapLimitsManagerComponent;
}
