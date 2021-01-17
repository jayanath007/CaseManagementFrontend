import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatProgressBarModule, MatNativeDateModule, MatPaginatorModule, MatButtonModule,
  MatInputModule, MatMenuModule, MatAutocompleteModule, MatListModule, MatIconModule, MatChipsModule,
  MatDialogModule,
  MatTooltipModule,
  MatToolbarModule,
  MatFormFieldModule
} from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { MailViewLayoutComponent } from './components/mail-view-layout/mail-view-layout.component';
import { MailViewHeaderComponent } from './components/mail-view-header/mail-view-header.component';
import { MailViewContentComponent } from './components/mail-view-content/mail-view-content.component';
import { MeetingRequestButtonComponent } from './components/meeting-request-button/meeting-request-button.component';
import { ComposeMailLayoutComponent } from './components/compose-mail-layout/compose-mail-layout.component';
import { ComposeMailContentComponent } from './components/compose-mail-content/compose-mail-content.component';
import { ComposeMailHeaderComponent } from './components/compose-mail-header/compose-mail-header.component';
import { ComposeDiscardDialogComponent } from './components/compose-discard-dialog/compose-discard-dialog.component';
import { RecipientInputManagerComponent } from './containers/recipient-input-manager.component';
import { ComposeMailManagerComponent } from './containers/compose-mail-manager.component';
import { ComposeMailStoreManagerComponent } from './containers/compose-mail-store-manager.component';
import { CkEditorModule } from '../ck-editor/ck-editor.module';
import { MailMessagePrintDirective } from './directives/mail-message-print.directive';
import { OrganizerDesktopSharedModule } from '../organizer-desktop-shared/organizer-desktop-shared.module';
import { AddMailBoxPopupComponent } from './components/add-mail-box-popup/add-mail-box-popup.component';
import { SearchMailFromListManagerComponent } from './containers/search-mail-from-list-manager.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatListModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatToolbarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    CkEditorModule,
    OrganizerDesktopSharedModule
  ],
  declarations: [
    MailViewLayoutComponent,
    MailViewHeaderComponent,
    MailViewContentComponent,
    MeetingRequestButtonComponent,
    ComposeMailLayoutComponent,
    ComposeMailContentComponent,
    ComposeMailHeaderComponent,
    ComposeDiscardDialogComponent,
    RecipientInputManagerComponent,
    ComposeMailManagerComponent,
    ComposeMailStoreManagerComponent,
    MailMessagePrintDirective,
    AddMailBoxPopupComponent,
    SearchMailFromListManagerComponent
  ],
  entryComponents: [
    ComposeDiscardDialogComponent,
    AddMailBoxPopupComponent
  ],
  exports: [
    MailViewLayoutComponent,
    ComposeMailLayoutComponent,
    ComposeMailManagerComponent,
    ComposeMailStoreManagerComponent,
    MailViewContentComponent,
    SearchMailFromListManagerComponent,
    AddMailBoxPopupComponent
  ]
})
export class MailDesktopSharedModule { }
