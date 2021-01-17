import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { MyTasksRoutingModule } from './my-tasks-routing.module';
import { MyTasksManagerRouterHostComponent } from './containers/my-tasks-manager-router-host.component';
import { MyTasksManagerComponent } from './containers/my-tasks-manager.component';
import { MyTasksLayoutComponent } from './components/my-tasks-layout/my-tasks-layout.component';
import {
  MatSidenavModule, MatListModule, MatIconModule,
  MatChipsModule, MatFormFieldModule, MatSelectModule,
  MatPaginatorModule, MatProgressBarModule, MatExpansionModule, MatCheckboxModule, MatTooltipModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { MyTasksHeaderComponent } from './components/my-tasks-header/my-tasks-header.component';
import { MyTasksGridComponent } from './components/my-tasks-grid/my-tasks-grid.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { MyTasksCoreModule } from '../my-tasks-core/my-tasks-core.module';
import { MyTasksViewsComponent } from './components/my-tasks-views/my-tasks-views.component';
import { MyTasksGridButtonDetailsComponent } from './components/my-tasks-grid-button-details/my-tasks-grid-button-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyTaskDefaultComponent } from './components/my-task-default/my-task-default.component';
import { MyTaskRowComponent } from './components/my-task-row/my-task-row.component';
import { MyTaskGroupComponent } from './components/my-task-group/my-task-group.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyTasksCoreModule,
    MyTasksRoutingModule,
    MatSidenavModule,
    MatTooltipModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatExpansionModule,
    GridFilterDesktopModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MyTasksManagerRouterHostComponent,
    MyTasksManagerComponent,
    MyTasksLayoutComponent,
    MyTasksHeaderComponent,
    MyTasksGridComponent,
    MyTasksViewsComponent,
    MyTasksGridButtonDetailsComponent,
    MyTaskDefaultComponent,
    MyTaskRowComponent,
    MyTaskGroupComponent
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
})
export class MyTasksDesktopModule { }
