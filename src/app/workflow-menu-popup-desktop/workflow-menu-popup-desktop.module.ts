import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatListModule, MatToolbarModule, MatProgressBarModule, MatDialogModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { WorkFlowMenuPopupManagerComponent } from './containers/workflow-menu-popup-manager.component';
import { WorkflowMenuPopupComponent } from './containers/workflow-menu-popup.component';
import { WorkflowMenuPopupCoreModule } from '../workflow-menu-popup-core/workflow-menu-popup-core.module';
import { WorkflowMenuPopupLayoutComponent } from './components/workflow-menu-popup-layout/workflow-menu-popup-layout.component';
import { TreeModule } from 'angular-tree-component';


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
    WorkflowMenuPopupCoreModule,
    TreeModule
  ],
  declarations: [WorkflowMenuPopupComponent,
    WorkFlowMenuPopupManagerComponent,
    WorkflowMenuPopupLayoutComponent
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
  entryComponents: [WorkflowMenuPopupComponent]
})
export class WorkflowMenuPopupDesktopModule {
  popupComponent = WorkflowMenuPopupComponent;
}

