import { CommonModule, DatePipe } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AdvancedSearchEffects } from './effects/advanced-search.effects';
import { AdvancedSearchService } from './services/advanced-search.service';
import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsAdvancedSearchCore', reducers),
    EffectsModule.forFeature([AdvancedSearchEffects])
  ],
  providers: [AdvancedSearchService, DatePipe],
  declarations: []
})
export class AdvancedSearchCoreModule { }
