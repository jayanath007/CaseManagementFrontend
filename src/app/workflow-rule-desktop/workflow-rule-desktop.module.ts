import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule, AfterViewInit } from '@angular/core';
import {
    MatTabsModule, MatSelectModule, MatIconModule
    , MatListModule
    , MatButtonModule,
    MatChipsModule, MatToolbarModule, MatProgressBarModule, MatSnackBarModule, MatMenuModule, MatDialogModule
} from '@angular/material';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';

import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { SharedModule } from '../shared/shared.module';
import { WorkflowRuleManagerComponent } from './containers/workflow-rule-manager.component';
import { WorkflowRulePopupComponent } from './containers/workflow-rule-popup.component';
import { WorkflowRuleLayoutComponent } from './components/workflow-rule-layout/workflow-rule-layout.component';
import { WorkflowRuleCoreModule } from '../workflow-rule-core/workflow-rule-core.module';
import { WorkflowRuleService } from '../workflow-rule-core/services/workflow-rule.service';
import { WorkflowRuleListComponent } from './components/workflow-rule-list/workflow-rule-list.component';
import { RuleGridFixRowComponent } from './components/rule-grid-fix-row/rule-grid-fix-row.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { WorkflowHeaderComponent } from './components/workflow-header/workflow-header.component';

@NgModule({
    imports: [FormsModule,
        SharedModule,
        MatIconModule,
        CommonModule,
        WorkflowRuleCoreModule,
        MatProgressBarModule,
        HttpClientModule,
        MatChipsModule,
        SharedModule,
        MatSelectModule,
        MatListModule,
        MatButtonModule,
        MatDialogModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatMenuModule,
        GridFilterDesktopModule,
        ReactiveFormsModule],
    declarations: [
        WorkflowRuleManagerComponent,
        WorkflowRuleLayoutComponent,
        WorkflowRulePopupComponent,
        WorkflowRuleListComponent,
        RuleGridFixRowComponent,
        WorkflowHeaderComponent
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
        }],
    entryComponents: [WorkflowRulePopupComponent]
})

export class WorkflowRuleDesktopModule {
    popupComponent = WorkflowRulePopupComponent;
}
