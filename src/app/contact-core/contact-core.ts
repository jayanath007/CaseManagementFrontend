import { HttpClientModule } from '@angular/common/http';
import { ContactService } from './services/contact-core.service';
import { reducers } from './reducers';
import { ContactEffects } from './effects/contact-core-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsContact', reducers),
    EffectsModule.forFeature([ContactEffects])
  ],
  declarations: [],
  providers: [ContactService],
})
export class ContactCoreModule { }
