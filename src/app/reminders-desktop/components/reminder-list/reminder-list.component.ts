import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Reminder } from '../../../core/lib/microsoft-graph';
import * as moment from 'moment';

@Component({
  selector: 'dps-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss']
})
export class ReminderListComponent implements OnInit {
  @Input() reminderList: Reminder[];
  @Input() curentTime: string;

  @Output() snooze = new EventEmitter();
  @Output() dismiss = new EventEmitter();
  @Output() dismissAll = new EventEmitter();

  snoozeList = [
    { lable: '5 minutes', val: 5 },
    { lable: '10 minutes', val: 10 },
    { lable: '15 minutes', val: 15 },
    { lable: '30 minutes', val: 30 },
    { lable: '1 hour', val: 60 },
    { lable: '2 hour', val: 120 },
    { lable: '3 hour', val: 180 },
    { lable: '4 hour', val: 240 },
    { lable: '8 hour', val: 480 },
    { lable: '12 hour', val: 720 },
    { lable: '1 day', val: 720 },
    { lable: '2 day', val: 1440 },
    { lable: '3 day', val: 2160 },
    { lable: '1 week', val: 5040 },
    { lable: '2 week', val: 10080 },
  ];
  constructor() { }

  ngOnInit() {
  }
  onSnoozeClick(value, reminder: Reminder) {
    const newReminderTime = new Date(this.curentTime);
    newReminderTime.setMinutes(newReminderTime.getMinutes() + value);
    this.snooze.emit({ reminder: reminder, newReminderTime: newReminderTime.toISOString() });
  }
  onDismissClick(reminder: Reminder) {
    this.dismiss.emit(reminder);
  }
  overdueRemaining(reminder: Reminder) {
    const curentTime = new Date(this.curentTime).valueOf();
    const eventStartTime = new Date(reminder.eventStartTime.dateTime).valueOf();
    return curentTime > eventStartTime ? 'Overdue' : (curentTime < eventStartTime ? 'Remaining' : 'Now');
  }
  durationString(reminder: Reminder): string {
    const curentTime = new Date(this.curentTime).valueOf();
    const eventStartTime = new Date(reminder.eventStartTime.dateTime).valueOf();
    const tempTime = moment.duration(curentTime > eventStartTime ? (curentTime - eventStartTime) : (eventStartTime - curentTime));
    if (tempTime.years() && tempTime.years() > 0) {
      return tempTime.years() + ' Year' + ((tempTime.years() > 1) ? 's ' : '');
    }
    if (tempTime.months() && tempTime.months() > 0) {
      return tempTime.months() + ' Month' + ((tempTime.months() > 1) ? 's ' : '');
    }
    if (tempTime.weeks() && tempTime.weeks() > 0) {
      return tempTime.weeks() + ' Week' + ((tempTime.weeks() > 1) ? 's ' : '');
    }
    if (tempTime.days() && tempTime.days() > 0) {
      return tempTime.days() + ' Day' + ((tempTime.days() > 1) ? 's ' : '');
    }
    if (tempTime.hours() && tempTime.hours() > 0) {
      return tempTime.hours() + ' Hour' + ((tempTime.hours() > 1) ? 's ' : '');
    }
    if (tempTime.minutes() && tempTime.minutes() > 0) {
      return tempTime.minutes() + ' Minute' + ((tempTime.minutes() > 1) ? 's ' : '');
    }
  }
  onDismissAll() {
    this.dismissAll.emit(this.reminderList);
  }
}
