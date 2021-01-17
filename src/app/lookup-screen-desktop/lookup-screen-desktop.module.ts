import { LookupScreenContentManagerComponent } from './containers/lookup-screen-content-manager.component';
import { LookupScreenContentComponent } from './component/lookup-screen-content/lookup-screen-content.component';
import { LookupScreenLayoutComponent } from './component/lookup-screen-layout/lookup-screen-layout.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop/grid-filter-desktop.module';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LookupScreenPopupComponent } from './containers/lookup-screen-popup.component';

import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { MatInputModule, MatToolbarModule, MatPaginatorModule, MatButtonModule, MatProgressBarModule, MatListModule, MatIconModule, MatCheckboxModule } from '@angular/material';
import { LookupScreenGridRowComponent } from './component/lookup-screen-grid-row/lookup-screen-grid-row.component';

// @NgModule({
//   imports: [
//     CommonModule
//   ],
//   declarations: [LookupScreenPopupComponent]
// })
// export class LookupScreenDesktopModule { }




@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    MatInputModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatProgressBarModule,
    MatListModule,
    GridFilterDesktopModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  declarations: [LookupScreenPopupComponent,
    LookupScreenContentManagerComponent,
    LookupScreenLayoutComponent,
    LookupScreenContentComponent,
    LookupScreenGridRowComponent
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
  entryComponents: [LookupScreenPopupComponent]
})
export class LookupScreenDesktopModule {
  popupComponent = LookupScreenPopupComponent;
}
