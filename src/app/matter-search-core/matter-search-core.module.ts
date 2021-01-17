import { CommonModule, DatePipe } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { MatterEffects } from './effects/matter.effects';
import { MatterSearchService } from './services/matter-search.service';
import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsMatterSearchCore', reducers),
    EffectsModule.forFeature([MatterEffects])
  ],
  providers: [MatterSearchService, DatePipe],
  declarations: []
})
export class MatterSearchCoreModule { }
