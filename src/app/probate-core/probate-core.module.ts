import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducers';
import { ProbateEffects } from './effects/probate.effect';
import { ProbateService } from './services/probate-service';
import { AzureHttpClientService } from '../azure-storage/services/azure-http-client.service';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        StoreModule.forFeature('dpsProbate', reducers),
        EffectsModule.forFeature([ProbateEffects])
    ],
    providers: [ProbateService,
        AzureHttpClientService],
    declarations: []
})
export class ProbateCoreModule { }