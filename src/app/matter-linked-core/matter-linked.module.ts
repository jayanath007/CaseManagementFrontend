import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { reducers } from './reducers';
import { MatterLinkedService } from './services/matter-linked-service';
import { MatterLinkedEffects } from './effects/matter-linked.effects';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsMatterLinkedCore', reducers),
    EffectsModule.forFeature([MatterLinkedEffects]),
    HttpClientModule
  ],
  providers:  [MatterLinkedService, DatePipe],
  declarations: []
})
export class MatterLinkedCoreModule { }
