import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatInputModule, MatIconModule, MatTooltipModule,
  MatTabsModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule,
  MatPaginatorModule, MatToolbarModule, MatExpansionModule, MatListModule,
  MatSliderModule, MatSidenavModule, MatChipsModule, MatDatepickerModule, MatMenuModule, MatRadioModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TimeRecordedRoutingModule } from './time-recorded-routing.module';
import { TimeRecordedManagerRouterHostComponent } from './containers/time-recorded-manager-router-host.component';
import { TimeRecordedManagerComponent } from './containers/time-recorded-manager.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { SharedModule } from '../shared/shared.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { TimeRecordedLayoutComponent } from './components/time-recorded-layout/time-recorded-layout.component';
import { TimeRecordedCoreModule } from '../time-recorded-core/time-recorded-core.module';
import { TimeRecordedHeaderComponent } from './components/time-recorded-header/time-recorded-header.component';
import { TimeRecordedGridFilterComponent } from './components/time-recorded-grid-filter/time-recorded-grid-filter.component';
import { TimeRecordedViewsComponent } from './components/time-recorded-views/time-recorded-views.component';
import { TimeRecordedGridComponent } from './components/time-recorded-grid/time-recorded-grid.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TimeRecordedGridItemComponent } from './components/time-recorded-grid-item/time-recorded-grid-item.component';
import { TimeRecordGridButtonsComponent } from './components/time-record-grid-buttons/time-record-grid-buttons.component';
import { TimeRecordGridGroupViewComponent } from './components/time-record-grid-group-view/time-record-grid-group-view.component';
import { TeamMemberCoreModule } from '../team-member-core/team-member-core.module';
import { SettingCoreModule } from '../setting-core/setting-core.module';
import { TimeRecordingCoreModule } from '../time-recording-core/time-recording-core.module';
import { SharedDataModule } from './../shared-data/shared-data.module';
import { AzureStorageModule } from '../azure-storage/azure-storage.module';

@NgModule({
  imports: [TimeRecordedRoutingModule,
    CommonModule,
    SharedDataModule,
    TimeRecordedCoreModule,
    TimeRecordingCoreModule,
    TeamMemberCoreModule,
    SettingCoreModule,
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
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    AzureStorageModule,
    MatRadioModule,
  ],
  declarations: [
    TimeRecordedManagerRouterHostComponent,
    TimeRecordedManagerComponent,
    TimeRecordedLayoutComponent,
    TimeRecordedHeaderComponent,
    TimeRecordedGridFilterComponent,
    TimeRecordedViewsComponent,
    TimeRecordedGridComponent,
    TimeRecordedGridItemComponent,
    TimeRecordGridButtonsComponent,
    TimeRecordGridGroupViewComponent
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
    }
  ],
  entryComponents: []

})

export class TimeRecordedDesktopModule { }
