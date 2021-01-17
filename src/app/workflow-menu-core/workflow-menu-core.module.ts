import { WorkflowMenuService } from './services/workflowMenu.service';
import { WorkflowMenuEffects } from './effects/workflow-menu-effects';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { ScreenViewDesktop } from '../screen-view-desktop/screen-view-desktop.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // ScreenViewDesktop,
    StoreModule.forFeature('dpsWorkflowMenu', reducers),
    EffectsModule.forFeature([WorkflowMenuEffects])
  ],
  providers: [WorkflowMenuService],
  declarations: []
})
export class WorkflowMenuCoreModule {}
