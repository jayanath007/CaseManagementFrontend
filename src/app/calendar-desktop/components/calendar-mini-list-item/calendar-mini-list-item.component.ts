import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarItem } from '../../../calendar-core';
import { Calendar } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-calendar-mini-list-item',
  templateUrl: './calendar-mini-list-item.component.html',
  styleUrls: ['./calendar-mini-list-item.component.scss']
})
export class CalendarMiniListItemComponent implements OnInit, OnChanges {

  @Input() calendar: CalendarItem<Calendar>;
  @Output() toggleCalendar = new EventEmitter<{ groupId: string, calendarId: string }>();
  showProfileImg = false;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.calendar) {
      this.showProfileImg = false;
    }
  }
  onToggleCalendar(calendar) {
    this.toggleCalendar.emit(calendar);
  }

}
