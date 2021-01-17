import { MsgViewerModule } from './../msg-viewer/msg-viewer.module';
import { FileHistoryFixRowComponent } from './components/file-history-fix-row/file-history-fix-row.component';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FistoryHistoryManagerComponent } from './containers/file-history-manager.component';
import { FileHistoryLayoutComponent } from './components/file-history-layout/file-history-layout.component';
import { ColorByFileTypePipe } from './pipe/color-by-file-type.pipe';
import { DocumentViewModule } from '../document-view/document-view.module';
import { FileHistorySearchInputComponent } from './components/file-history-search-input/file-history-search-input.component';
import { FileHistoryCoreModule } from '../file-history-core/file-history-core.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import {
  MatTabsModule, MatInputModule, MatPaginatorModule, MatTableModule,
  MatExpansionModule, MatIconModule, MatButtonModule, MatProgressBarModule,
  MatListModule, MatToolbarModule, MatDialogModule, MatTooltipModule, MatChipsModule, MatSidenavModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FileHistoryComponent } from './components/file-history/file-history.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { MatMenuModule, MatCheckboxModule } from '@angular/material';
import { FileHistoryTwoGroupComponent } from './components/file-history-two-group/file-history-two-group.component';
import { FileHistoryGroupComponent } from './components/file-history-group/file-history-group.component';
import { FileHistoryDefaultComponent } from './components/file-history-default/file-history-default.component';
import { FileHistoryUiService } from '../file-history-core';
import { FileHistoryDesktopUiService } from './services/file-history-desktop-ui.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    FlexLayoutModule,
    FileHistoryCoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressBarModule,
    DocumentViewModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    GridFilterDesktopModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSidenavModule,
    MsgViewerModule
  ],
  exports: [FistoryHistoryManagerComponent,
    FileHistoryComponent,
    FileHistorySearchInputComponent,
    ColorByFileTypePipe,
    FileHistoryFixRowComponent],

  declarations: [FistoryHistoryManagerComponent,
    FileHistoryComponent,
    FileHistorySearchInputComponent,
    FileHistoryFixRowComponent,
    FileHistoryLayoutComponent,
    FileHistoryTwoGroupComponent,
    FileHistoryGroupComponent,
    FileHistoryDefaultComponent,
    ColorByFileTypePipe],
  providers: [
    { provide: FileHistoryUiService, useClass: FileHistoryDesktopUiService } as any,
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
  entryComponents: []
})
export class FileHistoryDesktopModule { }
