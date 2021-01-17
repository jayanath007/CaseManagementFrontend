import { Action } from '@ngrx/store';
import { CalendarItem } from '..';
import { Calendar, Event, Attachment, Message } from '../../core/lib/microsoft-graph';
import { CalendarItemWrapper, CalendarEvent, CalendarEventWrapper } from '../models/interfaces';
import { ReplyForwardType } from '../../mail-item-core';

export const SET_CALENDAR_VIEW = 'DPS_SET_CALENDAR_VIEW';

export const LOAD_CALENDAR_EVENTS = 'DPS_LOAD_CALENDAR_EVENT';
export const LOAD_CALENDAR_EVENT_SUCCESS = 'DPS_LOAD_CALENDAR_EVENT_SUCCESS';
export const LOAD_CALENDAR_EVENT_FAIL = 'DPS_LOAD_CALENDAR_EVENT_FAIL';
export const CALENDAR_EVENTS_ALREADY_LOADED = 'DPS_CALENDAR_EVENTS_ALREADY_LOADED';
export const LOAD_CALENDAR_EVENTS_ON_VIEW_CHANGE = 'DPS_LOAD_CALENDAR_EVENTS_ON_VIEW_CHANGE';

export const LOAD_SINGLE_CALENDAR_EVENT = 'DPS_LOAD_SINGLE_CALENDAR_EVENT';
export const LOAD_SINGLE_CALENDAR_EVENT_SUCCESS = 'DPS_LOAD_SINGLE_CALENDAR_EVENT_SUCCESS';
export const LOAD_SINGLE_CALENDAR_EVENT_FAIL = 'DPS_LOAD_SINGLE_CALENDAR_EVENT_FAIL ';

export const CLOSE_CALENDAR = 'DPS_CLOSE_CALENDAR';
export const RELOAD_CALENDAR = 'DPS_RELOAD_CALENDAR';
// export const CLOSE_CALENDAR = 'DPS_CLOSE_CALENDAR';

export const UPDATE_CALENDAR_EVENT = 'DPS_UPDATE_CALENDAR_EVENT';
export const UPDATE_CALENDAR_EVENT_SUCCESS = 'DPS_UPDATE_CALENDAR_EVENT_SUCCESS';
export const UPDATE_CALENDAR_EVENT_FAIL = 'DPS_UPDATE_CALENDAR_EVENT_FAIL';

export const RESPONSE_CALENDAR_EVENT = 'DPS_RESPONSE_CALENDAR_EVENT';
export const RESPONSE_CALENDAR_EVENT_SUCCESS = 'DPS_RESPONSE_CALENDAR_EVENT_SUCCESS';
export const RESPONSE_CALENDAR_EVENT_FAIL = 'DPS_RESPONSE_CALENDAR_EVENT_FAIL';

export const REMOVE_CALENDAR_EVENT = 'DPS_REMOVE_CALENDAR_EVENT';
export const REMOVE_CALENDAR_EVENT_SUCCESS = 'DPS_REMOVE_CALENDAR_EVENT_SUCCESS';
export const REMOVE_CALENDAR_EVENT_FAIL = 'DPS_REMOVE_CALENDAR_EVENT_FAIL';

export const CHANGE_SELECTED_DATE = 'DPS_CHANGE_SELECTED_DATE';
export const EDIT_CALENDAR = 'DPS_EDIT_CALENDAR';

export const DOWNLOAD_ATTACHMENT = 'DPS_DOWNLOAD_ATTACHMENT_IN_EVENT';
export const DOWNLOAD_ATTACHMENT_SUCCESS = 'DPS_DOWNLOAD_ATTACHMENT_IN_EVENT_SUCCESS';
export const DOWNLOAD_ATTACHMENT_FAIL = 'DPS_DOWNLOAD_ATTACHMENT_IN_EVENT_FAIL';

