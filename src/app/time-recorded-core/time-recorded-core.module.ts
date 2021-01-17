import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducers } from './reducers';
import { TimeRecordedEffects } from './effects/time-recorded.effects';
import { TimeRecordedService } from './services/time-recorded-services';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsTimeRecordedCore', reducers),
    EffectsModule.forFeature([TimeRecordedEffects])
  ],
  providers: [TimeRecordedService, DatePipe],
  declarations: []
})
export class TimeRecordedCoreModule { }
