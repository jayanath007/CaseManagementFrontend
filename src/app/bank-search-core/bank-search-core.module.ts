import { BankSearchService } from './services/bank-search.service';
import { BankSearchEffects } from './effects/bank-search-effects';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsBankDetailsSearchToken', reducers),
    EffectsModule.forFeature([BankSearchEffects]),
  ],
  providers: [
    BankSearchService,
  ],
  declarations: []
})
export class BankSearchCoreModule { }
