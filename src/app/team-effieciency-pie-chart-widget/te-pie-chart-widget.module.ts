import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatIconModule, MatListModule, MatDividerModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { TEPieChartEffects } from './effects/te-pie-chart-widget-effect';
import { TEPieChartWidgetLayoutComponent } from './components/te-pie-chart-widget-layout/te-pie-chart-widget-layout.component';
import { TEPieChartWidgetManagerComponent } from './containers/te-pie-chart-widget-manager';
import { TEPieChartWidgetService } from './services/te-pie-chart-widget-services';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule,
    MatMenuModule,
    StoreModule.forFeature('dpsTEPieChartWidget', reducers),
    EffectsModule.forFeature([TEPieChartEffects])
  ],
  providers: [TEPieChartWidgetService],
  declarations: [TEPieChartWidgetManagerComponent,
    TEPieChartWidgetLayoutComponent],
  exports: [TEPieChartWidgetManagerComponent]
})
export class TEPieChartWidgetModule { }
