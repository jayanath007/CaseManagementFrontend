import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducers } from './reducers';
import { WorkDoneEffects } from './effects/work-done.effects';
import { WorkDoneService } from './services/work-done-services';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsWorkDoneCore', reducers),
    EffectsModule.forFeature([WorkDoneEffects])
  ],
  providers: [WorkDoneService, DatePipe],
  declarations: []
})
export class WorkDoneCoreModule { }
