import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { Cds7ReportInfoService } from './services/cds7-report-info.service';
import { Cds7ReportInfoEffects } from './effects/cds7-report-info.effects';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsCDS7Core', reducers),
    EffectsModule.forFeature([Cds7ReportInfoEffects])
  ],
  providers: [Cds7ReportInfoService],
  declarations: []
})
export class Cds7ReportInfoCoreModule { }
