
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { OrganizerSettingsEffects } from './effects/organizer-settings-effects';
import { OrganizerSettingsService } from './services/organizer-settings-service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    StoreModule.forFeature('dpsOrganizerSettingsCore', reducers),
    EffectsModule.forFeature([OrganizerSettingsEffects])
  ],
  providers: [OrganizerSettingsService],
  declarations: []
})
export class OrganizerSettingsCoreModule { }