export const CREATE_REPLY_FORWARD = 'DPS_CREATE_REPLY_FORWARD_IN_EVENT';
export const CREATE_REPLY_FORWARD_SUCCESS = 'DPS_CREATE_REPLY_FORWARD_IN_EVENT_SUCCESS';
export const CREATE_REPLY_FORWARD_FAIL = 'DPS_CREATE_REPLY_FORWARD_IN_EVENT_FAIL';

export const LOAD_SEARIES_DATA = 'DPS_LOAD_SEARIES_DATA';
export const LOAD_SEARIES_DATA_SUCCESS = 'DPS_LOAD_SEARIES_DATA_SUCCESS';
export const LOAD_SEARIES_DATA_FAIL = 'LOAD_SEARIES_DATA_FAIL';

export class SetCalendarView implements Action {
  readonly type = SET_CALENDAR_VIEW;
  constructor(public payload: { startDate: string, endDate: string, viewType: { type: string, startDay: number } }) { }
}

export class LoadCalendarEvents implements Action {
  readonly type = LOAD_CALENDAR_EVENTS;
  constructor(public payload: { calendar: Readonly<CalendarItem<Readonly<Calendar>>> }) { }
}

export class LoadCalendarEventsOnViewChange implements Action {
  readonly type = LOAD_CALENDAR_EVENTS_ON_VIEW_CHANGE;
  constructor(public payload: { calendarId: string, groupId: string }) { }
}

export class LoadSingleCalendarEvent implements Action {
  readonly type = LOAD_SINGLE_CALENDAR_EVENT;
  constructor(public payload: { calendarId: string, eventId: string }) { }
}
export class LoadSingleCalendarEventsSuccess implements Action {
  readonly type = LOAD_SINGLE_CALENDAR_EVENT_SUCCESS;
  constructor(public payload: { calendarId: string, event: Event, calendar: Readonly<CalendarItemWrapper> }) { }
}
export class LoadSingleCalendarEventsFail implements Action {
  readonly type = LOAD_SINGLE_CALENDAR_EVENT_FAIL;
  constructor(public payload: { calendarId: string, eventId: string }) { }
}


export class LoadCalendarEventSuccess implements Action {
  readonly type = LOAD_CALENDAR_EVENT_SUCCESS;
  constructor(public payload: {
    calendar: CalendarItemWrapper,
    dateRange: { startDate: string, endDate: string },
    viewType: { type: string, startDay: number },
    events: Event[]
  }) { }
}

export class LoadCalendarEventFail implements Action {
  readonly type = LOAD_CALENDAR_EVENT_FAIL;
  constructor(public payload: {
    calendar: CalendarItemWrapper,
    dateRange: { startDate: string, endDate: string },
    viewType: { type: string, startDay: number }
  }) { }
}

export class CalendarEventsAlreadyLoaded implements Action {
  readonly type = CALENDAR_EVENTS_ALREADY_LOADED;
  constructor(public payload: { calendarId: string }) { }
}

export class CloseCalendar implements Action {
  readonly type = CLOSE_CALENDAR;
  constructor(public payload: { calendarId: string, groupId: string }) { }
}
export class ReloadCalendar implements Action {
  readonly type = RELOAD_CALENDAR;
  constructor(public payload: { calendarId: string, groupId: string }) { }
}

export class RemoveCalendarEvent implements Action {
  readonly type = REMOVE_CALENDAR_EVENT;
  constructor(public payload: { calendarId: string, eventId: string, isSeries: boolean }) { }
}

export class RemoveCalendarEventSuccess implements Action {
  readonly type = REMOVE_CALENDAR_EVENT_SUCCESS;
  constructor(public payload: { calendarId: string, eventId: string, isSeries: boolean }) { }
}

export class RemoveCalendarEventFail implements Action {
  readonly type = REMOVE_CALENDAR_EVENT_FAIL;
  constructor(public payload: { error: any, calendarId: string, eventId: string }) { }
}
export class ChangeSelectedDate implements Action {
  readonly type = CHANGE_SELECTED_DATE;
  constructor(public payload: { date: string }) { }
}

