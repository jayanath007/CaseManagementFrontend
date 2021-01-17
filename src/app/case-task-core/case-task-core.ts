import { HttpClientModule } from '@angular/common/http';
import { CaseTaskService } from './services/case-task.service';
import { reducers } from './reducers';
import { CaseTaskEffects } from './effects/case-task-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsCaseTask', reducers),
    EffectsModule.forFeature([CaseTaskEffects])
  ],
  declarations: [],
  providers: [CaseTaskService],
})
export class CaseTaskCoreModule { }
