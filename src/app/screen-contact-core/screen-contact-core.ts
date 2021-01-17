import { HttpClientModule } from '@angular/common/http';
import { ScreenContactAPIService } from './services/screen-contact-api.service';
import { reducers } from './reducers';
import { ScreenContactEffects } from './effects/screen-contact-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsContactScreen', reducers),
    EffectsModule.forFeature([ScreenContactEffects])
  ],
  declarations: [],
  providers: [ScreenContactAPIService],
})
export class ScreenContactCoreModule { }
