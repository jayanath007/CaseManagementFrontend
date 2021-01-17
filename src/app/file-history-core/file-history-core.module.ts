import { HttpClientModule } from '@angular/common/http';
import { FileHistoryService } from './services/file-history.service';
import { reducers } from './reducers';
import { FileHistoryEffects } from './effects/file-history-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsFileHistory', reducers),
    EffectsModule.forFeature([FileHistoryEffects])
  ],
  declarations: [],
  providers: [FileHistoryService, DatePipe],
})
export class FileHistoryCoreModule { }
