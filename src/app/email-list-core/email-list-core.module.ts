import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { EmailListService } from './services/email-list.service';
import { EmailListEffects } from './effects/emai-list-effects';
import { reducers } from './reducers';


@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([EmailListEffects]),
    StoreModule.forFeature('dpsEmaiList', reducers),
  ],
  declarations: [],
  providers: [EmailListService]
})
export class EmailListCoreModule { }
