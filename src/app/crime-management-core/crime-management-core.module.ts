import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { CrimeManagementService } from './services/crime-management.service';
import { CrimeManagementEffects } from './effects/crime-management.effects';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsCrimeManagementCore', reducers),
    EffectsModule.forFeature([CrimeManagementEffects])
  ],
  providers: [CrimeManagementService],
  declarations: []
})
export class CrimeManagementCoreModule { }

