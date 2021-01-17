
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { PrecedentHEffects } from './effects/precedentH-effects';
import { PrecedentHService } from './services/precedentH.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsPrecedentH', reducers),
    EffectsModule.forFeature([PrecedentHEffects])
  ],
  providers: [PrecedentHService],
  declarations: []
})
export class PrecedentHCoreModule { }

