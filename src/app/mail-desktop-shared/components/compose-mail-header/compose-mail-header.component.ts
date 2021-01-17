import { InfoDialogType } from './../../../core/utility/DpsUtility';

import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ComposeDiscardDialogComponent } from '../compose-discard-dialog/compose-discard-dialog.component';
import { FileAttachment, DriveItem, Message } from '../../../core/lib/microsoft-graph';
import { uuid } from '../../../utils/uuid';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { AttachmentWrapper } from '../../../compose-mail-core';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { checkUploadFileIsBlacklisted, showInforDialog } from '../../../core/utility/DpsUtility';

@Component({
  selector: 'dps-compose-mail-header',
  templateUrl: './compose-mail-header.component.html',
  styleUrls: ['./compose-mail-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposeMailHeaderComponent implements OnInit {

  @Input() hasRecipientsList: boolean;
  @Input() isGoogle: boolean;
  @Input() listAttachements: AttachmentWrapper[];
  @Input() hasEmailSendAsPermission: boolean;
  @Input() item: Message;

  @Output() close = new EventEmitter();
  @Output() saveAndClose = new EventEmitter();
  @Output() send = new EventEmitter();
  @Output() sendAS = new EventEmitter();
  @Output() discard = new EventEmitter();
  @Output() draft = new EventEmitter();
  @Output() flagFollowUp = new EventEmitter();
  @Output() importance = new EventEmitter();
  @Output() addAttachment = new EventEmitter();
  @Output() openUrlPoup = new EventEmitter();
  @Output() showRecipientsList = new EventEmitter();
  @Output() subjectChange = new EventEmitter<string>();

  isWindowUrlPopup = false;
  fileUploaderId = uuid();

  constructor(public dialog: MatDialog, public popupService: SystemJsPopupLoaderService) { }


  ngOnInit() {
    if (window.opener && window.opener !== window && window.name !== 'mail') {
      this.isWindowUrlPopup = true;
    }
  }
  onClose(event: MouseEvent) {
    this.close.emit();
  }

  onOpenUrlPoup(event: MouseEvent) {
    this.openUrlPoup.emit();
  }

  onSend(event: MouseEvent) {
    this.send.emit();
  }
  onSendAs(event: MouseEvent) {
    this.sendAS.emit();
  }
  onDraft(event: MouseEvent) {
    this.draft.emit();
  }
  onDiscard(event: MouseEvent) {
    const dialogRef = this.dialog.open(ComposeDiscardDialogComponent, {
      panelClass: 'dps-organizer-dialog',
      width: '335px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Discard') {
        this.discard.emit();
      } else if (result === 'Save') {
        this.saveAndClose.emit();
      }
    });
  }

  onImportance(importance) {
    this.importance.emit(importance);
  }
  onFlagFollowUp(type: string) {
    this.flagFollowUp.emit(type);
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
      let backListedItem = '';
      for (let i = 0; i < files.length; i++) {
        if (checkUploadFileIsBlacklisted(files[i].name)) {
          backListedItem = `${backListedItem} <br>${files[i].name}`;
        } else {
          const reader: FileReader = new FileReader();
          let attachment: FileAttachment;
          reader.onload = (evt) => {
            const parts = (<any>reader.result).split(',');
            const base64Str = parts[1];
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
            this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'fileAttachment' });
          };
        }
      }
      if (backListedItem) {
        showInforDialog('Harmful file detection',
          `You are try to upload harmful file type, please contact admin.
           <br> Following items not uploaded <br> ${backListedItem}`, InfoDialogType.warning, this.dialog);
      }
    }
  }

  onShowRecipientsList() {
    this.showRecipientsList.emit();
  }
  onCloud() {
    if (this.validateTotleSizeOfAttachments()) {
      this.popupService.openDrivePopup(null, null).subscribe((val: any[]) => {
        if (val) {
          const attachments = val.filter(({ data, selected }: { data: DriveItem, selected: boolean }) => selected && data.file);
          const totalSize = attachments.
            map(({ data, selected }: { data: DriveItem, selected: boolean }) => data.size).reduce((total, size) => total + size);
          if (this.validateTotleSizeOfUploadingAttachments(totalSize)) {
            attachments.forEach(({ data, selected }: { data: DriveItem, selected: boolean }) => {
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
              this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'oneDriveAttachment' });
            });
          }
        }
      });
    }

  }
  validateTotleSizeOfAttachments() {
    const totalSize = this.listAttachements.map(val => val.attachment.size).reduce((total, val) => total + val, 0);
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
    const totalSize = this.listAttachements.map(val => val.attachment.size).reduce((total, val) => total + val, 0);
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

  onSecure() {
    if (!!this.item && (!this.item.subject || !this.item.subject.includes('SECURE:'))) {
      this.subjectChange.emit(`SECURE: ${this.item.subject}`);
    }

  }

  onDNF() {
    if (!!this.item && (!this.item.subject || !this.item.subject.includes('DNF:'))) {
      this.subjectChange.emit(`DNF: ${this.item.subject}`);
    }
  }

}
