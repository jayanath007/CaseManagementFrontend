import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalendarEvent } from '../../../calendar-core/models/interfaces';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { MeetingResponseComentDialogComponent } from '../../../organizer-desktop-shared';

@Component({
  selector: 'dps-event-context-menue',
  templateUrl: './event-context-menue.component.html',
  styleUrls: ['./event-context-menue.component.scss']
})
export class EventContextMenueComponent implements OnInit {

  @Input() calendarEvent: CalendarEvent<Readonly<MsGraphBeta.Event>>;

  @Output() open = new EventEmitter();
  @Output() openOccurrence = new EventEmitter();
  @Output() openSeries = new EventEmitter();
  @Output() response = new EventEmitter();
  @Output() removeFromCalendar = new EventEmitter();
  @Output() replyForward = new EventEmitter();
  @Output() showAsStateChange = new EventEmitter<{
    calendarId: string, eventId: string,
    showAs: MsGraphBeta.FreeBusyStatus, isSeries: boolean
  }>();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  constructor(public dialog: MatDialog) { }

  public openMenu() {
    this.contextMenu.openMenu();
  }

  ngOnInit() {
  }
  onOpenOccurrence(event: CalendarEvent<MsGraphBeta.Event>) {
    this.openOccurrence.emit(event);
  }
  onOpenSeries(event: CalendarEvent<MsGraphBeta.Event>) {
    this.openSeries.emit(event);
  }
  onOpen(event: CalendarEvent<MsGraphBeta.Event>) {
    this.open.emit(event);
  }
  onEditResponseBeforeSending(type: string, event: CalendarEvent<MsGraphBeta.Event>, isSeries?: boolean) {
    let title = '';
    const eventType = isSeries === true ? 'series' : (event.data.seriesMasterId ? 'occurrence' : 'event');
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
      case 'cancel':
        title = `Cancel ${eventType} and add a message`;
        break;
    }
    const dialogRef = this.dialog.open(MeetingResponseComentDialogComponent, {
      width: '500px',
      height: '265px',
      data: { title: title },
      panelClass: 'dps-organizer-dialog',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.response.emit({ event: event, comment: result.value, sendResponse: true, type: type, isSeries: isSeries === true });
      }
    });
  }
  onSendResponseNow(type: string, event: CalendarEvent<MsGraphBeta.Event>, isSeries?: boolean) {
    this.response.emit({ event: event, comment: '', sendResponse: true, type: type, isSeries: isSeries === true });
  }
  onDontSendResponse(type: string, event: CalendarEvent<MsGraphBeta.Event>, isSeries?: boolean) {
    this.response.emit({ event: event, comment: '', sendResponse: false, type: type, isSeries: isSeries === true });
  }
  onRemoveFromCalendar(event) {
    let isSeries = false;
    if (event.data.type !== 'singleInstance') {
      isSeries = true;
    }
    this.removeFromCalendar.emit({
      calendarId: event.calendarId, eventId: event.data.seriesMasterId || event.data.id, isSeries: isSeries
    });
  }
  onReplyForward(type, event, isSeries?: boolean) {
    this.replyForward.emit({ event: event, type: type, isSeries: isSeries });
  }
  onShowAsStateChange(type, event: CalendarEvent<Readonly<MsGraphBeta.Event>>) {
    this.showAsStateChange.emit({
      calendarId: event.calendarId, eventId: event.data.seriesMasterId || event.data.id, showAs: type, isSeries: !!event.data.seriesMasterId
    });
  }
  onDelete(event, isSeries?: boolean) {
    this.removeFromCalendar.emit({
      calendarId: event.calendarId, eventId: isSeries === true ? event.data.seriesMasterId : event.data.id, isSeries: isSeries
    });
  }
}

