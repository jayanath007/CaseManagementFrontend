import { WorkflowMenuPopupService } from './services/workflowMenuPopup.service';
import { WorkflowMenuPopupEffects } from './effects/workflow-menu-effects';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsWorkflowMenuPopup', reducers),
    EffectsModule.forFeature([WorkflowMenuPopupEffects])
  ],
  providers: [WorkflowMenuPopupService],
  declarations: []
})
export class WorkflowMenuPopupCoreModule {}
