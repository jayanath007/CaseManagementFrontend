
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducers';
import { DictationsEffects } from './effects/dictations.effects';
import { DictationService } from './services/dictations.service';
import { AudioPlayerEffects } from './effects/audio-player.effects';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsDictations', reducers),
    EffectsModule.forFeature([DictationsEffects, AudioPlayerEffects])
  ],
  providers: [DictationService],
  declarations: []
})
export class DictationsCoreModule { }
