import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEventWrapper } from '../../../calendar-core/models/interfaces';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-day-event-list',
  templateUrl: './day-event-list.component.html',
  styleUrls: ['./day-event-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayEventListComponent implements OnInit {

  @Input() selectedDate: string;
  @Input() calendarEvents: CalendarEventWrapper[];

  @Output() editEvent = new EventEmitter();
  @Output() loadSingleCalendarEvent = new EventEmitter<{ calendarId: string, eventId: string }>();
  @Output() response = new EventEmitter();
  @Output() removeFromCalendar = new EventEmitter();
  @Output() replyForward = new EventEmitter();
  @Output() showAsStateChange = new EventEmitter();
  @Output() editSeriesEvent = new EventEmitter<MsGraphBeta.Event>();

  constructor() { }

  ngOnInit() {
  }

  onEditEvent(event) {
    this.editEvent.emit(event);
  }
  onLoadSingleCalendarEvent(event) {
    this.loadSingleCalendarEvent.emit(event);
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
  onEditSeriesEvent(event: MsGraphBeta.Event) {
    this.editSeriesEvent.emit(event);
  }

}
