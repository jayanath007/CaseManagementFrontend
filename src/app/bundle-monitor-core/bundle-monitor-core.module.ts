import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { BundleMonitorEffects } from './effects/bundle-monitor.effect';
import { HttpClientModule } from '@angular/common/http';
import { BundleMonitorService } from './services/bundle-monitor-service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('bundleMonitor', reducers),
    EffectsModule.forFeature([BundleMonitorEffects]),
    HttpClientModule
  ],
  providers: [BundleMonitorService, DatePipe],
  declarations: []
})
export class BundleMonitorCoreModule { }
