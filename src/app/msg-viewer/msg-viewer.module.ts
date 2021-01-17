import { MatProgressBarModule, MatToolbarModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsgViewerComponent } from './components/msg-viewer/msg-viewer.component';
import { MsgViewerPopupComponent } from './components/msg-viewer-popup/msg-viewer-popup.component';
import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatToolbarModule,
    SharedModule,
    MailDesktopSharedModule,
  ],
  declarations: [MsgViewerComponent, MsgViewerPopupComponent],
  exports: [MsgViewerComponent],
  entryComponents: [MsgViewerPopupComponent]
})
export class MsgViewerModule {
  popupComponent = MsgViewerPopupComponent;
}
