import { Store } from '@ngrx/store';
import { FolderViewContainerComponent } from './components/folder-view-container/folder-view-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth/index';
import {
  MatIconModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatListModule,
  MatButtonToggleModule,
  MatTableModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatCheckboxModule,
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SafeBoxExplorerManagerComponent } from './containers/safe-box-explorer-manager.component';
import { SafeBoxExplorerCoreModule } from '../safe-box-explorer-core/safe-box-explorer-core.module';
import { SafeBoxExplorerLayoutComponent } from './components/safe-box-explorer-layout/safe-box-explorer-layout.component';
import { SafeBoxExplorerManagerRouterHostComponent } from './containers/safe-box-explorer-manager-router-host.component';
import { SafeBoxExplorerRoutingModule } from './safe-box-explorer-routing.module';
import { TreeModule } from 'angular-tree-component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { FileItemViewComponent } from './components/file-item-view/file-item-view.component';
import { TreeViewUiComponent } from './components/tree-view-ui/tree-view-ui.component';
import { SafeboxContextMenueComponent } from './components/safebox-context-menue/safebox-context-menue.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { ContentViewComponent } from './components/content-view/content-view.component';
import { TitlesViewComponent } from './components/titles-view/titles-view.component';
import { ViewTypesComponent } from './components/view-types/view-types.component';
import { EffectsModule } from '../../../node_modules/@ngrx/effects';
import { SafeBoxExplorerEffects } from './effects/safe-box-explorer.effects';
import { DriveDesktopModule } from '../drive-desktop/drive-desktop.module';
import { TemplateDirectoryAppListComponent } from './components/template-directory-app-list/template-directory-app-list.component';
import { TemplateDirectoryManagerComponent } from './containers/template-directory-manager.component';
import { TemplateDirectoryHeaderComponent } from './components/template-directory-header/template-directory-header.component';
import { TemplateListViewComponent } from './components/template-list-view/template-list-view.component';
import { AddNewMenueComponent } from './components/add-new-menue/add-new-menue.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SafeBoxExplorerCoreModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule,
    MatSidenavModule,
    ReactiveFormsModule,
    SafeBoxExplorerRoutingModule,
    TreeModule,
    MatListModule,
    MatButtonToggleModule,
    MatTableModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatCheckboxModule,
    EffectsModule.forFeature([SafeBoxExplorerEffects]),
    DriveDesktopModule
  ],
  declarations: [
    SafeBoxExplorerLayoutComponent,
    SafeBoxExplorerManagerComponent,
    SafeBoxExplorerManagerRouterHostComponent,
    FolderViewContainerComponent,
    FileItemViewComponent,
    TreeViewUiComponent,
    SafeboxContextMenueComponent,
    ListViewComponent,
    DetailViewComponent,
    ContentViewComponent,
    TitlesViewComponent,
    ViewTypesComponent,
    TemplateDirectoryAppListComponent,
    TemplateDirectoryManagerComponent,
    TemplateDirectoryHeaderComponent,
    TemplateListViewComponent,
    AddNewMenueComponent
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
  ],
})
export class SafeBoxExplorerDesktopModule { }
