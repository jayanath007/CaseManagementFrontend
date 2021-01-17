import { HttpClientModule } from '@angular/common/http';
import { ChaserService } from './services/chaser.service';
import { ChaserEffects } from './effects/chaser.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';
import { AzureStorageModule } from '../azure-storage/azure-storage.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsChaserCore', reducers),
    EffectsModule.forFeature([ChaserEffects]),
    AzureStorageModule
  ],
  providers: [ChaserService],
  declarations: []
})
export class ChaserCoreModule { }
