import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducers } from './reducers';
import { LedgerCardEffects } from './effects/ledger-card.effects';
import { LedgerCardService } from './services/ledger-card-services';
import { WindowPopupsManagerService } from '../document-view/services/window-popups-manager.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsLedgerCardCore', reducers),
    EffectsModule.forFeature([LedgerCardEffects])
  ],
  providers: [LedgerCardService, WindowPopupsManagerService, DatePipe],
  declarations: []
})
export class LedgerCardCoreModule { }
