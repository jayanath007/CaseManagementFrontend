import { HttpClientModule } from '@angular/common/http';
import { CaseTimeService } from './services/case-time.service';
import { reducers } from './reducers';
import { CaseTimeEffects } from './effects/case-time-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsCaseTime', reducers),
    EffectsModule.forFeature([CaseTimeEffects])
  ],
  declarations: [],
  providers: [CaseTimeService],
})
export class CaseTimeCoreModule { }
