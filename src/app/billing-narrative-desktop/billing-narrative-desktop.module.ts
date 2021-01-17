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
  MAT_DATE_LOCALE
} from '@angular/material';
import { BillingNarrativeManagerComponent } from './containers/billing-narrative-manager.component';
import { BillingNarrativeRouterHostComponent } from './containers/billing-narrative-router-host.component';
import { BillingNarrativeLayoutComponent } from './components/billing-narrative-layout/billing-narrative-layout.component';
import { EffectsModule } from '@ngrx/effects';
import { BillingNarrativeEffects } from '../billing-narrative-core/effects/billing-narrative-effects';
import { SharedModule } from '../shared/shared.module';
import { BillingNarrativeCoreModule } from '../billing-narrative-core/billing-narrative-core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BillingNarrativeCoreModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    EffectsModule.forFeature([BillingNarrativeEffects]),
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
    BillingNarrativeManagerComponent,
    BillingNarrativeRouterHostComponent,
    BillingNarrativeLayoutComponent
  ],
  entryComponents: [BillingNarrativeRouterHostComponent]
})

export class BillingNarrativeDesktopModule {
  popupComponent = BillingNarrativeRouterHostComponent;
}


