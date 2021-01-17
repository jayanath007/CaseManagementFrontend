
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatInputModule, MatIconModule, MatTooltipModule,
  MatTabsModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule,
  MatPaginatorModule, MatToolbarModule, MatExpansionModule, MatListModule,
  MatSliderModule, MatSidenavModule, MatChipsModule, MatDatepickerModule, MAT_DATE_LOCALE
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkDoneCoreModule } from '../work-done-core/work-done-core.module';
import { WorkDoneRoutingModule } from './work-done-routing.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { SharedModule } from '../shared/shared.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { WorkDoneManagerRouterHostComponent } from './containers/work-done-manager-router-host.component';
import { WorkDoneManagerComponent } from './containers/work-done-manager.component';
import { WorkDoneLayoutComponent } from './components/work-done-layout/work-done-layout.component';
import { WorkDoneHeaderComponent } from './components/work-done-header/work-done-header.component';
import { WorkDoneViewsComponent } from './components/work-done-views/work-done-views.component';
import { WorkDoneGridFilterComponent } from './components/work-done-grid-filter/work-done-grid-filter.component';
import { WorkDoneGridComponent } from './components/work-done-grid/work-done-grid.component';
import { WorkDoneGridButtonDetailsComponent } from './components/work-done-grid-button-details/work-done-grid-button-details.component';
import { DocumentViewModule } from '../document-view/document-view.module';
import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';
import { PasswordInsertComponent } from '../shared/components/password-insert-dialog/password-insert.component';
import { WorkDoneGridRowComponent } from './components/work-done-grid-row/work-done-grid-row.component';
import { WorkdoneTwoGroupComponent } from './components/workdone-two-group/workdone-two-group.component';
import { WorkdoneGroupComponent } from './components/workdone-group/workdone-group.component';
import { SharedDataModule } from './../shared-data/shared-data.module';
import { MsgViewerModule } from '../msg-viewer/msg-viewer.module';

@NgModule({
  imports: [CommonModule,
    SharedDataModule,
    WorkDoneRoutingModule,
    WorkDoneCoreModule,
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
    DocumentViewModule,
    MailDesktopSharedModule,
    FormsModule,
    ReactiveFormsModule,
    MsgViewerModule
  ],
  declarations: [
    WorkDoneManagerRouterHostComponent,
    WorkDoneManagerComponent,
    WorkDoneLayoutComponent,
    WorkDoneHeaderComponent,
    WorkDoneViewsComponent,
    WorkDoneGridFilterComponent,
    WorkDoneGridComponent,
    WorkDoneGridButtonDetailsComponent,
    WorkDoneGridRowComponent,
    WorkdoneTwoGroupComponent,
    WorkdoneGroupComponent,
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

// @NgModule({
//   imports: [
//     WorkDoneRoutingModule
//   ],
//   declarations: [
//   ],

// })

export class WorkDoneDesktopModule { }
