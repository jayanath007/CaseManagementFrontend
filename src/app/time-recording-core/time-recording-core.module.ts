import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { reducers } from './reducers';
import { TimeRecordingEffects } from './effects/time-recording-effects';
import { TimeRecordingService } from './services/time_recording_service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsTimeRecordingCore', reducers),
    EffectsModule.forFeature([TimeRecordingEffects]),
    HttpClientModule
  ],
  providers:  [TimeRecordingService, DatePipe],
  declarations: []
})
export class TimeRecordingCoreModule { }
