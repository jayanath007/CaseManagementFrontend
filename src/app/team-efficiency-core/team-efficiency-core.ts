import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TeamEfficiencyEffects } from './effects/team-efficiency-effects';
import { TeamEfficiencyService } from './services/team-efficiency.service';

@NgModule({
    imports: [
CommonModule,
HttpClientModule,
StoreModule.forFeature('dpsTeamEfficiency', reducers),
EffectsModule.forFeature([TeamEfficiencyEffects])],
declarations: [],
providers: [TeamEfficiencyService]
})
export class TeamEfficiencyCoreModule { }
