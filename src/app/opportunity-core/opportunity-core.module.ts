import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { OpportunityEffects } from './effects/opportunity-effects';
import { OpportunityService } from './services/opportunity.service';
import { PropertyQuoteService } from './services/property-quote.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsOpportunityToken', reducers),
    EffectsModule.forFeature([OpportunityEffects])
  ],
  providers: [OpportunityService, PropertyQuoteService],
  declarations: []
})
export class OpportunityCoreModule { }
