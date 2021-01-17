
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TeamEffects } from './effects/team-effects';
import { TeamService } from './services/team-service';
import { reducers } from './reducers';


@NgModule({
    imports: [
      CommonModule,
      HttpClientModule,
      StoreModule.forFeature('dpsTeam', reducers),
      EffectsModule.forFeature([TeamEffects])
    ],
    providers: [TeamService],
    declarations: []
  })
  export class TeamCoreModule { }
