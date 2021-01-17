import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { ClientCreationEffects } from './effects/client-creation.effects';
import { ClientCreationService } from './services/clientCreation.service';
import { WindowPopupsManagerService } from '../document-view/services/window-popups-manager.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsClientCreationCore', reducers),
    EffectsModule.forFeature([ClientCreationEffects]),
  ],
  providers: [ClientCreationService, WindowPopupsManagerService],
  declarations: []
})
export class ClientCreationCoreModule { }

