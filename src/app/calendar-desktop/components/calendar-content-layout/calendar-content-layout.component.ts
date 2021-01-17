import { DatePipe } from '@angular/common';
import {
  Component, OnInit, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CalendarEvent, FullCalendar } from '../../../calendar-core';
import {
  MatCheckboxChange, MatButtonToggleChange, MatButtonToggleGroup, MatDatepickerInput, MatDatepicker
} from '@angular/material';
import * as moment from 'moment';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { EventContextMenueComponent } from '../event-context-menue/event-context-menue.component';
import { CalendarItem } from '../../../calendar-core';
import { isMobile } from '../../../utils/is-mobile';
import { TimezonePipe } from '../../../shared';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import interaction from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventApi, View } from '@fullcalendar/core';
import { Moment } from 'moment';

@Component({
  selector: 'dps-calendar-content-layout',
  templateUrl: './calendar-content-layout.component.html',
  styleUrls: ['./calendar-content-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarContentLayoutComponent implements OnInit, OnChanges {

  @Input() currentView: string;
  @Input() currentTitle: string;
  @Input() showBusinessHours: boolean;
  @Input() calendareViewList: { loading: boolean; color: string; name: string; groupId: string; calendarId: string }[];
  @Input() calendarEventList: CalendarEvent<Readonly<MsGraphBeta.Event>>[];
  @Input() selectedDate: string;
  @Input() endSidenaveOpened: boolean;
  @Input() defaultCalendar: CalendarItem<Readonly<MsGraphBeta.Calendar>>[];
  @Input() timeZone: string;


  @Output() changeCalendarView = new EventEmitter();
  @Output() changeCalendarTitle = new EventEmitter();
  @Output() changeShowBusinessHours = new EventEmitter();
  @Output() endSidenaveEnable = new EventEmitter();
  @Output() endSidenaveDisable = new EventEmitter();
  @Output() refreshMatCalendar = new EventEmitter();

  @Output() editEvent = new EventEmitter();
  @Output() response = new EventEmitter();
  @Output() removeFromCalendar = new EventEmitter();
  @Output() replyForward = new EventEmitter();
  @Output() showAsStateChange = new EventEmitter();
  @Output() viewChanged = new EventEmitter<{ start: string, end: string, viewType: { type: string, startDay: number } }>();
  @Output() loadCalendarEvents = new EventEmitter<{ calendarId: string, groupId: string }>();
  @Output() changeSelectedDate = new EventEmitter();
  @Output() eventDateTimeChange = new EventEmitter();
  @Output() loadSingleCalendarEvent = new EventEmitter<{ calendarId: string, eventId: string }>();
  @Output() editSeriesEvent = new EventEmitter<MsGraphBeta.Event>();

  @ViewChild(FullCalendarComponent) fullCalendar: FullCalendarComponent;
  // @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  @ViewChild(MatButtonToggleGroup) group: MatButtonToggleGroup;
  @ViewChild(MatDatepickerInput) matDatepickerInput: MatDatepickerInput<any>;
  @ViewChild(EventContextMenueComponent) eventContextMenue: EventContextMenueComponent;

  calendarOptions: FullCalendar;
  slotMoment;
  contextEvent: CalendarEvent<Readonly<MsGraphBeta.Event>>;
  isMobile = false;
  touchtime = 0;

  constructor(public popupService: SystemJsPopupLoaderService, public datePipe: DatePipe, private timezonePipe: TimezonePipe) { }

  ngOnInit() {
    this.isMobile = !!isMobile().any();
    let minTime = '';
    let maxTime = '';
    if (!this.isMobile) {
      this.group.writeValue(this.currentView);
    }
    if (this.showBusinessHours) {
      minTime = '08:00';
      maxTime = '17:00';
    } else {
      minTime = '00:00';
      maxTime = '24:00';
    }
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, momentPlugin, interaction],
      editable: true,
      eventLimit: true,
      defaultView: this.currentView,
      nowIndicator: true,
      fixedWeekCount: false,
      slotEventOverlap: false,
      eventOverlap: true,
      navLinks: true,
      now: () => {
        return this.timezonePipe.transform(new Date().toISOString(), this.timeZone);
      },
      // timezone: 'America/Chicago',
      defaultDate: this.selectedDate,
      minTime: minTime,
      maxTime: maxTime,
      height: 'parent',
      header: {
        left: '',
        center: '',
        right: ''
      },
      views: {
        timeGridFourDay: {
          buttonText: 'work week',
          hiddenDays: [0, 6],
          type: 'timeGridWeek',
          titleFormat: 'MMMM D, YYYY',
          columnHeaderFormat: 'D dddd'
        },
        timeGridWeek: {
          titleFormat: 'MMMM D, YYYY',
          columnHeaderFormat: 'D dddd'
        },
        dayGridMonth: {
          columnHeaderFormat: 'dddd'
        }
      },
      events: this.calendarEventList || [],
      timeGridEventMinHeight: 20,
      navLinkDayClick: (date, jsEvent) => {
        const calendar = this.fullCalendar.getApi();
        calendar.changeView('timeGridDay');
        calendar.gotoDate(date);
        // this.fullCalendar.fullCalendar('changeView', 'agendaDay');
        // this.fullCalendar.fullCalendar('gotoDate', date.format());
      },
      // eventAfterAllRender: (view) => { this.eventAfterAllRender(view); }
    };
    setTimeout(() => {
      const calendar = this.fullCalendar.getApi();
      this.refreshMatCalendar.emit({ start: calendar.view.currentStart, end: calendar.view.currentEnd });
    }, 10);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.fullCalendar) {
      const calendar = this.fullCalendar.getApi();
      if (calendar) {
        if (changes.calendarEventList) {
          // calendar.removeAllEvents();
          // calendar.event
          calendar.rerenderEvents();
          // this.fullCalendar.fullCalendar('removeEvents');
          // this.fullCalendar.fullCalendar('renderEvents', changes.calendarEventList.currentValue, true);
          // this.fullCalendar.fullCalendar('rerenderEvents');
        }
        if (changes.timeZone) {
          calendar.setOption('now', () => {
            return this.timezonePipe.transform(new Date().toISOString(), this.timeZone);
          });
          // this.fullCalendar.fullCalendar('option', 'now', () => {
          //   return this.timezonePipe.transform(new Date().toISOString(), this.timeZone);
          // });
        }
        calendar.updateSize();
      }
    }

  }

  onEventDateTimeChange(event: EventApi) {
    const _event: MsGraphBeta.Event = JSON.parse(
      JSON.stringify({ isAllDay: event.allDay, end: event.extendedProps.data.end, start: event.extendedProps.data.start }));
    _event.start.dateTime = moment(event.start).format();
    _event.end.dateTime = moment(event.end).format();
    this.eventDateTimeChange.emit({
      calendarId: event.extendedProps.calendarId, eventId: event.extendedProps.data.id, event: _event, isSeries: false
    });
  }

  onViewChange(event: MatButtonToggleChange) {
    const calendar = this.fullCalendar.getApi();
    calendar.changeView(event.value, this.selectedDate);
    calendar.gotoDate(this.selectedDate);
    setTimeout(() => {
      this.refreshMatCalendar.emit({ start: calendar.view.currentStart, end: calendar.view.currentEnd });
    }, 10);
    // this.fullCalendar.fullCalendar('changeView', event.value, this.selectedDate);
    // this.fullCalendar.fullCalendar('gotoDate', this.selectedDate);
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
  onOpenOccurrence(event: any) {
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
  onPrev() {
    this.fullCalendar.getApi().prev();
    // this.fullCalendar.fullCalendar('prev');
    setTimeout(() => {
      const calendar = this.fullCalendar.getApi();
      this.refreshMatCalendar.emit({ start: calendar.view.currentStart, end: calendar.view.currentEnd });
    }, 10);
  }
  onNext() {
    this.fullCalendar.getApi().next();
    // this.fullCalendar.fullCalendar('next');
    setTimeout(() => {
      const calendar = this.fullCalendar.getApi();
      this.refreshMatCalendar.emit({ start: calendar.view.currentStart, end: calendar.view.currentEnd });
    }, 10);
  }
  onToday() {
    this.changeSelectedDate.emit(this.timezonePipe.transform(new Date().toISOString(), this.timeZone));
    // this.fullCalendar.fullCalendar('today');
    setTimeout(() => {
      this.fullCalendar.getApi().today();
    }, 5);
    setTimeout(() => {
      const calendar = this.fullCalendar.getApi();
      this.refreshMatCalendar.emit({ start: calendar.view.currentStart, end: calendar.view.currentEnd });
    }, 10);
  }
  onShowBusinessHours(event: MatCheckboxChange) {
    this.changeShowBusinessHours.emit(event.checked);
    const calendar = this.fullCalendar.getApi();
    if (event.checked) {
      calendar.setOption('minTime', '08:00');
      calendar.setOption('maxTime', '17:00');
      // this.fullCalendar.fullCalendar('option', {
      //   minTime: '08:00',
      //   maxTime: '17:00'
      // });
    } else {
      calendar.setOption('minTime', '00:00');
      calendar.setOption('maxTime', '24:00');
      // this.fullCalendar.fullCalendar('option', {
      //   minTime: '00:00',
      //   maxTime: '24:00'
      // });
    }
  }
  onDateChange(event) {
    const date: Moment = event.value || event;
    this.changeSelectedDate.emit(date.format('YYYY-MM-DD'));
    // this.fullCalendar.getApi().gotoDate(date.toDate());
    // this.fullCalendar.fullCalendar('gotoDate', date);
    setTimeout(() => {
      const calendar = this.fullCalendar.getApi();
      calendar.gotoDate(date.toDate());
      calendar.rerenderEvents();
      this.eventAfterAllRender(calendar.view);
      // this.fullCalendar.fullCalendar('rerenderEvents');
      this.refreshMatCalendar.emit({ start: calendar.view.currentStart, end: calendar.view.currentEnd });
    }, 10);
  }
  onMonthChange(date: Moment, picker: MatDatepicker<Moment>) {
    const calendar = this.fullCalendar.getApi();
    if (calendar.view.type === 'dayGridMonth') {
      picker.close();
      this.onDateChange(date);
    }
  }

  eventAfterAllRender(view: View) {
    const currentStart = moment(view.currentStart);
    const intervalStart = view.currentStart;
    const intervalEnd = view.currentEnd;
    const selectedDate = new Date(this.selectedDate);
    if (view.title !== this.currentTitle) {
      this.viewChanged.emit({
        start: moment(view.activeStart).format('YYYY-MM-DD'), end: moment(view.activeEnd).format('YYYY-MM-DD'),
        viewType: { type: view.type, startDay: 0 }
      });
      this.calendareViewList.forEach((calendarView) =>
        this.loadCalendarEvents.emit({ calendarId: calendarView.calendarId, groupId: calendarView.groupId }));
    }
    if (!this.isMobile) {
      this.group.writeValue(view.type);
    }
    if (view.type === 'dayGridMonth') {
      this.endSidenaveEnable.emit();

      if (intervalStart.valueOf() > selectedDate.valueOf() || intervalEnd.valueOf() <= selectedDate.valueOf()) {
        this.setSelectedDayColor(currentStart.format('YYYY-MM-DD'));
      } else {
        this.setSelectedDayColor(this.selectedDate);
      }
    } else {
      if ((intervalStart.valueOf() > selectedDate.valueOf() || intervalEnd.valueOf() <= selectedDate.valueOf())) {
        // this.changeCalendarDate.emit(view.intervalStart.format());
        this.changeSelectedDate.emit(currentStart.format('YYYY-MM-DD'));
        this.matDatepickerInput.value = currentStart.format('YYYY-MM-DD');
      }
      if (this.fullCalendar) {
        setTimeout(() => {
          const calendar = this.fullCalendar.getApi();
          const highlight = calendar.getEventById('fc-state-highlight');
          if (!(highlight && moment(highlight.start).format('YYYY-MM-DD') === this.selectedDate)) {
            if (highlight) {
              highlight.remove();
            }
            const event: any = {
              id: 'fc-state-highlight',
              title: undefined,
              start: this.selectedDate,
              rendering: 'background',
              allDay: true,
              className: 'fc-state-highlight'
            };
            calendar.addEvent(event);
          }
        }, 10);
      }
      this.endSidenaveDisable.emit();
    }
    this.changeCalendarTitle.emit(view.title);
    this.changeCalendarView.emit(view.type);
  }

  onEventAfterRender({ event, el, view }: { event: EventApi, el: HTMLElement, view: View }) {
    // { event, element }: { event: CalendarEvent < MsGraphBeta.Event >, element: JQuery<HTMLElement> }
    if (event.id !== 'fc-state-highlight') {
      if (this.currentView !== 'dayGridMonth') {
        let icons = '';
        if (event.extendedProps.data.hasAttachments) {
          icons = icons + `<i class="material-icons dps-calendar-event-icon">attach_file</i>`;
        }
        if (event.extendedProps.data.type === 'occurrence') {
          icons = icons + `<i class="material-icons dps-calendar-event-icon">sync</i>`;
        } else if (event.extendedProps.data.type === 'exception') {
          icons = icons + `<i class="material-icons dps-calendar-event-icon">sync_disabled</i>`;
        }
        if (event.extendedProps.data.sensitivity === 'private') {
          icons = icons + `<i class="material-icons dps-calendar-event-icon">lock</i>`;
        }
        if (event.extendedProps.hasDPSLinks) {
          icons = icons + `<img src="is-dps-mail.png" width="13px" height="13px">`;
        }
        let node: HTMLSpanElement = null;
        if (icons) {
          node = document.createElement('span');
          node.style.backgroundColor = event.backgroundColor;
          node.classList.add('dps-fc-icon');
          node.innerHTML = icons;
          if (event.allDay) {
            el.getElementsByClassName('fc-content')[0].appendChild(node);
          } else {
            const div = document.createElement('div');
            div.classList.add('dps-fc-bg');
            div.appendChild(node);
            el.appendChild(div);
          }
        }
        // if (node && event.allDay) {
        //   el.getElementsByClassName('fc-content')[0].appendChild(node);
        // } else if (node) {
        //   el.getElementsByClassName('fc-bg')[0].appendChild(node);
        // }

      }

      // el.addEventListener('click', () => {
      //   if (event.id !== 'fc-state-highlight') {
      //     if (this.touchtime === 0) {
      //       this.touchtime = new Date().getTime();
      //     } else {
      //       if (((new Date().getTime()) - this.touchtime) < 500) {
      //         this.onEventDblClick(event);
      //         this.touchtime = 0;
      //       } else {
      //         this.touchtime = new Date().getTime();
      //       }
      //     }

      //   }
      // });
      el.addEventListener('dblclick', () => {
        if (event.id !== 'fc-state-highlight') {
          this.onEventDblClick(event.extendedProps);
        }
      });
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.contextEvent = event.extendedProps;
        this.onEventContextMenu(e);
      });
      // $(el).addClass(event._id);
    }
  }

  onDateClick({ date, dateStr, jsEvent, view }: { date: Date, dateStr: string, jsEvent: MouseEvent, view: View }) {
    const _dateStr = dateStr.split('+')[0];
    if (this.slotMoment && jsEvent &&
      (jsEvent.timeStamp - this.slotMoment.timeStamp) < 500 && this.slotMoment.date && this.slotMoment.date === _dateStr) {
      this.slotMoment = null;
      this.onDayDblClick(_dateStr, view.type);
    } else {
      this.slotMoment = { timeStamp: jsEvent ? jsEvent.timeStamp : 0, date: _dateStr };
      this.onDayClick(date, _dateStr, view);
    }
  }

  onDayClick(date: Date, dateStr: string, view: View) {

    if (view.type === 'dayGridMonth') {
      // this.changeSelectedDate.emit(date.format('YYYY-MM-DD'));
      this.setSelectedDayColor(dateStr);
    } else if (view.type === 'timeGridDay' || view.type === 'timeGridFourDay' || view.type === 'timeGridWeek') {
      this.changeSelectedDate.emit(dateStr.split('T')[0]);
      const calendar = this.fullCalendar.getApi();
      const highlight = calendar.getEventById('fc-state-highlight');
      if (highlight) {
        highlight.remove();
      }
      // this.fullCalendar.fullCalendar('removeEvents', 'fc-state-highlight');
      let event = {};
      if (dateStr.indexOf('T') === -1) {
        event = {
          id: 'fc-state-highlight',
          title: undefined,
          start: dateStr,
          rendering: 'background',
          allDay: true,
          className: 'fc-state-highlight'
        };
      } else {
        const dateTime = date;
        dateTime.setMinutes(dateTime.getMinutes() + 30);
        event = {
          id: 'fc-state-highlight',
          title: undefined,
          start: dateStr,
          end: dateTime.toISOString(),
          rendering: 'background',
          className: 'fc-state-highlight'
        };

      }
      calendar.addEvent(event);
      // this.fullCalendar.fullCalendar('renderEvent', event);
    }
  }

  onDayDblClick(dateStr: string, view: string) {
    if (this.defaultCalendar && this.defaultCalendar.length > 0) {
      let isAllDay = true;
      let date = new Date(dateStr);
      let start = '';
      let end = '';
      if (dateStr.indexOf('T') >= 0) {
        isAllDay = false;
        date = new Date(dateStr + 'Z');
        start = date.toISOString();
      } else {
        date = new Date(dateStr + 'T00:00:00Z');
        if (view === 'dayGridMonth') {
          isAllDay = false;
        }
        date.setMinutes(date.getMinutes() + 480);
        start = date.toISOString();
      }
      date.setMinutes(date.getMinutes() + 30);
      end = date.toISOString();
      const event: MsGraphBeta.Event = {
        subject: '',
        body: { contentType: 'html', content: '<p></p>' },
        location: { displayName: '', locationType: 'default' },
        isAllDay: isAllDay,
        showAs: 'free',
        sensitivity: 'normal',
        calendar: this.defaultCalendar[0].data,
        type: 'singleInstance',
        start: { dateTime: start, timeZone: 'UTC' },
        end: { dateTime: end, timeZone: 'UTC' },
        attendees: [],
        attachments: [],
        reminderMinutesBeforeStart: 15,
        responseRequested: true
      };
      this.editEvent.emit(event);
      this.popupService.openCalendarEditEventPopup('DPS_ADD_EVENT', dateStr).subscribe((data) => {

      });
    }
  }

  setSelectedDayColor(date) {
    if (this.fullCalendar) {
      const calendar = this.fullCalendar.getApi();
      const highlight = calendar.getEventById('fc-state-highlight');
      if (highlight && highlight.allDay) {
        highlight.remove();
      }
      this.changeSelectedDate.emit(date);
      const elements = calendar.el.getElementsByClassName('fc-state-highlight');
      if (elements && elements.length > 0) {
        elements[0].classList.remove('fc-state-highlight');
      }
      const elment = calendar.el.querySelector(`td[data-date='${date}']`);
      if (elment) {
        elment.classList.add('fc-state-highlight');
      }
    }
    // $('.fc-state-highlight').removeClass('fc-state-highlight');
    // $().addClass('fc-state-highlight');
    this.matDatepickerInput.value = date;
  }

  onEventContextMenu(e: MouseEvent) {
    const element = document.getElementById('dps-event-context-menue');
    if (element) {
      element.style.top = e.pageY + 'px';
      element.style.left = e.pageX + 'px';
    }
    // const contextMenu = $('#dps-event-context-menue');
    // contextMenu.css({ top: e.pageY, left: e.pageX });
    setTimeout(() => {
      this.eventContextMenue.openMenu();
    }, 10);

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

