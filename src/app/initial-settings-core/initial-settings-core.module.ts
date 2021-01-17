
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { InitialSettingsEffects } from './effects/initial-settings-effects';
import { InitialSettingsService } from './services/initial-settings.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsInitialSettingsCore', reducers),
    EffectsModule.forFeature([InitialSettingsEffects])
  ],
  providers: [InitialSettingsService],
  declarations: []
})
export class InitialSettingsCoreModule { }
