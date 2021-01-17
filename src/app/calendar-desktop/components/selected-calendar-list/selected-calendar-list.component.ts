import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-selected-calendar-list',
  templateUrl: './selected-calendar-list.component.html',
  styleUrls: ['./selected-calendar-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedCalendarListComponent implements OnInit {
  @Input() calendareViewList: { loading: boolean; color: string; name: string; groupId: string; calendarId: string }[];

  @Output() removeCalendar = new EventEmitter<{ calendarId: string, groupId: string }>();

  selectable = true;
  removable = true;
  constructor() { }

  ngOnInit() {
  }
  onRemoveCalendar(calendarId: string, groupId: string) {
    this.removeCalendar.emit({ calendarId: calendarId, groupId: groupId });
  }
}
