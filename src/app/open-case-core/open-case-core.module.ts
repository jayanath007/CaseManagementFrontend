
import { reducers } from './reducers';
import { OpenCaseEffects } from './effects/open-case-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenCaseService } from './services/open-case.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsOpenCaseCore', reducers),
    EffectsModule.forFeature([OpenCaseEffects])
  ],
  providers: [OpenCaseService],
  declarations: []
})
export class OpenCaseCoreModule { }
