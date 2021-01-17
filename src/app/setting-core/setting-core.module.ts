import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { SettingCoreEffect } from './effects/setting-effects';
import { SettingCoreService } from './services/setting-core.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsSettingCore', reducers),
    EffectsModule.forFeature([SettingCoreEffect])
  ],
  providers: [SettingCoreService],
  declarations: []
})

export class SettingCoreModule { }
