import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatIconModule, MatListModule, MatDividerModule, MatProgressBarModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { MatterWidgetEffects } from './effects/te-time-recorded-widget-effect';
import { TETimeRecordedWidgetLayoutComponent } from './components/te-time-recorded-widget-layout/te-time-recorded-widget-layout.component';
import { TETimeRecordedWidgetManagerComponent } from './containers/te-time-recorded-widget-manager';
import { TETimeRecordedWidgetService } from './services/te-time-recorded-widget-services';
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
    StoreModule.forFeature('dpsTETimeRecordedWidget', reducers),
    EffectsModule.forFeature([MatterWidgetEffects])
  ],
  providers: [TETimeRecordedWidgetService],
  declarations: [TETimeRecordedWidgetManagerComponent,
    TETimeRecordedWidgetLayoutComponent],
  exports: [TETimeRecordedWidgetManagerComponent]
})
export class TETimeRecordedWidgetModule { }
