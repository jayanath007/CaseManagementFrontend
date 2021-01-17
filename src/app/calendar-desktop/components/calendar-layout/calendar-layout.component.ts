import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CalendarGroupItemWrapper, CalendarItem } from '../../../calendar-core';
import { MatDialog, MatCalendar } from '@angular/material';
import { CalendarTestEventsComponent } from '../calendar-test-events/calendar-test-events.component';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { DatePipe } from '@angular/common';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { Moment } from 'moment';

@Component({
  selector: 'dps-calendar-layout',
  templateUrl: './calendar-layout.component.html',
  styleUrls: ['./calendar-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarLayoutComponent implements OnInit {
  @Input() startSidenaveOpened: boolean;
  @Input() endSidenaveOpened: boolean;
  @Input() endSidenaveEnabled: boolean;
  @Input() isLoading: boolean;
  @Input() calendarGroups: { [id: string]: Readonly<CalendarGroupItemWrapper>; };
  @Input() calendarList: Readonly<CalendarItem<MsGraphBeta.Calendar>>[];
  @Input() activeOutlet: string;

  @Output() startSidenaveToggle = new EventEmitter();
  @Output() endSidenaveToggle = new EventEmitter();
  @Output() endSidenaveEnable = new EventEmitter();
  @Output() endSidenaveDisable = new EventEmitter();
  @Output() toggledgroup = new EventEmitter<string>();
  @Output() toggleCalendar = new EventEmitter();
  @Output() calendarGroupEditOperations = new EventEmitter();
  @Output() calendarEditOperations = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Output() editSeriesEvent = new EventEmitter<MsGraphBeta.Event>();

  @ViewChild('matCalendar') matCalendar: MatCalendar<Moment>;

  dateClass = (date: Moment) => { };

  constructor(public dialog: MatDialog, public popupService: SystemJsPopupLoaderService, public datePipe: DatePipe) { }

  ngOnInit() {
  }
  onStartSidenaveToggle() {
    this.startSidenaveToggle.emit();
  }
  onEndSidenaveToggle() {
    this.endSidenaveToggle.emit();
  }
  onEndSidenaveEnable() {
    this.endSidenaveEnable.emit();
  }
  onEndSidenaveDisable() {
    this.endSidenaveDisable.emit();
  }
  onGroupToggle(data) {
    this.toggledgroup.emit(data.id);
  }
  onToggleCalendar(event: CalendarItem<MsGraphBeta.Calendar>) {
    this.toggleCalendar.emit(event);
    if (!event.selected && this.calendarList.filter(val => val.selected).length > 8) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Warning',
          message: `You can't view more than 9 calendars at once. To view this calendar, clear your selection of another calendar`
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: false,
        hasBackdrop: true,
        panelClass: 'dps-notification',
      });
    }
  }
  onCalendarGroupEditOperations(action) {
    this.calendarGroupEditOperations.emit(action);
  }
  onCalendarEditOperations(action) {
    this.calendarEditOperations.next(action);
  }

  onOpenTestCalander() {
    if (this.calendarList &&
      this.calendarList.find(val => (val.data.isDefaultCalendar || (
        val.data.name === 'Calendar' &&
        val.data.canEdit === true &&
        val.data.canShare === true &&
        val.data.canViewPrivateItems === true))).data.owner.address.toLowerCase() === 'oismail@dpssoftware.co.uk') {
      const confirmDialogRef = this.dialog.open(CalendarTestEventsComponent, {
        width: '1000px',
        height: '550px',
        panelClass: 'dps-calendar-folder-panel',
        data: {}

      });
    }

  }

  onNewEvent(selectedDate: string) {
    const date = new Date(selectedDate + 'T00:00:00Z');

    date.setMinutes(date.getMinutes() + 480);
    const start = date.toISOString();

    date.setMinutes(date.getMinutes() + 30);
    const end = date.toISOString();
    if (this.calendarList && this.calendarList.length > 0) {
      const dateTime = new Date().toISOString();
      const event: MsGraphBeta.Event = {
        subject: '',
        body: { contentType: 'html', content: '<p></p>' },
        location: { displayName: '', locationType: 'default' },
        isAllDay: false,
        showAs: 'free',
        sensitivity: 'normal',
        calendar: this.calendarList.find(val => val.data.isDefaultCalendar || (
          val.data.name === 'Calendar' &&
          val.data.canEdit === true &&
          val.data.canShare === true &&
          val.data.canViewPrivateItems === true)).data,
        type: 'singleInstance',
        start: { dateTime: start, timeZone: 'UTC' },
        end: { dateTime: end, timeZone: 'UTC' },
        attendees: [],
        attachments: [],
        reminderMinutesBeforeStart: 15,
        responseRequested: true
      };
      this.editEvent.emit(event);
      this.popupService.openCalendarEditEventPopup('DPS_ADD_EVENT', dateTime).subscribe((data) => {
      });
    }
  }

  onRefreshMatCalendar({ start, end }: { start: Date, end: Date }) {
    this.dateClass = (date) => {
      if (start.valueOf() <= date.toDate().valueOf() && date.toDate().valueOf() < end.valueOf()) {
        return 'dps-date-highlight';
      }
      return '';
    };
    setTimeout(() => {
      this.matCalendar._goToDateInView(this.matCalendar.selected, 'month');
      this.matCalendar['_intlChanges'].next();
      if (this.matCalendar.monthView) {
        this.matCalendar.monthView._init();
      }
    }, 100);
  }

}
