
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { WorkflowRuleEffects } from './effects/workflow-rule-effects';
import { WorkflowRuleService } from './services/workflow-rule.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsWorkflowRuleCore', reducers),
    EffectsModule.forFeature([WorkflowRuleEffects])
  ],
  providers: [WorkflowRuleService],
  declarations: []
})
export class WorkflowRuleCoreModule { }
