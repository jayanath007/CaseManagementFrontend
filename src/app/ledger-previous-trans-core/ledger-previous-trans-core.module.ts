
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducers } from './reducers';
import { PreviousTransactionsEffects } from './effects/previous-trans.effects';
import { PreviousTransactionsService } from './services/previous-trans-service';
import { WindowPopupsManagerService } from '../document-view/services/window-popups-manager.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsLedgercardPreviousTransactions', reducers),
    EffectsModule.forFeature([PreviousTransactionsEffects])
  ],
  providers: [PreviousTransactionsService, WindowPopupsManagerService, DatePipe],
  declarations: []
})
export class LedgerPreviousTransCoreModule { }
