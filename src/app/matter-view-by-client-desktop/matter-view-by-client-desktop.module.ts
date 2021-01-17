import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule, MatListModule, MatToolbarModule, MatProgressBarModule,
  MatDialogModule, MatPaginatorModule
} from '@angular/material';
import { MatterViewByClientPopupComponent } from './containers/matter-view-by-client-popup.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { MatterViewByClientLayoutComponent } from './components/matter-view-by-client-layout/matter-view-by-client-layout.component';
import { MatterViewByClientManagerComponent } from './containers/matter-view-by-client-manager.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { MatterViewByClientCoreModule } from '../matter-view-by-client-core/matter-view-by-client-core.module';



@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatDialogModule,
    FlexLayoutModule,
    SharedModule,
    GridFilterDesktopModule,
    MatPaginatorModule,
    MatterViewByClientCoreModule
  ],
  declarations: [MatterViewByClientPopupComponent,
    MatterViewByClientLayoutComponent,
    MatterViewByClientManagerComponent],
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
  entryComponents: [MatterViewByClientPopupComponent]
})
export class MatterViewByClientDesktopModule {
  popupComponent = MatterViewByClientPopupComponent;
}

