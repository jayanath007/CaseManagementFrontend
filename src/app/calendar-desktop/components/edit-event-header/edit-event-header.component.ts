import { MatterInfo } from '../../../add-note-core/models/interfaces';
import { MatDialog } from '@angular/material';
import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { EventDiscardDialogComponent } from '../event-discard-dialog/event-discard-dialog.component';
import { FileAttachment } from '../../../core/lib/microsoft-graph';
import { uuid } from '../../../utils/uuid';
import { MeetingResponseComentDialogComponent } from '../../../organizer-desktop-shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { MatterInputData } from '../../../core';
import { Utilities } from '../../../utils/utilities';
import { InforDialogComponent, InforDialogData } from '../../../shared';
import { AttachmentWrapper } from '../../../compose-mail-core';

@Component({
  selector: 'dps-edit-event-header',
  templateUrl: './edit-event-header.component.html',
  styleUrls: ['./edit-event-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditEventHeaderComponent implements OnInit, OnChanges {

  @Input() event: MsGraphBeta.Event;
  @Input() isDirty: boolean;
  @Input() isNewEvent: boolean;
  @Input() isAttachmentLoad: boolean;
  @Input() isAttachmentChange: boolean;
  @Input() companyCode: any;
  @Input() attachments: AttachmentWrapper[];
  @Input() matterDisplyName: string;

  @Output() close = new EventEmitter();
  @Output() saveAndSend = new EventEmitter();
  @Output() delete = new EventEmitter<MsGraphBeta.Event>();
  @Output() addAttachment = new EventEmitter<{ attachment: FileAttachment, uid: string, type: string, event: MsGraphBeta.Event }>();
  @Output() openSeriers = new EventEmitter();
  @Output() response =
    new EventEmitter<{ event: MsGraphBeta.Event, comment: string, sendResponse: boolean, type: string, isSeries: boolean }>();

  hasAttendees = false;

  constructor(public dialog: MatDialog, public popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.event && !changes.event.previousValue &&
      changes.event.currentValue && this.event.attendees && this.event.attendees.length > 0) {
      this.hasAttendees = true;
    }
  }
  onClose() {
    if (this.isDirty || (this.isAttachmentChange && this.event.attendees && this.event.attendees.length > 0)) {
      const dialogRef = this.dialog.open(EventDiscardDialogComponent, {
        data: this.isDirty ? 'Close' : 'AttachmentsChanged',
        width: '335px',
        panelClass: 'dps-organizer-dialog'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Discard') {
          // this.close.emit();
          if (this.isNewEvent && this.event.id) {
            this.delete.emit(this.event);
            this.close.emit('Delete');
          } else {
            this.close.emit();
          }
        } else if (result === 'Send') {
          this.onSaveAndSend();
        }
      });
    } else if (this.isNewEvent && this.event.id) {
      this.delete.emit(this.event);
      this.close.emit('Delete');
    } else {
      this.close.emit();
    }

  }
  onSaveAndSend() {
    if (!this.event.subject) {
      const dialogRef = this.dialog.open(EventDiscardDialogComponent, {
        data: this.event.attendees && this.event.attendees.length > 0 ? 'TitleValidationWithAttendees' : 'TitleValidation',
        width: '335px',
        panelClass: 'dps-organizer-dialog'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Send') {
          this.saveAndSend.emit();
          this.close.emit('SaveAndSend');
        }
      });
    } else {
      setTimeout(() => {
        this.saveAndSend.emit();
        this.close.emit('SaveAndSend');
      }, 2010);

    }
  }

  onDelete(type) {
    if (this.isNewEvent && this.event.id) {
      type = 'Delete';
    }
    if (this.isDirty || this.event.id) {
      const dialogRef = this.dialog.open(EventDiscardDialogComponent, {
        data: type,
        width: '335px',
        panelClass: 'dps-organizer-dialog'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Delete') {
          this.delete.emit(this.event);
          this.close.emit('Delete');
        } else if (result === 'Discard') {
          if (this.event.id) {
            this.delete.emit(this.event);
          }
          this.close.emit('Delete');
        }
      });

    } else {
      this.close.emit();
    }

  }
  onFromComputer(fileUploader) {
    if (this.validateTotleSizeOfAttachments()) {
      fileUploader.onFileUploadBtnClick();
    }
  }
  onAddAttachment(files: File[]) {
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      totalSize = totalSize + files[i].size;
    }
    if (this.validateTotleSizeOfUploadingAttachments(totalSize)) {
      for (let i = 0; i < files.length; i++) {
        const reader: FileReader = new FileReader();
        let attachment: FileAttachment;
        reader.onload = (evt) => {
          const parts = (<string>reader.result).split(',');
          const base64Str: any = parts[1];
          attachment = {
            name: files[i].name,
            contentBytes: base64Str,
            size: files[i].size,
            contentType: files[i].type,
            isInline: false
          };
        };
        reader.readAsDataURL(files[i]);
        reader.onloadend = (evt) => {
          attachment['@odata.type'] = '#microsoft.graph.fileAttachment';
          this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'fileAttachment', event: this.event });
        };
      }
    }
  }
  onCloud() {
    if (this.validateTotleSizeOfAttachments()) {
      this.popupService.openDrivePopup(null, null).subscribe((val: any[]) => {
        if (val) {
          const attachments = val.filter(({ data, selected }: { data: MsGraphBeta.DriveItem, selected: boolean }) => selected && data.file);
          const totalSize = attachments
            .map(({ data, selected }: { data: MsGraphBeta.DriveItem, selected: boolean }) => data.size)
            .reduce((total, size) => total + size);
          if (this.validateTotleSizeOfUploadingAttachments(totalSize)) {
            attachments.forEach(({ data, selected }: { data: MsGraphBeta.DriveItem, selected: boolean }) => {
              const attachment = {
                name: data.name,
                // contentBytes: base64Str,
                size: data.size,
                // contentType: data.,
                isInline: false,
                itemId: data.id,
                driveId: data.parentReference.driveId
              };
              attachment['@odata.type'] = '#microsoft.graph.fileAttachment';
              this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'oneDriveAttachment', event: this.event });
            });
          }
        }
      });
    }

  }
  validateTotleSizeOfAttachments() {
    const totalSize = this.attachments.map(val => val.attachment.size).reduce((total, val) => total + val, 0);
    if (totalSize > 34000000) {
      const dialogData: InforDialogData = {
        content: {
          title: `Attachments`,
          message: `The total size of attachments that can be attached is 34 MB. Please try attaching fewer items.`
        },
        data: { messageType: 'alert' },
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });
      return false;
    }
    return true;
  }
  validateTotleSizeOfUploadingAttachments(size: number) {
    const totalSize = this.attachments.map(val => val.attachment.size).reduce((total, val) => total + val, 0);
    if (totalSize + size > 34000000) {
      const limit = Math.round(((34000000 - totalSize) / 100000)) / 10;
      const dialogData: InforDialogData = {
        content: {
          title: `Attachments`,
          message: `The total size of attachments that can be attached is 34 MB. Please try attaching less than ${limit} MB item(s).`
        },
        data: { messageType: 'alert' },
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });
      return false;
    }
    return true;
  }

  onOpenSeries() {
    this.openSeriers.emit();
  }
  onEditResponseBeforeSending(isSeries?: boolean) {
    const eventType = isSeries === true ? 'series' : (this.event.seriesMasterId ? 'occurrence' : 'event');
    const title = `Cancel ${eventType} and add a message`;
    const dialogRef = this.dialog.open(MeetingResponseComentDialogComponent, {
      width: '500px',
      height: '265px',
      data: { title: title },
      panelClass: 'dps-organizer-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.response.emit({ event: this.event, comment: result.value, sendResponse: true, type: 'cancel', isSeries: isSeries === true });
        this.close.emit();
      }
    });
  }
  onSendResponseNow(isSeries?: boolean) {
    this.response.emit({ event: this.event, comment: '', sendResponse: true, type: 'cancel', isSeries: isSeries === true });
    this.close.emit();
  }
  onLinkWithMatter() {
    const matterInputData: MatterInputData = { isMatterSearch: false };
    this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData).subscribe((result: MatterInfo) => {
      if (result) {
        const attachment: FileAttachment = {
          name: Utilities.CreateDPSSubject(result.BranchID, result.AppID, result.FileID, this.companyCode) + '.dps',
          contentBytes: <any>btoa(JSON.stringify(result)),
          size: 0,
          contentType: 'text/plain',
          isInline: false
        };
        attachment['@odata.type'] = '#microsoft.graph.fileAttachment';
        this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'fileAttachment', event: this.event });
      }
    });

  }
}
