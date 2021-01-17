import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { HttpClientModule } from '@angular/common/http';
import { MyTasksService } from './services/my-tasks-services';
import { MyTasksEffects } from './effects/my-tasks.effects';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsMyTaskCore', reducers),
    EffectsModule.forFeature([MyTasksEffects])
  ],
  providers: [MyTasksService, DatePipe],
  declarations: []
})
export class MyTasksCoreModule { }

