import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { reducers } from './reducers';
import { TimeInformationEffects } from './effects/time-information-effects';
import { TimeInformationService } from './services/time-information-service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsTimeInformationCore', reducers),
    EffectsModule.forFeature([TimeInformationEffects]),
    HttpClientModule
  ],
  providers: [TimeInformationService],
  declarations: []
})

export class TimeInformationCoreModule { }
