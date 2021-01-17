import { FlexLayoutModule } from '@angular/flex-layout';

import { MatListModule, MatProgressBarModule, MatIconModule, MatToolbarModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootFoldersListComponent } from './components/root-folders-list/root-folders-list.component';
import { RootFoldersListManagerComponent } from './containers/root-folders-list-manager.component';
import { DriveCoreModule } from '../drive-core/drive-core.module';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { TileViewComponent } from './components/tile-view/tite-view.component';
import { IconViewComponent } from './components/icon-view/icon-view.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { DriveContextMenueComponent } from './components/drive-context-menue/drive-context-menue.component';
import { DriveFolderContentManagerComponent } from './containers/drive-folder-content-manager.component';
import { DriveFileItemViewComponent } from './components/drive-file-item-view/drive-file-item-view.component';
import { DriveFileItemViewManagerComponent } from './containers/drive-file-item-view-manager.component';
import { DriveFilePathManagerComponent } from './containers/drive-file-path-manager.component';
import { DriveItemPathListComponent } from './components/drive-item-path-list/drive-item-path-list.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddNewMenueComponent } from './components/add-new-menue/add-new-menue.component';
import { DrivePopupComponent } from './components/drive-popup/drive-popup.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
    DriveCoreModule
  ],
  declarations: [
    RootFoldersListComponent,
    RootFoldersListManagerComponent,
    DetailViewComponent,
    TileViewComponent,
    IconViewComponent,
    ListViewComponent,
    DriveContextMenueComponent,
    DriveFolderContentManagerComponent,
    DriveFileItemViewComponent,
    DriveFileItemViewManagerComponent,
    DriveItemPathListComponent,
    DriveFilePathManagerComponent,
    AddNewMenueComponent
  ],
  exports: [
    RootFoldersListManagerComponent,
    DriveFileItemViewManagerComponent,
    DriveFilePathManagerComponent,
    DriveFolderContentManagerComponent
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
  ]
})
export class DriveDesktopModule { }
@NgModule({
  imports: [
    DriveDesktopModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    FlexLayoutModule,
    CommonModule,
    MatDialogModule
  ],
  declarations: [
    DrivePopupComponent,
  ],
  entryComponents: [DrivePopupComponent]
})
export class DriveDesktopPopupModule {
  popupComponent = DrivePopupComponent;
}
