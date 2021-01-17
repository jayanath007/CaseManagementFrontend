import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { SharedModule } from '../shared/shared.module';
import { MatListModule, MatBadgeModule, MatProgressBarModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { AZURE_STORAGE_TOKEN, azureStorageFactory } from './services/tokens';
import { AzureStorageService } from './services/azure-storage.service';
import { reducers } from './reducers';
import { AzureStorageIndicatorManagerComponent } from './containers/azure-storag-indicator-manager.component';
import { UploadIndictorItemComponent } from './components/upload-indictor-item/upload-indictor-item.component';
import { AzureStorageUploadIndicatorComponent } from './components/azure-storage-upload-indicator/azure-storage-upload-indicator.component';
import { SasGeneratorService } from './services/sas-generator.service';
import { AzureHttpClientService } from './services/azure-http-client.service';
import { WebViewService } from './services/web-view.service';
import { EffectsModule } from '@ngrx/effects';
import { AzureEffects } from './effects/azure.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('azureStorage', reducers),
    EffectsModule.forFeature([AzureEffects]),
    OverlayModule,
    PortalModule,
    SharedModule,
    MatListModule,
    MatBadgeModule,
    MatProgressBarModule
  ],
  declarations: [AzureStorageUploadIndicatorComponent, AzureStorageIndicatorManagerComponent, UploadIndictorItemComponent],
  entryComponents: [AzureStorageIndicatorManagerComponent],
  providers: [
    AzureStorageService,
    SasGeneratorService,
    AzureHttpClientService,
    WebViewService,
    {
      provide: AZURE_STORAGE_TOKEN,
      useFactory: azureStorageFactory
    }
  ]
})
export class AzureStorageModule {
  mainComponent = AzureStorageIndicatorManagerComponent;
}
