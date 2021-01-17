import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MeetingResponseComentDialogComponent } from '../../../organizer-desktop-shared';
import { CalendarEvent } from '../../../calendar-core/models/interfaces';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';

@Component({
  selector: 'dps-view-event-header',
  templateUrl: './view-event-header.component.html',
  styleUrls: ['./view-event-header.component.scss']
})
export class ViewEventHeaderComponent implements OnInit {

  @Input() event: CalendarEvent<MsGraphBeta.Event>;

  @Output() response = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() removeFromCalendar = new EventEmitter();
  @Output() replyForward = new EventEmitter();

  constructor(public dialog: MatDialog, public popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }
  onClose() {
    this.close.emit('CLOSE');
  }
  onEditResponseBeforeSending(type: string, isSeries?: boolean) {
    let title = '';
    const eventType = isSeries === true ? 'series' : (this.event.data.seriesMasterId ? 'occurrence' : 'event');
    switch (type) {
      case 'accept':
        title = `Accept ${eventType} and add a response`;
        break;
      case 'decline':
        title = `Decline ${eventType} and add a response`;
        break;
      case 'tentativelyAccept':
        title = `Tentatively accept ${eventType} and add a response`;
        break;
    }
    const dialogRef = this.dialog.open(MeetingResponseComentDialogComponent, {
      width: '500px',
      height: '265px',
      data: { title: title },
      panelClass: 'dps-organizer-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.response.emit({
          event: this.event,
          comment: result.value, sendResponse: true, type: type, isSeries: this.event.data.type === 'seriesMaster' || isSeries === true
        });
      }
    });
  }
  onSendResponseNow(type: string, isSeries?: boolean) {
    this.response.emit({
      event: this.event,
      comment: '', sendResponse: true, type: type, isSeries: this.event.data.type === 'seriesMaster' || isSeries === true
    });
  }
  onDontSendResponse(type: string, isSeries?: boolean) {
    this.response.emit({
      event: this.event,
      comment: '', sendResponse: false, type: type, isSeries: this.event.data.type === 'seriesMaster' || isSeries === true
    });
  }
  onOpenSeries() {
    this.close.emit('OPEN_SERIES');
  }
  onRemoveFromCalendar() {
    let isSeries = false;
    if (this.event.data.type !== 'singleInstance') {
      isSeries = true;
    }
    this.removeFromCalendar.emit({
      calendarId: this.event.calendarId, eventId: this.event.data.seriesMasterId || this.event.data.id, isSeries: isSeries
    });
    this.close.emit('CLOSE');
  }
  onReplyForward(type) {
    this.replyForward.emit({ event: this.event, type: type });
  }
}