export class EditCalendar implements Action {
  readonly type = EDIT_CALENDAR;
  constructor(public payload: { calendar: CalendarItemWrapper }) { }
}

export class UpdateCalendarEvent implements Action {
  readonly type = UPDATE_CALENDAR_EVENT;
  constructor(public payload: { calendarId: string, eventId: string, event: Event, isSeries: boolean }) { }
}
export class UpdateCalendarEventSuccsess implements Action {
  readonly type = UPDATE_CALENDAR_EVENT_SUCCESS;
  constructor(public payload: { eventId: string, event: Event }) { }
}
export class UpdateCalendarEventFail implements Action {
  readonly type = UPDATE_CALENDAR_EVENT_FAIL;
  constructor(public payload: { eventId: string, event: Event }) { }
}

export class ResponseCalendarEvent implements Action {
  readonly type = RESPONSE_CALENDAR_EVENT;
  constructor(public payload: {
    event: CalendarEventWrapper, comment: string, sendResponse: boolean, type: string, isSeries: boolean
  }) { }
}
export class ResponseCalendarEventSuccsess implements Action {
  readonly type = RESPONSE_CALENDAR_EVENT_SUCCESS;
  constructor(public payload: { eventId: string, calendarId: string, }) { }
}
export class ResponseCalendarEventFail implements Action {
  readonly type = RESPONSE_CALENDAR_EVENT_FAIL;
  constructor(public payload: { error: any, eventId: string, calendarId: string, }) { }
}

export class DownloadAttachment implements Action {
  readonly type = DOWNLOAD_ATTACHMENT;
  constructor(public payload: { itemId: string, attachment: Attachment, type: string }) { }
}
export class DownloadAttachmentSuccess implements Action {
  readonly type = DOWNLOAD_ATTACHMENT_SUCCESS;
  constructor(public payload: { ids: { itemId: string, attachmentId: string }, data: Attachment }) { }
}
export class DownloadAttachmentFail implements Action {
  readonly type = DOWNLOAD_ATTACHMENT_FAIL;
  constructor(public payload: { error: string, ids: { itemId: string, attachmentId: string } }) { }
}

export class CreateReplyForward implements Action {
  readonly type = CREATE_REPLY_FORWARD;
  constructor(public payload: {
    event: CalendarEventWrapper, comment?: string, message?: Message, type: ReplyForwardType, isSeries?: boolean
  }) { }
}
export class CreateReplyForwardSuccess implements Action {
  readonly type = CREATE_REPLY_FORWARD_SUCCESS;
  constructor(public payload: { newItem: Message, refItem: CalendarEventWrapper }) { }
}

export class CreateReplyForwardFail implements Action {
  readonly type = CREATE_REPLY_FORWARD_FAIL;
  constructor(public payload: { error: string, event?: CalendarEventWrapper }) { }
}

export class LoadSeariesData implements Action {
  readonly type = LOAD_SEARIES_DATA;
  constructor(public payload: { event: CalendarEventWrapper }) { }
}

export class LoadSeariesDataSuccess implements Action {
  readonly type = LOAD_SEARIES_DATA_SUCCESS;
  constructor(public payload: { seriesEventData: any, calendar: Calendar }) { }
}

export class LoadSeariesDataFail implements Action {
  readonly type = LOAD_SEARIES_DATA_FAIL;
  constructor() { }
}

export type Any = SetCalendarView
  | LoadCalendarEvents | LoadCalendarEventSuccess | LoadCalendarEventFail
  | CalendarEventsAlreadyLoaded
  | LoadSingleCalendarEvent | LoadSingleCalendarEventsSuccess | LoadSingleCalendarEventsFail
  | CloseCalendar | EditCalendar
  | UpdateCalendarEvent | UpdateCalendarEventSuccsess | UpdateCalendarEventFail
  | RemoveCalendarEvent | RemoveCalendarEventSuccess | RemoveCalendarEventFail | ChangeSelectedDate
  | LoadSeariesData | LoadSeariesDataSuccess | LoadSeariesDataFail;
