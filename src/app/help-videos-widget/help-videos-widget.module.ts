import {
  MatToolbarModule, MatIconModule, MatMenuModule,
  MatProgressBarModule, MatButtonModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpVideosWidgetEffect } from './effects/help-videos-widget-effect';
import { reducers } from './reducers';
import { HelpVideosWidgetService } from './services/help-videos-widget';

import { SharedModule } from './../shared/shared.module';
import { HelpVideosWidgetManagerComponent } from './containers/help-videos-widget-manager.component';
import { HelpVideosWidgetLayoutComponent } from './components/help-video-widget-layout/help-videos-widget-layout.component';



@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    SharedModule,
    StoreModule.forFeature('dpsHelpVideosWidget', reducers),
    EffectsModule.forFeature([HelpVideosWidgetEffect])
  ],
  declarations: [HelpVideosWidgetManagerComponent, HelpVideosWidgetLayoutComponent],
  exports: [HelpVideosWidgetManagerComponent],
  providers: [HelpVideosWidgetService]
})
export class HelpVideosWidgetModule { }
