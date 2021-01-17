
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'dps-view-event-popup-manager',
    template: `
    <dps-view-event-manager #viewEventManager [calendarId]="data.input.calendarId" [eventId]="data.input.eventId">
      <mat-progress-bar mode="indeterminate" *ngIf="!(viewEventManager.event$|async)"></mat-progress-bar>
      <dps-view-event-layout *ngIf="(viewEventManager.event$|async)?.data"
        [event]="viewEventManager.event$|async"
        [freeBusyStatusList]="viewEventManager.freeBusyStatusList$|async"
        [companyCode]="(viewEventManager.user$|async)?.general?.companyCode"
        [timeZone]="(viewEventManager.user$|async)?.userTimeZone?.info.alias"
        [reminderList]="viewEventManager.reminderList$|async"
        (close)="onClose($event)"
        (openMatter)="viewEventManager.onOpenMatter($event)"
        (reminderChange) = "viewEventManager.onReminderChange($event)"
        (showAsStateChange) = "viewEventManager.onShowAsStateChange($event)"
        (sensitivityChange) ="viewEventManager.onSensitivityChange($event)"
        (downloardFileAttachment)="viewEventManager.onDownloardFileAttachment($event)"
        (openAttachement)="viewEventManager.openAttachement($event)"
        (removeFromCalendar)="viewEventManager.onRemoveFromCalendar($event)"
        (response)="viewEventManager.onResponse($event)"
        (replyForward)="viewEventManager.onReplyForward($event)"
        (seriesUpdate)="viewEventManager.onSeriesUpdate($event)">
      </dps-view-event-layout>
    </dps-view-event-manager>
  `,
    styles: []
})

export class ViewEventPopupManagerComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: { calendarId: string, eventId: string }, token: string },
        public dialogRef: MatDialogRef<ViewEventPopupManagerComponent>) { }

    ngOnInit() {
    }
    onClose(event) {
        this.dialogRef.close(event);
    }
}
