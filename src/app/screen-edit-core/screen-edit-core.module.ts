import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { reducers } from './reducers';
import { ScreenEditEffects } from './effects/screen-edit-effects';
import { ScreenEditService } from './services/screen-edit-service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsScreenEditCore', reducers),
    EffectsModule.forFeature([ScreenEditEffects]),
    HttpClientModule
  ],
  providers: [ScreenEditService],
  declarations: []
})
export class ScreenEditCoreModule {

}
