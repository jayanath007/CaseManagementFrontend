import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { CourtDutyEffects } from './effects/court-duty-effects';
import { CrimeCourtDutyService } from './services/crime-court-duty.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('crimeCourtDuty', reducers),
    EffectsModule.forFeature([CourtDutyEffects])
  ],
  providers: [CrimeCourtDutyService],
  declarations: []
})

export class CrimeCourtDutyCoreModule { }
