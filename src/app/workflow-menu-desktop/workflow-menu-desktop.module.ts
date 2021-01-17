import { InforDialogComponent } from '../shared/components/infor-dialog/infor-dialog.component';
import { MatterSummaryComponent } from './components/matter-summary/matter-summary.component';
import { WorkflowMenuViewDetailsComponent } from './components/workflow-menu-view-details/workflow-menu-view-details.component';
import { WorkflowMenuViewComponent } from './components/workflow-menu-view/workflow-menu-view.component';
import { WorkflowMenuIconPipe } from '../shared/pipes/workflow-menu-icon.pipe';
import { SharedModule } from '../shared/shared.module';
import { WorkflowMenuCoreModule } from '../workflow-menu-core/workflow-menu-core.module';
import { UiTreeComponent } from './components/ui-tree/ui-tree.component';
import {
  MatInputModule, MatFormFieldModule, MatSelectModule, MatListModule,
  MatIconModule, MatToolbarModule, MatProgressBarModule, MatTooltipModule, MatSidenavModule
} from '@angular/material';
import { WorkflowMenuRouterHostComponent } from './containers/workflow-menu-router-host.component';
import { WorkflowMenuMainLayoutComponent } from './components/workflow-menu-main-layout/workflow-menu-main-layout.component';
import { WorkflowMenuManagerComponent } from './containers/workflow-menu-manager.component';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { WorkflowSessionEffects } from './effects/workflow-session.effects';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    WorkflowMenuCoreModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatSidenavModule,
    EffectsModule.forFeature([WorkflowSessionEffects]),
  ],
  declarations: [
    WorkflowMenuManagerComponent,
    WorkflowMenuMainLayoutComponent,
    WorkflowMenuRouterHostComponent,
    UiTreeComponent,
    WorkflowMenuViewComponent,
    WorkflowMenuViewDetailsComponent,
    MatterSummaryComponent
  ],
  exports: [WorkflowMenuRouterHostComponent],
  entryComponents: [WorkflowMenuRouterHostComponent]
})
export class WorkflowMenuDesktopModule { }
