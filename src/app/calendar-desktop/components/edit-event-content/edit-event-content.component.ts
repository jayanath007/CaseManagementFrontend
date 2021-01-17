
import { distinctUntilChanged, debounceTime, startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter,
  ViewChild, AfterViewInit, OnChanges, SimpleChanges
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { CalendarItem, CustomeRecurrenceDialogInput } from '../../../calendar-core';
import { Attendee, FileAttachment, Attachment } from '../../../core/lib/microsoft-graph';
import { EventEditInfo, RepeatList, RepeatType, AttachmentWrapper } from '../../../calendar-core/models/interfaces';
import { UpdateDetailsKind } from '../../../calendar-core/models/enums';
import { MatInput, MatDialog, MatCheckboxChange, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { CustomeRecurrenceDialogComponent } from '../custome-recurrence-dialog/custome-recurrence-dialog.component';
import { TimezonePipe } from '../../../shared/pipes/timezone.pipe';
import { uuid } from '../../../utils/uuid';
import { Moment } from 'moment';
import { InforDialogData, InforDialogComponent, Address } from '../../../shared';
import { ENTER, COMMA, FF_SEMICOLON } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';



@Component({
  selector: 'dps-edit-event-content',
  templateUrl: './edit-event-content.component.html',
  styleUrls: ['./edit-event-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditEventContentComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() event: MsGraphBeta.Event;
  @Input() optionalAttendees: MsGraphBeta.Attendee[];
  @Input() requiredAttendees: MsGraphBeta.Attendee[];
  @Input() timeList: string[];
  @Input() dayOfWeekList: { lable: string, val: MsGraphBeta.DayOfWeek }[];
  @Input() freeBusyStatusList: { lable: string, val: MsGraphBeta.FreeBusyStatus }[];
  @Input() reminderList: { lable: string, val: number }[];
  @Input() weekIndexList: MsGraphBeta.WeekIndex[];
  @Input() monthList: { val: number, label: string, maxDay: number }[];
  @Input() repeatList: RepeatList[];
  @Input() canEditCalendars: CalendarItem<Readonly<MsGraphBeta.Calendar>>[];
  @Input() timeZone: string;
  @Input() attachments: AttachmentWrapper[];
  @Input() repeatTypeList: RepeatType[];
  @Input() isDirty: boolean;
  @Input() lastInlineAttachment: AttachmentWrapper;
  @Input() rooms: MsGraphBeta.EmailAddress[];


  @Output() AddAttendee = new EventEmitter<Attendee>();
  @Output() removeAttendee = new EventEmitter<Attendee>();
  @Output() updateEventData = new EventEmitter<EventEditInfo>();
  @Output() addAttachment = new EventEmitter<{ attachment: FileAttachment, uid: string, type: string, event: MsGraphBeta.Event }>();
  @Output() deleteAttachment = new EventEmitter<{ event: MsGraphBeta.Event, attachmentId: string }>();
  @Output() openAttachement = new EventEmitter<{ itemId: string, attachement: Attachment, urlCache: any }>();
  @Output() downloardFileAttachment = new EventEmitter<{ itemId: string, attachment: Attachment, type }>();
  @Output() openSeriers = new EventEmitter();
  @Output() openMatter = new EventEmitter();

  @ViewChild('startTimeInput') startTimeInput: MatInput;

  Object = Object;

  onBodyChange = new Subject<string>();
  startDate = '';
  startTime = '';
  startPeriod = '';
  endDate = '';
  endTime = '';
  endPeriod = '';
  isPastEvent = false;
  fromDate;
  toDate;
  isConvertStartDate = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, FF_SEMICOLON];

  filteredRooms: Observable<MsGraphBeta.EmailAddress[]>;
  roomsControl = new FormControl();

  constructor(public datePipe: DatePipe, private timezonePipe: TimezonePipe, private dialog: MatDialog) { }

  ngOnInit() {
    if (this.event) {
      this.setEventData();
    }
    this.filteredRooms = this.roomsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          if (value && typeof value === 'string') {
            const filterValue = value.toLowerCase();
            return this.rooms.filter(room =>
              room.name.toLowerCase().includes(filterValue) || room.address.toLowerCase().includes(filterValue)
            );
          }
          return this.rooms;
        })
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.event) {
      if (this.event.type === 'seriesMaster' && this.event.recurrence.range.type === 'endDate') {
        this.isPastEvent = new Date(this.event.recurrence.range.endDate).valueOf() <
          new Date(this.timezonePipe.transform(new Date().toISOString(), this.timeZone) + 'Z').valueOf();
      } else if (this.event.type !== 'seriesMaster') {
        this.isPastEvent = new Date(this.event.end.dateTime).valueOf() <
          new Date(this.timezonePipe.transform(new Date().toISOString(), this.timeZone) + 'Z').valueOf();
      }
      this.setEventData();
    }
    if (changes.rooms) {
      this.roomsControl.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    }
  }

  private setEventData() {
    this.startDate = this.event.start.dateTime.split('T')[0];
    this.startTime = this.datePipe.transform(this.event.start.dateTime, 'h:mm', 'UTC');
    this.startPeriod = this.datePipe.transform(this.event.start.dateTime, 'a', 'UTC');
    this.endDate = this.event.end.dateTime.split('T')[0];
    this.endTime = this.datePipe.transform(this.event.end.dateTime, 'h:mm', 'UTC');
    this.endPeriod = this.datePipe.transform(this.event.end.dateTime, 'a', 'UTC');
    this.fromDate = this.event.recurrence ? this.event.recurrence.range.startDate : new Date(this.event.start.dateTime);
    this.toDate = this.event.recurrence ? this.event.recurrence.range.endDate : new Date(this.event.end.dateTime);
  }

  ngAfterViewInit() {
    const observable = this.onBodyChange.pipe(
      debounceTime(2000),
      distinctUntilChanged())
      .subscribe((event) => {
        this.updateEventData.emit({ kind: UpdateDetailsKind.Body, info: event });
      });
  }

  get selectedRepeatItem(): RepeatList {
    if (this.repeatList) {
      return this.repeatList.find((action) => action.selected);
    }
    return null;
  }

  onAddAttendee(item: Attendee) {
    this.AddAttendee.emit(item);
  }

  onRemoveAttendee(item: Attendee) {
    this.removeAttendee.emit(item);
  }

  onUpdateTitle(title) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.Title, info: title });
  }

  onUpdateLocation(location: MsGraphBeta.Location, index?: number) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.Location, info: { location, index } });
  }
  onRemoveLocation(location, i) {
    this.onUpdateLocation(location, i);
  }
  onAddLocation(event: MatChipInputEvent) {
    if (event.value) {
      this.onUpdateLocation({ displayName: event.value, locationType: 'default', uniqueId: event.value, uniqueIdType: 'private' });
    }
    event.input.value = '';
  }
  onAddRoomLocation(event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    if (event) {
      this.onUpdateLocation({
        displayName: event.option.value.name,
        locationEmailAddress: event.option.value.address,
        locationUri: event.option.value.address,
        locationType: 'conferenceRoom',
        uniqueId: event.option.value.address,
        uniqueIdType: 'directory',
      });
      input.value = '';
    }
  }
  roomDisply(value: MsGraphBeta.EmailAddress) {
    return value ? value.name : '';
  }
  onAddGeoLocation(event: Address, input: HTMLInputElement) {
    if (event) {
      this.onUpdateLocation({
        displayName: event.name,
        locationUri: event.url,
        locationType: 'default',
        uniqueId: event.id,
        uniqueIdType: 'private',
        address: {
          type: 'unknown',
          street: event.address1,
          city: event.town,
          state: event.state,
          countryOrRegion: event.country,
          postalCode: event.postCode
        },
        coordinates: event.coordinates
      });
      input.value = '';
    }
  }

  onChangeStartDate(newStartDate: Moment) {
    this.startDate = newStartDate.format();
    this.onUpdateStart();
  }

  onChangeEndDate(newEndDate: Moment) {
    this.endDate = newEndDate.format();
    this.onUpdateEnd();
  }

  onChangeStartTime(newStartTime: string) {
    newStartTime = newStartTime.startsWith(':') ? '00' + newStartTime : newStartTime.endsWith(':') ? newStartTime + '00' : newStartTime;
    const re = new RegExp('^(2[0-1]|[01]?[0-9]):([0-5]|[0-5]{1}[0-9])$');
    if (re.test(newStartTime)) {
      this.startTime = newStartTime;
      this.onUpdateStart();
    }
  }

  onChangeEndTime(newEndTime) {
    newEndTime = newEndTime.startsWith(':') ? '00' + newEndTime : newEndTime.endsWith(':') ? newEndTime + '00' : newEndTime;
    const re = new RegExp('^(2[0-1]|[01]?[0-9]):([0-5]|[0-5]{1}[0-9])$');
    if (re.test(newEndTime)) {
      this.endTime = newEndTime;
      this.onUpdateEnd();
    }

  }

  onStartTimePeriodChange(newPeriod) {
    this.startPeriod = newPeriod;
    this.onUpdateStart();
  }

  onEndTimePeriodChange(newPeriod) {
    this.endPeriod = newPeriod;
    this.onUpdateEnd();
  }

  onUpdateStart() {
    let startDetails = this.startDate.split('T')[0];
    let hours = parseInt(this.startTime.split(':')[0], 0);
    const minute = parseInt(this.startTime.split(':')[1], 0);
    if (this.startPeriod === 'PM' && hours !== 12) {
      hours = hours + 12;
    } else if (this.startPeriod === 'AM' && hours === 12) {
      hours = 0;
    }
    startDetails = startDetails + 'T' + (hours > 9 ? '' : '0') + hours + ':' + (minute > 9 ? '' : '0') + minute + ':00.000Z';
    this.updateEventData.emit({ kind: UpdateDetailsKind.Start, info: startDetails });
    if (this.event.recurrence) {
      this.updateEventData.emit({ kind: UpdateDetailsKind.From, info: startDetails });
    }
  }

  onUpdateEnd() {
    let endDetails = this.endDate.split('T')[0];
    let hours = parseInt(this.endTime.split(':')[0], 0);
    const minute = parseInt(this.endTime.split(':')[1], 0);
    if (this.endPeriod === 'PM' && hours !== 12) {
      hours = hours + 12;
    } else if (this.endPeriod === 'AM' && hours === 12) {
      hours = 0;
    }
    endDetails = endDetails + 'T' + (hours > 9 ? '' : '0') + hours + ':' + (minute > 9 ? '' : '0') + minute + ':00.000Z';
    this.updateEventData.emit({ kind: UpdateDetailsKind.End, info: endDetails });
  }

  changeAllDay(isAllDay: boolean) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.IsAllDay, info: isAllDay });
  }

  changePrivate(isPrivate: boolean) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.IsPrivate, info: isPrivate });
  }

  onRepeatChange(item: RepeatList) {
    if (item.val !== 'other') {
      this.updateEventData.emit({ kind: UpdateDetailsKind.Repeat, info: item.val !== 'never' ? item.recurrence : null });
    } else {
      const dialogData: CustomeRecurrenceDialogInput = {
        recurrence: this.event.recurrence ? this.event.recurrence.pattern : null,
        dayOfWeekList: this.dayOfWeekList,
        weekIndexList: this.weekIndexList,
        monthList: this.monthList,
        repeatTypeList: this.repeatTypeList,
        repeatList: this.repeatList
      };

      const dialogRef = this.dialog.open(CustomeRecurrenceDialogComponent, {
        data: dialogData,
        width: '500px',
        height: '252px',
        panelClass: 'dps-organizer-dialog'
      });

      dialogRef.afterClosed().subscribe((result: MsGraphBeta.RecurrencePattern) => {
        if (result) {
          this.updateEventData.emit({ kind: UpdateDetailsKind.Repeat, info: result });
        } else if (this.event.recurrence) {
          this.updateEventData.emit({ kind: UpdateDetailsKind.Repeat, info: this.event.recurrence.pattern });
        } else {
          this.updateEventData.emit({ kind: UpdateDetailsKind.Repeat, info: null });
        }
      });
    }
  }

  onSaveToCalendarChange(calendar: MsGraphBeta.Calendar) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.SaveToCalendar, info: calendar });
  }

  onChangeFromDate(date: Moment) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.From, info: this.datePipe.transform(date, 'yyyy-MM-dd') });
  }

  onChangeToDate(date?: Moment) {
    if (date) {
      this.updateEventData.emit({ kind: UpdateDetailsKind.To, info: this.datePipe.transform(date, 'yyyy-MM-dd') });
    } else {
      this.updateEventData.emit({ kind: UpdateDetailsKind.To, info: null });
    }
  }

  onReminderChange(reminder: { lable: string, val: number }) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.Reminder, info: reminder });
  }

  onShowAsChange(showAs: MsGraphBeta.FreeBusyStatus) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.ShowAs, info: showAs });
  }
  onOpenSeries() {
    this.openSeriers.emit();
  }

  onFileAttachement(files: File[]) {
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      totalSize = totalSize + files[i].size;
    }
    if (this.validateTotleSizeOfUploadingAttachments(totalSize)) {
      for (let i = 0; i < files.length; i++) {
        const reader: FileReader = new FileReader();
        let attachment: FileAttachment;
        reader.onload = (evt) => {
          const parts = (<any>reader.result).split(',');
          const base64Str = parts[1];
          attachment = {
            name: files[i].name,
            contentBytes: base64Str,
            size: files[i].size,
            contentType: files[i].type,
            isInline: false
          };
        };
        reader.readAsDataURL(files[i]);
        reader.onloadend = (evt) => {
          attachment['@odata.type'] = '#microsoft.graph.fileAttachment';
          this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'fileAttachment', event: this.event });
        };
      }
    }
  }
  validateTotleSizeOfUploadingAttachments(size: number) {
    const totalSize = this.attachments.map(val => val.attachment.size).reduce((total, val) => total + val, 0);
    if (totalSize + size > 34000000) {
      const limit = Math.round(((34000000 - totalSize) / 100000)) / 10;
      const dialogData: InforDialogData = {
        content: {
          title: `Attachments`,
          message: `The total size of attachments that can be attached is 34 MB. Please try attaching less than ${limit} MB item(s).`
        },
        data: { messageType: 'alert' },
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });
      return false;
    }
    return true;
  }

  onDeleteAttachment(attachment: Attachment) {
    this.deleteAttachment.emit({ event: this.event, attachmentId: attachment.id });
  }

  onDownloardFileAttachment({ attachment, type }) {
    this.downloardFileAttachment.emit({ itemId: this.event.id, attachment: attachment, type });
  }

  onOpenAttachement(attachment: Attachment) {
    this.openAttachement.emit({ itemId: this.event.id, attachement: attachment, urlCache: null });
  }

  changeRequestResponses(value: boolean) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.RequestResponses, info: value });
  }

  onInlineAttachemnt(event) {
    const parts = event.base64.split(',');
    const base64Str = parts[1];
    // const uid = uuid();
    const attachment: FileAttachment = {
      name: event.file.name,
      contentBytes: base64Str,
      size: event.file.size,
      contentType: event.file.type,
      contentId: event.contentId,
      isInline: true
    };
    attachment['@odata.type'] = '#microsoft.graph.fileAttachment';
    this.addAttachment.emit({ attachment: attachment, uid: event.elementId, type: 'fileAttachment', event: this.event });
  }
  onOpenMatter(event) {
    this.openMatter.emit(event);
  }

  onClickTeamsAppointment(event: MatCheckboxChange) {
    this.updateEventData.emit({ kind: UpdateDetailsKind.OnlineMeeting, info: event.checked });
  }

}
