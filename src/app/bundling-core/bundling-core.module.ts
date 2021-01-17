
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { BundlingService } from './services/bundling.service';
import { BundlingEffects } from './effects/bundling.effects';
import { AzureStorageModule } from '../azure-storage/azure-storage.module';




@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsBundling', reducers),
    EffectsModule.forFeature([BundlingEffects]),
    AzureStorageModule,
  ],
  providers: [BundlingService],
  declarations: []
})
export class BundlingCoreModule { }
