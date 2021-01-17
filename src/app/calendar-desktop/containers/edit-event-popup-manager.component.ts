
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'dps-edit-event-popup-manager',
  template: `
    <dps-edit-event-manager #editEventManager (closePopup)="onClose($event)">
    <mat-progress-bar mode="indeterminate" *ngIf="!(editEventManager.event$|async)"></mat-progress-bar>
      <dps-edit-event-layout *ngIf="(editEventManager.event$|async)"
        [event]="editEventManager.event$|async"
        [rooms]="editEventManager.rooms$|async"
        [optionalAttendees]="editEventManager.optionalAttendees$|async"
        [requiredAttendees]="editEventManager.requiredAttendees$|async"
        [timeList]="editEventManager.timeList$|async"
        [dayOfWeekList]="editEventManager.dayOfWeekList$|async"
        [freeBusyStatusList]="editEventManager.freeBusyStatusList$|async"
        [companyCode]="(editEventManager.user$|async)?.general?.companyCode"
        [timeZone]="(editEventManager.user$|async)?.userTimeZone?.info.alias"
        [reminderList]="editEventManager.reminderList$|async"
        [weekIndexList]="editEventManager.weekIndexList$|async"
        [monthList]="editEventManager.monthList$|async"
        [repeatList]="editEventManager.repeatList$|async"
        [canEditCalendars]="editEventManager.canEditCalendars$|async"
        [repeatTypeList]="editEventManager.repeatTypeList$|async"
        [isDirty]="editEventManager.isDirty$|async"
        [isNewEvent]="editEventManager.isNewEvent$|async"
        [attachments]="editEventManager.attachments$|async"
        [isAttachmentLoad]="editEventManager.isAttachmentLoad$|async"
        [isAttachmentChange]="editEventManager.isAttachmentChange$|async"
        [lastInlineAttachment]="editEventManager.lastInlineAttachment$|async"
        [matterDisplyName]="editEventManager.matterDisplyName"
        (close)="editEventManager.onClose($event)"
        (openMatter)="editEventManager.onOpenMatter($event)"
        (AddAttendee)="editEventManager.onAddAttendee($event)"
        (removeAttendee)="editEventManager.onRemoveAttendee($event)"
        (updateEventData)="editEventManager.onUpdateEventData($event)"
        (saveAndSend)="editEventManager.onSaveAndSend($event)"
        (delete)="editEventManager.onDelete($event)"
        (addAttachment)="editEventManager.onAddAttachment($event)"
        (deleteAttachment)="editEventManager.onDeleteAttachment($event)"
        (openAttachement)="editEventManager.onOpenAttachement($event)"
        (downloardFileAttachment)="editEventManager.onDownloardFileAttachment($event)"
        (response)="editEventManager.onCancelEvent($event)">
      </dps-edit-event-layout>
    </dps-edit-event-manager>
  `,
  styles: []
})

export class EditEventPopupManagerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
    public dialogRef: MatDialogRef<EditEventPopupManagerComponent>) { }

  ngOnInit() {
  }

  onClose(event) {
    this.dialogRef.close(event);
  }

}


