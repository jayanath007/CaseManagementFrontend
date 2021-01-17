
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatToolbarModule, MatIconModule, MatListModule, MatDividerModule,
   MatProgressBarModule, MatButtonModule, MatMenuModule, MatProgressSpinnerModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { MatterWidgetEffects } from './effects/calendar-widget-effect';
import { CalendarWidgetLayoutComponent } from './components/calendar-widget-layout/calendar-widget-layout.component';
import { CalendarWidgetManagerComponent } from './containers/calendar-widget-manager';
import { CalendarWidgetService } from './services/calendar-widget.service';
import { CalendarWidgetItemComponent } from './components/calendar-widget-item/calendar-widget-item.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    StoreModule.forFeature('dpsCalendarWidget', reducers),
    EffectsModule.forFeature([MatterWidgetEffects])
  ],
  providers: [CalendarWidgetService, DatePipe],
  declarations: [CalendarWidgetManagerComponent,
    CalendarWidgetLayoutComponent,
    CalendarWidgetItemComponent],
  exports: [CalendarWidgetManagerComponent]
})
export class CalendarWidgetModule { }
