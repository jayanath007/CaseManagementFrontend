import { EChitAuthorisationsService } from './services/e-chit-authorisations.service';
import { EChitAuthorisationsEffects } from './effects/e-chit-authorisations-effects';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsEChitAuthorisationsToken', reducers),
    EffectsModule.forFeature([EChitAuthorisationsEffects]),
  ],
  providers: [
    EChitAuthorisationsService,
  ],
  declarations: []
})
export class EChitAuthorisationsCoreModule { }
