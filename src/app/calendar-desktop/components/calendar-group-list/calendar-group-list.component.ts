import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { CalendarGroupItemWrapper } from '../../../calendar-core';

@Component({
  selector: 'dps-calendar-group-list',
  templateUrl: './calendar-group-list.component.html',
  styleUrls: ['./calendar-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarGroupListComponent implements OnInit {
  @Input() calendarGroups: { [id: string]: Readonly<CalendarGroupItemWrapper>; };
  constructor() { }

  @Output() toggledgroup = new EventEmitter<CalendarGroupItemWrapper>();
  @Output() toggleCalendar = new EventEmitter<{ groupId: string, calendarId: string }>();
  @Output() calendarGroupEditOperations = new EventEmitter();
  @Output() calendarEditOperations = new EventEmitter();

  ngOnInit() {
  }

  onGroupToggle(data) {
    this.toggledgroup.emit(data);
  }

  onToggleCalendar(event) {
    this.toggleCalendar.emit(event);
  }

  onCalendarGroupEditOperations(action) {
    this.calendarGroupEditOperations.next(action);
  }

  onCalendarEditOperations(action) {
    this.calendarEditOperations.next(action);
  }
}
