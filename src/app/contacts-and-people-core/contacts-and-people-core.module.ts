import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ContactsAndPeopleService } from './services/contacts-and-people.service';
import { PeopleEffects } from './effects/people.effects';
import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class ContactsAndPeopleCoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootContactsAndPeopleModule,
      providers: [ContactsAndPeopleService],
    };
  }
}

@NgModule({
  imports: [
    ContactsAndPeopleCoreModule,
    StoreModule.forFeature('dpsContactsAndPeople', reducers),
    EffectsModule.forFeature([PeopleEffects]),
  ],
  declarations: [],
})
export class RootContactsAndPeopleModule { }
