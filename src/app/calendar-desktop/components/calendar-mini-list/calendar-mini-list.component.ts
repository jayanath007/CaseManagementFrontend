import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { CalendarItem } from '../../../calendar-core';
import { Calendar } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-calendar-mini-list',
  templateUrl: './calendar-mini-list.component.html',
  styleUrls: ['./calendar-mini-list.component.scss']
})
export class CalendarMiniListComponent implements OnInit {

  @Input() calendarList: Readonly<CalendarItem<Calendar>>[];
  @Output() toggleCalendar = new EventEmitter<{ groupId: string, calendarId: string }>();
  constructor() { }

  ngOnInit() {
  }

  onToggleCalendar(calendar) {
    this.toggleCalendar.emit(calendar);
  }

}
