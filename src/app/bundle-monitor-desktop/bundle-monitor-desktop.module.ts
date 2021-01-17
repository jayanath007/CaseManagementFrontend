import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatToolbarModule, MatListModule, MatDividerModule, MatSelectModule,
  MatButtonModule, MatFormFieldModule, MatProgressBarModule, MatCheckboxModule
} from '@angular/material';
import { GridFilterDesktopModule } from './../grid-filter-desktop/grid-filter-desktop.module';

import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { BundleMonitorManagerRouterHostComponent } from './containers/bundle-monitor-manager-router-host.component';
import { BundleMonitorLayoutComponent } from './components/bundle-monitor-layout/bundle-monitor-layout.component';
import { BundleMonitorRoutes } from './bundle-monitor.routing';
import { SharedModule } from './../shared/shared.module';
import { BundleMonitorCoreModule } from '../bundle-monitor-core/bundle-monitor-core.module';
import { BundleMonitorGridItemsComponent } from './components/bundle-monitor-grid-items/bundle-monitor-grid-items.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BundleMonitorRoutes,
    BundleMonitorCoreModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    SharedModule,
    GridFilterDesktopModule,
    MatProgressBarModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    BundleMonitorManagerRouterHostComponent,
    BundleMonitorLayoutComponent,
    BundleMonitorGridItemsComponent
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
export class BundleMonitorDesktopModule { }
