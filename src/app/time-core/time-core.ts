import { HttpClientModule } from '@angular/common/http';
import { TimeService } from './services/time-core.service';
import { reducers } from './reducers';
import { TimeEffects } from './effects/time-core-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsTime', reducers),
    EffectsModule.forFeature([TimeEffects])
  ],
  declarations: [],
  providers: [TimeService],
})
export class TimeCoreModule { }
