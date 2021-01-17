import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AutomaticRepliesSetting } from '../../../core/lib/microsoft-graph';
import { MatRadioChange, MatCheckboxChange } from '@angular/material';
import { DatePipe } from '@angular/common';
import { TimezonePipe } from '../../../shared';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';
import { timezoneConversions } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-automatic-replies-settings',
  templateUrl: './automatic-replies-settings.component.html',
  styleUrls: ['./automatic-replies-settings.component.scss']
})
export class AutomaticRepliesSettingsComponent implements OnInit {
  @Input() automaticRepliesSetting: AutomaticRepliesSetting;
  @Input() timeZone: string;

  @Output() changeAutomaticRepliesSetting = new EventEmitter<AutomaticRepliesSetting>();

  timeList = [
    '12:00', '12:30',
    '1:00', '1:30',
    '2:00', '2:30',
    '3:00', '3:30',
    '4:00', '4:30',
    '5:00', '5:30',
    '6:00', '6:30',
    '7:00', '7:30',
    '8:00', '8:30',
    '9:00', '9:30',
    '10:00', '10:30',
    '11:00', '11:30'
  ];
  isScheduled = false;
  get status() {
    return this.automaticRepliesSetting.status === 'disabled' ? 'disabled' : 'enabled';
  }
  get scheduled() {
    return this.automaticRepliesSetting.status === 'scheduled' || this.isScheduled;
  }
  get startDateTime() {
    return this.timezonePipe.transform(this.automaticRepliesSetting.scheduledStartDateTime.dateTime, this.timeZone);
  }
  get endDateTime() {
    return this.timezonePipe.transform(this.automaticRepliesSetting.scheduledEndDateTime.dateTime, this.timeZone);
  }
  get startDate() {
    return this.startDateTime.split('T')[0];
  }
  get endDate() {
    return this.endDateTime.split('T')[0];
  }
  get startTime() {
    return this.datePipe.transform(this.startDateTime, 'h:mm');
  }
  get endTime() {
    return this.datePipe.transform(this.endDateTime, 'h:mm');
  }
  get startPeriod() {
    return this.datePipe.transform(this.startDateTime, 'a');
  }
  get endPeriod() {
    return this.datePipe.transform(this.endDateTime, 'a');
  }

  constructor(public datePipe: DatePipe, private timezonePipe: TimezonePipe) { }

  ngOnInit() {
  }

  onChangeStartDate(value: Moment) {
    this.onChangeStartDateTime(value.format(), this.startTime, this.startPeriod);
  }
  onChangeEndDate(value: Moment) {
    this.onChangeEndDateTime(value.format(), this.endTime, this.endPeriod);
  }
  onChangeStartTime(value) {
    this.onChangeStartDateTime(this.startDate, value, this.startPeriod);
  }
  onChangeEndTime(value) {
    this.onChangeEndDateTime(this.endDate, value, this.endPeriod);
  }
  onStartTimePeriodChange(value) {
    this.onChangeStartDateTime(this.startDate, this.startTime, value);
  }
  onEndTimePeriodChange(value) {
    this.onChangeEndDateTime(this.endDate, this.endTime, value);
  }
  onChangeStartDateTime(date: string, time: string, period: string) {

    this.changeAutomaticRepliesSetting.emit(
      {
        ...this.automaticRepliesSetting,
        scheduledStartDateTime: {
          ...this.automaticRepliesSetting.scheduledStartDateTime, dateTime: this.getDateTimeUTC(date, time, period)
        }
      }
    );
  }
  onChangeEndDateTime(date: string, time: string, period: string) {
    this.changeAutomaticRepliesSetting.emit(
      {
        ...this.automaticRepliesSetting,
        scheduledEndDateTime: {
          ...this.automaticRepliesSetting.scheduledEndDateTime, dateTime: this.getDateTimeUTC(date, time, period)
        }
      }
    );
  }
  getDateTimeUTC(date: string, time: string, period: string) {
    const startDetails = date.split('T')[0];
    let hours = parseInt(time.split(':')[0], 0);
    const minute = parseInt(time.split(':')[1], 0);
    if (period === 'PM' && hours !== 12) {
      hours = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    return moment.tz(startDetails + 'T' + (hours > 9 ? '' : '0') + hours + ':' + (minute > 9 ? '' : '0') + minute
      , timezoneConversions[this.timeZone]).clone().tz(timezoneConversions['UTC']).format('YYYY-MM-DDTHH:mm:ss');
  }
  onStatusChange(event: MatRadioChange) {
    this.changeAutomaticRepliesSetting.emit(
      {
        ...this.automaticRepliesSetting,
        status: event.value === 'disabled' ? 'disabled' : (this.scheduled ? 'scheduled' : 'alwaysEnabled')
      }
    );
  }
  onScheduledChange(event: MatCheckboxChange) {
    this.isScheduled = event.checked;
    this.changeAutomaticRepliesSetting.emit(
      {
        ...this.automaticRepliesSetting,
        status: event.checked ? 'scheduled' : 'alwaysEnabled'
      }
    );
  }
  onIsOutsideChange(event: MatCheckboxChange) {
    this.changeAutomaticRepliesSetting.emit(
      {
        ...this.automaticRepliesSetting,
        externalAudience: event.checked ? 'all' : 'none'
      }
    );
  }
  onOutsideChange(event: MatRadioChange) {
    this.changeAutomaticRepliesSetting.emit(
      {
        ...this.automaticRepliesSetting,
        externalAudience: event.value
      }
    );
  }
  onInternalReplyMessageChange(event) {
    this.changeAutomaticRepliesSetting.emit(
      {
        ...this.automaticRepliesSetting,
        internalReplyMessage: event
      }
    );
  }
  onExternalReplyMessageChange(event) {
    this.changeAutomaticRepliesSetting.emit(
      {
        ...this.automaticRepliesSetting,
        externalReplyMessage: event
      }
    );
  }
}
