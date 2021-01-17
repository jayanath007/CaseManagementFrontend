import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MatToolbarModule, MatIconModule, MatListModule, MatDividerModule,
  MatProgressBarModule, MatButtonModule, MatMenuModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { TimeRecordedWidgetEffects } from './effects/time-recorded-widget-effect';
import { TimeRecordedWidgetLayoutComponent } from './components/time-recorded-widget-layout/time-recorded-widget-layout.component';
import { TimeRecordedWidgetManagerComponent } from './containers/time-recorded-widget-manager';
import { TimeRecordedWidgetService } from './services/time-recorded-widget-services';
import { TimeRecordedWidgetItemComponent } from './components/time-recorded-widget-item/time-recorded-widget-item.component';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatMenuModule,
    SharedModule,
    StoreModule.forFeature('dpsTimeRecordedWidget', reducers),
    EffectsModule.forFeature([TimeRecordedWidgetEffects])
  ],
  providers: [TimeRecordedWidgetService, DatePipe],
  declarations: [TimeRecordedWidgetManagerComponent,
    TimeRecordedWidgetLayoutComponent,
    TimeRecordedWidgetItemComponent],
  exports: [TimeRecordedWidgetManagerComponent]
})
export class TimeRecordedWidgetModule { }
