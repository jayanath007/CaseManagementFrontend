
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { TaskAddEditEffects } from './effects/task-add-edit-effects';
import { TaskAddEditService } from './services/task-add-edit.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsAddEditTaskCore', reducers),
    EffectsModule.forFeature([TaskAddEditEffects])
  ],
  providers: [TaskAddEditService],
  declarations: []
})
export class TaskAddEditCoreModule {}
