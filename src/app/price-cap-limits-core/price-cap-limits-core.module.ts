import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { PriceCapLimitService } from './services/price-cap-limits-services';
import { PriceCapLimitsEffect } from './effects/price-cap-limits-effect';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('priceCapLimits', reducers),
    EffectsModule.forFeature([PriceCapLimitsEffect]),
  ],
  providers: [PriceCapLimitService]
})
export class PriceCapLimitsCoreModule { }
