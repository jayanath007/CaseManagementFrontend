import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatterCreationService } from './services/matterCreation.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { MatterCreationEffects } from './effects/matter-creation.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsMatterCreationCore', reducers),
    EffectsModule.forFeature([MatterCreationEffects]),
  ],
  providers: [MatterCreationService],
  declarations: []
})
export class MatterCreationCoreModule { }

