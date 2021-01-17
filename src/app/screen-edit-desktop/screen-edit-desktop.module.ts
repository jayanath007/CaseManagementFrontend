import { ScreenEditContentComponent } from './component/screen-edit-content/screen-edit-content.component';
import { ScreenEditLayoutComponent } from './component/screen-edit-layout/screen-edit-layout.component';
import { ScreenEditTreeComponent } from './component/screen-edit-tree/screen-edit-tree.component';
import { ScreenEditContentManagerComponent } from './containers/screen-edit-content-manager.component';
import { ScreenEditPopupComponent } from './containers/screen-edit-popup.component';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GridFilterDesktopModule } from '../grid-filter-desktop/grid-filter-desktop.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'angular-tree-component';

import { MatInputModule, MatPaginatorModule, MatToolbarModule, MatButtonModule
// tslint:disable-next-line:import-spacing
, MatProgressBarModule, MatListModule, MatIconModule, MatCheckboxModule, MatRadioModule, MatSelectModule }from '@angular/material';
import { ScreenEditPipe } from './pipes/screen-edit.pipe';

// @NgModule({
//   imports: [
//     CommonModule
//   ],
//   declarations: [ScreenEditDesktopComponent]
// })
// export class ScreenEditDesktopModule {
//  }

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
    MatListModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    TreeModule,
  ],
  declarations: [ScreenEditPopupComponent,
    ScreenEditContentManagerComponent,
    ScreenEditTreeComponent,
    ScreenEditLayoutComponent,
    ScreenEditContentComponent,
    ScreenEditPipe

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
  entryComponents: [ScreenEditPopupComponent]
})
export class ScreenEditDesktopModule {
  popupComponent = ScreenEditPopupComponent;
}
