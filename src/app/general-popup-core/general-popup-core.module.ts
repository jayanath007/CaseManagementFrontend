import { CommonModule, DatePipe } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { reducers } from './reducers';
import { GeneralPopupService } from './servicers/general-popup.service';
import { GeneralPopupEffects } from './effects/general-popup-effects';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsGeneralPopupCore', reducers),
    EffectsModule.forFeature([GeneralPopupEffects])
  ],
  providers: [GeneralPopupService, DatePipe],
  declarations: []
})
export class GeneralPopupCoreModule { }
