import {
  MatToolbarModule, MatIconModule, MatMenuModule,
  MatProgressBarModule, MatButtonModule, MatDividerModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamWidgetManagerComponent } from './containers/team-widget-manager.component';
import { TeamWidgetEffect } from './effects/team-widget-effect';
import { reducers } from './reducers';
import { TeamWidgetService } from './services/team-widget';
import { TeamWidgetLayoutComponent } from './components/team-widget-layout/team-widget-layout.component';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    SharedModule,
    MatDividerModule,
    StoreModule.forFeature('dpsTeamWidget', reducers),
    EffectsModule.forFeature([TeamWidgetEffect])
  ],
  declarations: [TeamWidgetManagerComponent, TeamWidgetLayoutComponent],
  exports: [TeamWidgetManagerComponent],
  providers: [TeamWidgetService]
})
export class TeamWidgetModule { }
