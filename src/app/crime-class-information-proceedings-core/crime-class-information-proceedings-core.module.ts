import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { ProceedingClassInfoEffect } from './effects/proceedings-class-info-effects';
import { ProceedingsClassServices } from './service/proceedings-class-services';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('crimeProceedingInfo', reducers),
    EffectsModule.forFeature([ProceedingClassInfoEffect])
  ],
  providers: [ProceedingsClassServices],
  declarations: []
})
export class CrimeClassInformationProceedingsCoreModule { }
