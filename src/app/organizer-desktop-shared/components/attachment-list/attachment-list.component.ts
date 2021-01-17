import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Attachment } from '../../../core/lib/microsoft-graph';
import { AttachmentWrapper } from '../../../compose-mail-core';
import { AccessControlService } from './../../../auth/services/access-control.service';
import { Module } from '../../../core/lib/app-settings';

@Component({
  selector: 'dps-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.scss']
})
export class AttachmentListComponent implements OnInit {
  @Input() attachments: Attachment[];
  @Input() composeAttachments: AttachmentWrapper[];
  @Input() canDelete: boolean;
  @Input() companyCode: any;
  @Input() mailItemData: any;
  @Input() isComputerDownloadOnly: string;

  @Output() downloardFileAttachment = new EventEmitter();
  @Output() deleteAttachment = new EventEmitter();
  @Output() openAttachement = new EventEmitter();
  @Output() openMatter = new EventEmitter();

  module = Module;

  constructor(private access: AccessControlService) { }

  ngOnInit() {
  }
  onDownloardFileAttachment(type, attachment: Attachment, event: MouseEvent) {
    if (this.mailItemData && this.mailItemData.popupType && this.mailItemData.popupType === 'eChitAuthorisations') {
    } else {
      this.downloardFileAttachment.emit({ attachment, type });
    }
  }
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
  onDeleteAttachment(attachment: Attachment, event: MouseEvent) {
    if (this.mailItemData && this.mailItemData.popupType && this.mailItemData.popupType === 'eChitAuthorisations') {
    } else {
      event.stopPropagation();
      this.deleteAttachment.emit(attachment);
    }
  }

  onClickAttachement(attachment: Attachment, event: MouseEvent) {
    if (this.mailItemData && this.mailItemData.popupType && this.mailItemData.popupType === 'eChitAuthorisations') {
    } else {
      this.openAttachement.emit(attachment);
    }
  }
  onClickDpsLink(attachment: Attachment, event: MouseEvent) {
    this.openMatter.emit(attachment.name.replace('.dps', ''));
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

}
