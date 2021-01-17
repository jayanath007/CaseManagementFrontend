
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatToolbarModule, MatIconModule,
   MatProgressBarModule, MatButtonModule, MatMenuModule, MatGridListModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';
import { ActionsWidgetManagerComponent } from './containers/actions-widget-manager.component';
import {ActionLayoutComponent} from './components/action-layout/action-layout.component';
import { ActionBundleMonitorComponent } from './components/action-bundle-monitor/action-bundle-monitor.component';
import {reducers} from './reducers';
import { ActionsWidgetEffects } from './effects/actions-effects';
import { ActionWidgetService } from './services/action-widget-service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatGridListModule,
    StoreModule.forFeature('dpsActionsCore', reducers),
    EffectsModule.forFeature([ActionsWidgetEffects])
  ],
  providers: [ActionWidgetService, DatePipe],
  declarations: [ActionsWidgetManagerComponent, ActionLayoutComponent, ActionBundleMonitorComponent
],
  exports: [ActionsWidgetManagerComponent]
})
export class ActionsWidgetModule { }
