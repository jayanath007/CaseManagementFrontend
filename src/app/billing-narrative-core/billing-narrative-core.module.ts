
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { BillingNarrativeEffects } from './effects/billing-narrative-effects';
import { BillingNarrativeService } from './services/billing-narrative.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsBillingNarrativeToken', reducers),
    EffectsModule.forFeature([BillingNarrativeEffects])
  ],
  providers: [BillingNarrativeService],
  declarations: []
})
export class BillingNarrativeCoreModule { }
