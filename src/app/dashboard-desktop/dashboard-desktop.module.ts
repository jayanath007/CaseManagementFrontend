import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatIconModule, MatListModule, MatMenuModule,
  MatToolbarModule, MatSidenavModule, MatSliderModule
} from '@angular/material';

import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { SharedModule } from '../shared/shared.module';
import { MyTaskWidgetModule } from '../my-task-widget/my-task-widget.module';
import { MatterWidgetModule } from '../matter-widget/matter-widget.module';
import { MailWidgetModule } from '../mail-widget/mail-widget.module';
import { TETimeRecordedWidgetModule } from '../team-effieciency-time-recorded-widget/te-time-recorded-widget.module';
import { TEPieChartWidgetModule } from '../team-effieciency-pie-chart-widget/te-pie-chart-widget.module';
import { WorkDoneWidgetModule } from '../work-done-widget/work-done-widget.module';
import { CalendarWidgetModule } from '../calendar-widget/calendar-widget.module';
import { TimeRecordedWidgetModule } from '../time-recorded-widget/time-recorded-widget.module';
import { EditableControlBaseModule } from '../editable-control-base/editable-control-base.module';
import { MlsWidgetModule } from '../mls-widget/mls-widget.module';
import { ThemeAnguler7Component } from './components/theme-anguler7/theme-anguler7.component';
import { ThemeClassicComponent } from './components/theme-classic/theme-classic.component';
import { ActionsWidgetModule } from '../actions-widget/actions-widget.module';
import { TeamWidgetModule } from '../team-widget/team-widget.module';
import { HelpVideosWidgetModule } from '../help-videos-widget/help-videos-widget.module';
import { AzureStorageModule } from '../azure-storage/azure-storage.module';

@NgModule({
  imports: [
    EditableControlBaseModule,
    CommonModule,
    SharedModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MyTaskWidgetModule,
    MatterWidgetModule,
    MailWidgetModule,
    TETimeRecordedWidgetModule,
    TEPieChartWidgetModule,
    WorkDoneWidgetModule,
    CalendarWidgetModule,
    TimeRecordedWidgetModule,
    MatSliderModule,
    MlsWidgetModule,
    ActionsWidgetModule,
    TeamWidgetModule,
    HelpVideosWidgetModule,
    AzureStorageModule
  ],
  declarations: [DashboardLayoutComponent, ThemeAnguler7Component, ThemeClassicComponent],
  exports: [DashboardLayoutComponent]
})
export class DashboardDesktopModule { }
