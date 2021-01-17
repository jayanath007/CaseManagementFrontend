import { ProbateAccountEffects } from './effects/probate-account.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { reducers } from './reducers';
import { ProbateAccountService } from './services/probate-account-service';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsProbateAccountCore', reducers),
    EffectsModule.forFeature([ProbateAccountEffects]),
    HttpClientModule
  ],
  providers: [ProbateAccountService, DatePipe],
  declarations: []
})
export class ProbateAccountCoreModule { }
