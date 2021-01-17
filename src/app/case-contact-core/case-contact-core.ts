import { HttpClientModule } from '@angular/common/http';
import { CaseContactService } from './services/case-contact.service';
import { reducers } from './reducers';
import { CaseContactEffects } from './effects/case-contact-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsCaseContact', reducers),
    EffectsModule.forFeature([CaseContactEffects])
  ],
  declarations: [],
  providers: [CaseContactService],
})
export class CaseContactCoreModule { }
