import { CommonModule, DatePipe } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { reducers } from './reducers';
import { ClientSearchService } from './services/client-search.service';
import { ClientSearchEffects } from './effects/client-search.effects';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsClientSearchCore', reducers),
    EffectsModule.forFeature([ClientSearchEffects])
  ],
  providers: [ClientSearchService, DatePipe],
  declarations: []
})
export class ClientSearchCoreModule { }
