import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipientInputComponent } from './components/recipient-input/recipient-input.component';
import { MatChipsModule, MatInputModule, MatListModule, MatIconModule, MatAutocompleteModule, MatTooltipModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { MeetingResponseComentDialogComponent } from './components/meeting-response-coment-dialog/meeting-response-coment-dialog.component';
import { AttachmentListComponent } from './components/attachment-list/attachment-list.component';
import { BodyHandlerService } from './services/body-handler.service';
import { MsgraphClientService } from './services/msgraph-client.service';
import { CidToAttachemntUrlPipe } from './pipes/cid-to-attachemnt-url.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatChipsModule,
    MatTooltipModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [RecipientInputComponent, MeetingResponseComentDialogComponent, AttachmentListComponent, CidToAttachemntUrlPipe],
  exports: [RecipientInputComponent, MeetingResponseComentDialogComponent, AttachmentListComponent, CidToAttachemntUrlPipe],
  providers: [MsgraphClientService, BodyHandlerService, CidToAttachemntUrlPipe],
  entryComponents: [
    MeetingResponseComentDialogComponent
  ],
})
export class OrganizerDesktopSharedModule { }
