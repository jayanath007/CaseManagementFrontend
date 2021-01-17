import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { MatterViewByClientEffects } from './effects/matter-view-by-client.effects';
import { MatterViewByClientServices } from './services/matter-view-by-client-services';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsMatterViewByClientCore', reducers),
    EffectsModule.forFeature([MatterViewByClientEffects]),
    HttpClientModule
  ],
  providers: [MatterViewByClientServices, DatePipe],
  declarations: []
})
export class MatterViewByClientCoreModule { }
