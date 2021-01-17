import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalendarEvent } from '../../../calendar-core/models/interfaces';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';

@Component({
  selector: 'dps-day-event-item',
  templateUrl: './day-event-item.component.html',
  styleUrls: ['./day-event-item.component.scss']
})
export class DayEventItemComponent implements OnInit {

  @Input() calendarEvent: CalendarEvent<Readonly<MsGraphBeta.Event>>;

  @Output() editEvent = new EventEmitter();
  @Output() loadSingleCalendarEvent = new EventEmitter<{ calendarId: string, eventId: string }>();
  @Output() response = new EventEmitter();
  @Output() removeFromCalendar = new EventEmitter();
  @Output() replyForward = new EventEmitter();
  @Output() showAsStateChange = new EventEmitter();
  @Output() editSeriesEvent = new EventEmitter<MsGraphBeta.Event>();

  constructor(public popupService: SystemJsPopupLoaderService, ) { }

  ngOnInit() {

  }

  contextmenuOpen(event, contextMenu) {
    event.preventDefault();
    contextMenu.openMenu();
  }
  onEventDblClick(event: CalendarEvent<MsGraphBeta.Event>) {
    if (event && event.data.isOrganizer && event.isEditable) {
      this.editEvent.emit(event.data);
      this.popupService.openCalendarEditEventPopup('DPS_EDIT_EVENT', '').subscribe((data) => {
        switch (data) {
          case 'OPEN_SERIES':
            this.onOpenSeries(event);
            break;
          case 'CLOSE':
            break;
        }
      });
    } else {
      this.popupService.openCalendarViewEventPopup('DPS_VIEW_EVENT',
        { calendarId: event.calendarId, eventId: event.data.id }).subscribe((data) => {
          switch (data) {
            case 'OPEN_SERIES':
              this.onOpenSeries(event);
              break;
            case 'CLOSE':
              break;
          }
        });
    }
  }
  onOpenOccurrence(event: CalendarEvent<MsGraphBeta.Event>) {
    this.onEventDblClick(event);
  }
  onOpenSeries(event: CalendarEvent<MsGraphBeta.Event>) {
    if (event.data.isOrganizer && event.isEditable) {
      this.editSeriesEvent.emit(event.data);
      setTimeout(() => {
        this.popupService.openCalendarEditEventPopup('DPS_EDIT_EVENT_SERIES', '').subscribe((data) => {
        });
      }, 10);
    } else {
      this.loadSingleCalendarEvent.emit({ calendarId: event.calendarId, eventId: event.data.seriesMasterId });
      this.popupService.openCalendarViewEventPopup('DPS_VIEW_EVENT',
        { calendarId: event.calendarId, eventId: event.data.seriesMasterId }).subscribe((_data) => {

        });
    }
  }
  onResponse(event) {
    this.response.emit(event);
  }
  onRemoveFromCalendar(event) {
    this.removeFromCalendar.emit(event);
  }
  onReplyForward(event) {
    this.replyForward.emit(event);
  }
  onShowAsStateChange(event) {
    this.showAsStateChange.emit(event);
  }

}
