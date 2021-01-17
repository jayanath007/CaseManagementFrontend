
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GlobalDocumentSearchEffects } from './effects/global-docment-search-effects';
import { GlobalDocumentSearchService } from './services/global-document-search-service';
import { reducers } from './reducers';


@NgModule({
    imports: [
      CommonModule,
      HttpClientModule,
      StoreModule.forFeature('dpsGlobalDocumentSearch', reducers),
      EffectsModule.forFeature([GlobalDocumentSearchEffects])
    ],
    providers: [GlobalDocumentSearchService],
    declarations: []
  })
  export class GlobalDocumentSearchCoreModule { }
  