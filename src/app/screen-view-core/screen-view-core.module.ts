import { HttpClientModule } from '@angular/common/http';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenDesignService } from './services/screen-view.service';
import { StoreModule } from '@ngrx/store';
import { ScreenViewEffects } from './effects/screen-view-effects';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsScreenView', reducers),
    EffectsModule.forFeature([ScreenViewEffects])
  ],
  declarations: [],
  providers: [ScreenDesignService],
})
export class ScreenViewCoreModule { }
