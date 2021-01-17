import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { reducers } from './reducers';
import { BlobExplorerEffects } from './effects/blob-explorer.effects';
import { BlobExplorerService } from './services/blob-explorer.service';
import { TemplateDirectoryService } from './services/template-directory.service';
import { TemplateDirectoryEffects } from './effects/template-directory.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsBlobExplorerCore', reducers),
    EffectsModule.forFeature([BlobExplorerEffects]),
    EffectsModule.forFeature([TemplateDirectoryEffects]),
    HttpClientModule
  ],
  providers: [BlobExplorerService, DatePipe, TemplateDirectoryService],
  declarations: []
})
export class SafeBoxExplorerCoreModule { }
