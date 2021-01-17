import { HttpClientModule } from '@angular/common/http';
import { TaskService } from './services/task-core.service';
import { reducers } from './reducers';
import { TaskEffects } from './effects/task-core-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsTask', reducers),
    EffectsModule.forFeature([TaskEffects])
  ],
  declarations: [],
  providers: [TaskService],
})
export class TaskCoreModule { }
