import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiaryFolderLayoutComponent } from './components/diary-folder-layout/diary-folder-layout.component';
import { DiaryFolderPopupComponent } from './containers/diary-folder-popup.component';
import { DiaryFolderManagerComponent } from './containers/diary-folder-manager.component';
import { DiaryFolderCoreModule } from '../diary-folder-core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { SharedModule } from '../shared/shared.module';
import { MatTreeModule } from '@angular/material/tree';
import {
  MatToolbarModule, MatIconModule, MatCheckboxModule, MatProgressBarModule, MatTooltipModule, MatListModule,
} from '@angular/material';
import { TreeModule } from 'angular-tree-component';
import { DiaryFolderViewComponent } from './components/diary-folder-view/diary-folder-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DiaryFolderCoreModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTooltipModule,
    TreeModule,
    MatTreeModule,
    MatListModule
  ],
  declarations: [
    DiaryFolderLayoutComponent,
    DiaryFolderPopupComponent,
    DiaryFolderManagerComponent,
    DiaryFolderViewComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    }
  ],
  entryComponents: [DiaryFolderPopupComponent]
})
export class DiaryFolderDesktopModule {
  popupComponent = DiaryFolderPopupComponent;
}
