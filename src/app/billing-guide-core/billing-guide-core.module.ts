import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { reducers } from './reducers';
import { BillingGuideEffects } from './effects/billing-guide.effects';
import { BillingGuideService } from './services/billing guide-service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsBillingGuideCore', reducers),
    EffectsModule.forFeature([BillingGuideEffects]),
    HttpClientModule
  ],
  providers:  [BillingGuideService, DatePipe],
  declarations: []
})
export class BillingGuideCoreModule { }
