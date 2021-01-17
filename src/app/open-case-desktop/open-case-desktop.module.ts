import { WorkflowMenuDesktopModule } from '../workflow-menu-desktop/workflow-menu-desktop.module';
import { OpenCaseLayoutComponent } from './components/open-case-layout/open-case-layout.component';
import { RouterModule } from '@angular/router';
import { CommonTabRouterHostComponent } from './containers/common-tab-router-host.component';
import { EffectsModule } from '@ngrx/effects';
import { TimesFinancialFiguresComponent } from './components/times-financial-figures/times-financial-figures.component';
import { FileHistoryDesktopModule } from '../file-history-desktop/file-history-desktop.module';
import { OpenCaseHomeComponent } from './containers/open-case-home/open-case-home.component';
import { NgModule } from '@angular/core';
import { OpenCaseRoutingModule } from './open-case-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatTabsModule, MatButtonModule, MatIconModule,
  MatSidenavModule, MatCardModule, MatListModule, MatToolbarModule, MatTooltipModule, MatMenuModule
} from '@angular/material';
import { OpenCaseCoreModule } from '../open-case-core/open-case-core.module';
import { CommonModule } from '@angular/common';
import { CaseTaskDesktopModule } from '../case-task-desktop/case-task-desktop.module';
import { OpenCaseRouteGuardService } from './services/open-case-route-guard.service';
import { OpenCaseRouterHostComponent } from './containers/open-case-router-host.component';
import { CaseContactDesktopModule } from '../case-contact-desktop/case-contact-desktop.module';
import { CaseTimeDesktopModule } from '../case-time-desktop/case-time-desktop.module';
import { OpenCaseHeaderComponent } from './components/open-case-header/open-case-header.component';
import { OpenCaseTabsComponent } from './components/open-case-tabs/open-case-tabs.component';
import { SharedModule } from '../shared/shared.module';
import { WorkflowSessionEffects } from './effects/workflow-session.effects';
import { ContactTypeScreensComponent } from './components/contact-type-screens/contact-type-screens.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { BundlingDesktopModule } from '../bundling-desktop/bundling-desktop.module';
import { BundlingManagerComponent } from '../bundling-desktop/containers/bundling-manager.component';
import { MlsDesktopModule } from '../mls-desktop/mls-desktop.module';
import { SharedDataModule } from './../shared-data/shared-data.module';

@NgModule({
  imports: [
    OpenCaseRoutingModule,
    SharedModule,
    SharedDataModule,
    CommonModule,
    FlexLayoutModule,
    OpenCaseCoreModule,
    FileHistoryDesktopModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    CaseTaskDesktopModule,
    CaseContactDesktopModule,
    CaseTimeDesktopModule,
    MlsDesktopModule  ,
    RouterModule,
    WorkflowMenuDesktopModule,
    MatSlideToggleModule,
    EffectsModule.forFeature([WorkflowSessionEffects]),
  ],
  providers: [OpenCaseRouteGuardService],
  declarations: [OpenCaseHomeComponent,
    OpenCaseHeaderComponent,
    OpenCaseTabsComponent,
    OpenCaseRouterHostComponent,
    TimesFinancialFiguresComponent,
    CommonTabRouterHostComponent,
    OpenCaseLayoutComponent,
    ContactTypeScreensComponent,
  ],
  entryComponents: [ContactTypeScreensComponent]
})
export class OpenCaseDesktopModule { }
