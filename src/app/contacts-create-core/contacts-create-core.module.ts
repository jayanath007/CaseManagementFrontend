import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { ContactCreationService } from './services/contactCreation.service';
import { ContactCreationEffects } from './effects/contact-creation.effects';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsContactCrationCore', reducers),
    EffectsModule.forFeature([ContactCreationEffects])
  ],
  providers: [ContactCreationService],
  declarations: []
})
export class ContactsCreateCoreModule { }
