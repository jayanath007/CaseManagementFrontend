import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatInputModule, MatIconModule, MatTooltipModule,
  MatTabsModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule,
  MatPaginatorModule, MatToolbarModule, MatExpansionModule, MatListModule,
  MatSliderModule, MatSidenavModule, MatChipsModule, MatDatepickerModule, MatFormFieldModule,
  MatNativeDateModule, MatButtonModule, MatButtonToggleModule, MAT_DATE_LOCALE, DateAdapter,
} from '@angular/material';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DocumentViewModule } from '../document-view/document-view.module';
import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { TeamCoreModule } from '../team-core/team-core.module';
import { TeamRoutingModule } from './team-routing.module';
import { TeamManagerComponent } from './containers/team-manager.component';
import { TeamManagerRouterHostComponent } from './containers/team-manager-router-host.component';
import { TeamLayoutComponent } from './components/team-layout/team-layout.component';
import { TeamUsersListComponent } from './components/team-users-list/team-users-list.component';
import { TeamUsersItemComponent } from './components/team-users-item/team-users-item.component';
import { TeamUserProfileComponent } from './components/team-user-profile/team-user-profile.component';
import { TeamPrimaryHeaderComponent } from './components/team-primary-header/team-primary-header.component';
import { TeamUserYearActivityComponent } from './components/team-user-year-activity/team-user-year-activity.component';
import { TeamUserDayActivityComponent } from './components/team-user-day-activity/team-user-day-activity.component';
import { PersonalStatusPopupComponent } from './components/personal-status-popup/personal-status-popup.component';
import {
  TeamUserMonthActivityComponent,
  CalendarCustomHeaderComponent
} from './components/team-user-month-activity/team-user-month-activity.component';
import { MomentDateAdapter, MatMomentDateModule } from '@angular/material-moment-adapter';
import { TeamUserGridRowComponent } from './components/team-user-grid-row/team-user-grid-row.component';
import { TeamLayoutContentComponent } from './components/team-layout-content/team-layout-content.component';
import { TeamUserBarChartComponent } from './components/team-user-bar-chart/team-user-bar-chart.component';
import { ChartsModule } from 'ng2-charts';



@Injectable()
export class DpsDateAdapter extends MomentDateAdapter {

  getFirstDayOfWeek(): number {
    return 0;
  }

}


@NgModule({
  imports: [CommonModule,
    TeamRoutingModule,
    TeamCoreModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSelectModule,
    MatCheckboxModule,
    GridFilterDesktopModule,
    MatPaginatorModule,
    SharedModule,
    MatSliderModule,
    MatSidenavModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DocumentViewModule,
    MailDesktopSharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMomentDateModule,
    ChartsModule
  ],
  declarations: [TeamLayoutComponent,
    TeamManagerComponent,
    TeamManagerRouterHostComponent,
    TeamLayoutComponent,
    TeamUsersListComponent,
    TeamUsersItemComponent,
    TeamUserProfileComponent,
    TeamPrimaryHeaderComponent,
    TeamLayoutContentComponent,

    TeamUserYearActivityComponent,
    TeamUserDayActivityComponent,

    PersonalStatusPopupComponent,
    TeamUserMonthActivityComponent,
    CalendarCustomHeaderComponent,
    TeamUserGridRowComponent,
    TeamUserBarChartComponent


  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DpsDateAdapter }
  ],

  entryComponents: [CalendarCustomHeaderComponent]

})
export class TeamDesktopModule { }
