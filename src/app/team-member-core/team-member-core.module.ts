import { TeamMemberService } from './services/team-member.service';
import { TeamMembersEffects } from './effects/team-member.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsTeamMemberCore', reducers),
    EffectsModule.forFeature([TeamMembersEffects])
  ],
  providers: [TeamMemberService],
  declarations: []
})
export class TeamMemberCoreModule { }

