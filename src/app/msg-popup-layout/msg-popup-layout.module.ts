import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsgPopupHostComponent } from './containers/msg-popup-host.component';
import { MsgPopupManagerComponent } from './containers/msg-popup-manager.component';
import { MsgPopupViewComponent } from './components/msg-popup-view/msg-popup-view.component';
import { MatProgressBarModule, MatIconModule, MatListModule, MatToolbarModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    MatProgressBarModule,
    MailDesktopSharedModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
  ],
  declarations: [
    MsgPopupViewComponent,
    MsgPopupManagerComponent,
    MsgPopupHostComponent
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
    DatePipe
  ],
  entryComponents: [MsgPopupHostComponent]
})
export class MsgPopupLayoutModule {
  popupComponent = MsgPopupHostComponent;
}

