import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { reducers } from './reducers';
import { EChitEffects } from './effects/e-chit.effects';
import { EChitService } from './services/e-chit-service';
import { WindowPopupsManagerService } from '../document-view/services/window-popups-manager.service';
import { FileUrlResolverService } from '../document-view/services/file-url-resolver.service';
import { MatterViewByClientServices } from '../matter-view-by-client-core/services/matter-view-by-client-services';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsEChitCore', reducers),
    EffectsModule.forFeature([EChitEffects]),
    HttpClientModule
  ],
  providers:  [EChitService, WindowPopupsManagerService,
    FileUrlResolverService, DatePipe , MatterViewByClientServices],
  declarations: []
})
export class EChitCoreModule { }
