
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { BillingRequestEffects } from './effects/billing-request-effects';
import { BillingRequestService } from './services/billing-request.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsBillingRequestToken', reducers),
    EffectsModule.forFeature([BillingRequestEffects])
  ],
  providers: [BillingRequestService],
  declarations: []
})
export class BillingRequestCoreModule { }
