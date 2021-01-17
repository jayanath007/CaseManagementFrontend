import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { CalendarEvent } from '../../../calendar-core/models/interfaces';

@Component({
  selector: 'dps-view-event-layout',
  templateUrl: './view-event-layout.component.html',
  styleUrls: ['./view-event-layout.component.scss']
})
export class ViewEventLayoutComponent implements OnInit, OnChanges {

  @Input() event: CalendarEvent<MsGraphBeta.Event>;
  @Input() freeBusyStatusList: { lable: string, val: MsGraphBeta.FreeBusyStatus }[];
  @Input() reminderList: { lable: string, val: number }[];
  @Input() timeZone: string;
  @Input() companyCode: any;

  @Output() close = new EventEmitter();
  @Output() reminderChange = new EventEmitter<{ calendarId: string, eventId: string, reminderMinutesBeforeStart: number }>();
  @Output() showAsStateChange = new EventEmitter<{ calendarId: string, eventId: string, showAs: MsGraphBeta.FreeBusyStatus }>();
  @Output() sensitivityChange = new EventEmitter<{ calendarId: string, eventId: string, sensitivity: MsGraphBeta.Sensitivity }>();
  @Output() response = new EventEmitter();
  @Output() openAttachement = new EventEmitter();
  @Output() downloardFileAttachment = new EventEmitter();
  @Output() removeFromCalendar = new EventEmitter();
  @Output() replyForward = new EventEmitter();
  @Output() seriesUpdate = new EventEmitter();
  @Output() openMatter = new EventEmitter();

  tempEvent: MsGraphBeta.Event;

  constructor() { }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (!this.tempEvent && changes.event && changes.event.currentValue) {
      this.tempEvent = {
        showAs: changes.event.currentValue.data.showAs,
        reminderMinutesBeforeStart: changes.event.currentValue.data.reminderMinutesBeforeStart,
        sensitivity: changes.event.currentValue.data.sensitivity
      };
    }
  }
  onClose(event) {
    this.close.emit(event);
  }

  onReminderChange(event) {
    if (event.isSeries) {
      this.tempEvent.reminderMinutesBeforeStart = event.reminderMinutesBeforeStart;
    } else {
      this.reminderChange.emit(event);
    }
  }

  onShowAsStateChange(event) {
    if (event.isSeries) {
      this.tempEvent.showAs = event.showAs;
    } else {
      this.showAsStateChange.emit(event);
    }
  }

  onSensitivityChange(event) {
    if (event.isSeries) {
      this.tempEvent.sensitivity = event.sensitivity;
    } else {
      this.sensitivityChange.emit(event);
    }
  }
  onResponse(event) {
    this.response.emit(event);
    if (this.event.data.type === 'seriesMaster' &&
      !(this.tempEvent.showAs === this.event.data.showAs &&
        this.tempEvent.sensitivity === this.event.data.sensitivity &&
        this.tempEvent.reminderMinutesBeforeStart === this.event.data.reminderMinutesBeforeStart)) {
      this.seriesUpdate.emit({
        calendarId: this.event.calendarId, eventId: this.event.data.id,
        event: this.tempEvent, isSeries: true
      });
    }
    this.close.emit('CLOSE');
  }
  onDownloardFileAttachment(event) {
    this.downloardFileAttachment.emit(event);
  }
  onOpenAttachement(attachment: MsGraphBeta.Attachment) {
    this.openAttachement.emit({ attachment: attachment, event: this.event });
  }
  onRemoveFromCalendar(event) {
    this.removeFromCalendar.emit(event);
  }
  onReplyForward(event) {
    this.replyForward.emit(event);
  }
  onOpenMatter(event) {
    this.openMatter.emit(event);
    this.close.emit('CLOSE');
  }
}
