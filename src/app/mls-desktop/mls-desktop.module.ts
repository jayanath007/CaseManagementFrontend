import { MatToolbarModule } from '@angular/material/toolbar';
import { MlsPopupLayoutComponent } from './components/mls-popup-layout/mls-popup-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MlsManagerComponent } from '../mls-desktop/containers/mls-manager.component';
import { MlsChatItemComponent } from './components/mls-chat-item/mls-chat-item.component';
import {
  MatListModule, MatButtonModule, MatInputModule, MatProgressBarModule,
  MatIconModule, MatDividerModule, MatCheckboxModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { MlsLayoutComponent } from './components/mls-layout/mls-layout.component';
import { MlsComposeMessageComponent } from './components/mls-compose-message/mls-compose-message.component';
import { MlsChatListItemComponent } from './components/mls-chat-list-item/mls-chat-list-item.component';
import { MlsCoreModule } from '../mls-core/mls-core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import { ExceptionInterceptor } from './../shared/services/exception-interceptor.service';
import { MlsPopupManagerComponent } from './containers/mls-popup-manager.component';
import { RecipientInputManagerComponent } from './containers/recipient-input-manager.component';
import { OrganizerDesktopSharedModule } from '../organizer-desktop-shared/organizer-desktop-shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    SharedModule,
    MatInputModule,
    MlsCoreModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatCheckboxModule,
    OrganizerDesktopSharedModule
  ],
  declarations: [
    MlsManagerComponent,
    MlsLayoutComponent,
    MlsChatItemComponent,
    MlsComposeMessageComponent,
    MlsChatListItemComponent,
    RecipientInputManagerComponent],
  exports: [MlsManagerComponent],
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
})
export class MlsDesktopModule { }


@NgModule({
  imports: [
    MlsDesktopModule,
    SharedModule,
    MlsCoreModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule
  ],
  declarations: [MlsPopupManagerComponent, MlsPopupLayoutComponent],
  entryComponents: [MlsPopupManagerComponent]
})
export class MLSDesktopPopupModule {
  popupComponent = MlsPopupManagerComponent; // use in popup service as entry component
}

