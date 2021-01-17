import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { reducers } from './reducers';
import { ConflictSearchEffects } from './effects/conflict-search-effects';
import { ConflictSearchService } from './services/conflict-search-service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsConflictSearchCore', reducers),
    EffectsModule.forFeature([ConflictSearchEffects]),
    HttpClientModule
  ],
  providers:  [ConflictSearchService, DatePipe],
  declarations: []
})
export class ConflictSearchCoreModule { }
