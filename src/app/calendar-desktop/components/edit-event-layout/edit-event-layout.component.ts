
import { MatDialog } from '@angular/material';
import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { CalendarItem } from '../../../calendar-core';
import { Attendee, FileAttachment, Attachment } from '../../../core/lib/microsoft-graph';
import { EventEditInfo, RepeatType, AttachmentWrapper } from '../../../calendar-core/models/interfaces';
import { InforDialogComponent } from '../../../shared/components/infor-dialog/infor-dialog.component';
import { CalendarTranslationsService } from '../../../calendar-core/services/calendar-translations.service';
import { InforDialogData, ConfirmDialogData, ConfirmDialogWithCancelResultKind } from '../../../shared';
import { EventDiscardDialogComponent } from '../event-discard-dialog/event-discard-dialog.component';
import { ConfirmDialogComponentWithCancel } from '../../../shared';
import { MainMenuItemResolverService } from '../../../layout-desktop';
@Component({
  selector: 'dps-edit-event-layout',
  templateUrl: './edit-event-layout.component.html',
  styleUrls: ['./edit-event-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditEventLayoutComponent implements OnInit {
  @Input() event: MsGraphBeta.Event;
  @Input() optionalAttendees: MsGraphBeta.Attendee[];
  @Input() requiredAttendees: MsGraphBeta.Attendee[];
  @Input() timeList: string[];
  @Input() dayOfWeekList: { lable: string, val: MsGraphBeta.DayOfWeek }[];
  @Input() freeBusyStatusList: { lable: string, val: MsGraphBeta.FreeBusyStatus }[];
  @Input() reminderList: { lable: string, val: number }[];
  @Input() weekIndexList: MsGraphBeta.WeekIndex[];
  @Input() monthList: string[];
  @Input() repeatList: { lable: string, val: string, recurrence?: MsGraphBeta.RecurrencePattern }[];
  @Input() canEditCalendars: CalendarItem<Readonly<MsGraphBeta.Calendar>>[];
  @Input() timeZone: string;
  @Input() repeatTypeList: RepeatType[];
  @Input() isDirty: boolean;
  @Input() isNewEvent: boolean;
  @Input() attachments: AttachmentWrapper[];
  @Input() isAttachmentLoad: boolean;
  @Input() isAttachmentChange: boolean;
  @Input() lastInlineAttachment: AttachmentWrapper;
  @Input() companyCode: any;
  @Input() matterDisplyName: string;
  @Input() rooms: MsGraphBeta.EmailAddress[];

  @Output() addAttachment = new EventEmitter<{ attachment: FileAttachment, uid: string, type: string, event: MsGraphBeta.Event }>();
  @Output() deleteAttachment = new EventEmitter<{ event: MsGraphBeta.Event, attachmentId: string }>();
  @Output() close = new EventEmitter();
  @Output() AddAttendee = new EventEmitter<Attendee>();
  @Output() removeAttendee = new EventEmitter<Attendee>();
  @Output() updateEventData = new EventEmitter<EventEditInfo>();
  @Output() saveAndSend = new EventEmitter<MsGraphBeta.Event>();
  @Output() delete = new EventEmitter<MsGraphBeta.Event>();
  @Output() openAttachement = new EventEmitter<{ itemId: string, attachement: Attachment, urlCache: null }>();
  @Output() downloardFileAttachment = new EventEmitter<{ itemId: string, attachment: Attachment, type }>();
  @Output() response =
    new EventEmitter<{
      event: MsGraphBeta.Event, comment: string, sendResponse: boolean, type: string, isSeries: boolean,
    }>();
  @Output() openMatter = new EventEmitter();
  constructor(private dialog: MatDialog, private translations: CalendarTranslationsService) { }

  ngOnInit() {
  }

  onClose(event) {
    this.close.emit({ type: event, attachmentChange: this.isAttachmentChange, event: this.event });
  }

  onAddAttendee(attendee: Attendee) {
    this.AddAttendee.emit(attendee);
  }

  onRemoveAttendee(attendee: Attendee) {
    this.removeAttendee.emit(attendee);
  }

  onUpdateEventData(updateInfo: EventEditInfo) {
    this.updateEventData.emit(updateInfo);
  }
  onSaveAndSend() {
    this.saveAndSend.emit(this.event);
  }
  onDelete(event) {
    this.delete.emit(event);
  }
  onAddAttachment(attachmentData: { attachment: FileAttachment, uid: string, type: string, event: MsGraphBeta.Event }) {
    if (attachmentData && attachmentData.attachment.size < 35000000) {
      this.addAttachment.emit(attachmentData);
    } else {
      const dialogData: InforDialogData = {
        content: {
          title: this.translations.file_attachment_size_validation_title,
          message: this.translations.file_attachment_size_validation_message
        },
        data: { messageType: 'alert' },
        contentParams: {
          displayName: attachmentData.attachment.name, displaySize: '' +
            Math.round(attachmentData.attachment.size / 1000000)
        },
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });
    }


  }
  onDeleteAttachment(attachmentData: { event: MsGraphBeta.Event, attachmentId: string }) {
    this.deleteAttachment.emit(attachmentData);
  }
  onOpenAttachement(attachment: { itemId: string, attachement: Attachment, urlCache: null }) {
    this.openAttachement.emit(attachment);
  }
  onDownloardFileAttachment(attachmentData: { itemId: string, attachment: Attachment, type }) {
    this.downloardFileAttachment.emit(attachmentData);
  }
  onOpenSeries() {
    if (this.isDirty) {
      const dialogRef = this.dialog.open(EventDiscardDialogComponent, {
        data: 'OpenSeries',
        width: '335px',
        panelClass: 'dps-organizer-dialog'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'OpenSeriesSave') {
          this.saveAndSend.emit(this.event);
          this.close.emit({ type: 'OPEN_SERIES', attachmentChange: this.isAttachmentChange, event: this.event });
        } else if (result === 'OpenSeriesDiscard') {
          this.close.emit({ type: 'OPEN_SERIES', attachmentChange: this.isAttachmentChange, event: this.event });
        }
      });
    } else {
      this.close.emit({ type: 'OPEN_SERIES', attachmentChange: this.isAttachmentChange, event: this.event });
    }
  }
  onCancelEvent(cancelInfo: { event: MsGraphBeta.Event, comment: string, sendResponse: boolean, type: string, isSeries: boolean }) {
    this.response.emit(cancelInfo);
  }
  onOpenMatter(event) {
    const dialogData: ConfirmDialogData = {
      content: {
        title: `Open ${this.matterDisplyName} Link`,
        message: `<p>There can be unsaved data in your event.</p>`,
        acceptLabel: 'Save and Open',
        rejectLabel: 'Don’t Save and Open',
        cancelLabel: 'Cancel'
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponentWithCancel, {
      data: dialogData,
      width: '500px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {
        this.openMatter.emit(event);
        this.onSaveAndSend();
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
        this.openMatter.emit(event);
        this.onClose('');
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {
      }
    });
  }
}
