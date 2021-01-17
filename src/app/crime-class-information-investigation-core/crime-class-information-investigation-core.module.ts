import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { CcInvestigationClassInfoEffect } from './effects/cc-investigation-class-info-effect';
import { CCInvestigationServices } from './services/cc-investigation-services';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('crimeInvestigationInfo', reducers),
    EffectsModule.forFeature([CcInvestigationClassInfoEffect])
  ],
  providers: [CCInvestigationServices],
  declarations: []
})
export class CrimeClassInformationInvestigationCoreModule { }
