import { EffectsModule } from '@ngrx/effects';
import { StoreModule, ActionReducer } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { reducers } from './reducers';
import { AddNoteEffects } from './effects/add-note-effects';
import { AddNoteService } from './services/add-note.service';
import { FileUrlResolverService } from '../document-view';
import { storeLogger } from 'ngrx-store-logger';
import { environment } from '../../environments/environment';
import { AzureStorageModule } from '../azure-storage/azure-storage.module';



export function logger(reducer: ActionReducer<any>): any {
  // default, no options
  return storeLogger()(reducer);
}
export const metaReducers = environment.production ? [] : [logger];

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsAddNoteCore', reducers), // , { metaReducers }
    EffectsModule.forFeature([AddNoteEffects]),
    HttpClientModule,
    AzureStorageModule
  ],
  providers: [AddNoteService, FileUrlResolverService, DatePipe],
  declarations: []
})
export class AddNoteCoreModule { }
