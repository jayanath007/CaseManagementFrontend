import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { MlsEffects } from './effects/mls-effects';
import { MlsService } from './services/mls-service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsCaseMlsCore', reducers),
    EffectsModule.forFeature([MlsEffects])
  ],
  providers: [MlsService],
  declarations: []
})
export class MlsCoreModule { }


