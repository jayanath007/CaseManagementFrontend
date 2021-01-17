import { Action } from '@ngrx/store';
import * as MsGraphBeta from '../../core/lib/microsoft-graph';

export const ADD_EVENT = 'DPS_ADD_EVENT';
export const CHANGE_EVENT_TITLE = 'DPS_CHANGE_EVENT_TITLE';
export const CHANGE_EVENT_BODY = 'DPS_CHANGE_EVENT_BODY';
export const CHANGE_EVENT_LOCATION = 'DPS_CHANGE_EVENT_LOCATION';
export const CHANGE_EVENT_START = 'DPS_CHANGE_EVENT_START';
export const CHANGE_EVENT_END = 'DPS_CHANGE_EVENT_END';
export const CHANGE_EVENT_ISALLDAY = 'DPS_CHANGE_EVENT_ISALLDAY';
export const CHANGE_EVENT_ISPRIVATE = 'DPS_CHANGE_EVENT_ISPRIVATE';
export const CHANGE_EVENT_REMINDER = 'DPS_CHANGE_EVENT_REMINDER';
export const CHANGE_EVENT_REPEAT_RANGE_START = 'DPS_CHANGE_EVENT_REPEAT_RANGE_START';
export const CHANGE_EVENT_REPEAT_RANGE_END = 'DPS_CHANGE_EVENT_REPEAT_RANGE_END';
export const CHANGE_EVENT_REPEAT_PATTERN = 'DPS_CHANGE_EVENT_REPEAT_PATTERN';
export const CHANGE_EVENT_SAVE_TO_CALANDER = 'DPS_CHANGE_EVENT_SAVE_TO_CALANDER';
export const CHANGE_EVENT_SHOWAS = 'DPS_CHANGE_EVENT_SHOWAS';
export const CHANGE_EVENT_ADD_ATTENDEE = 'DPS_CHANGE_EVENT_ADD_ATTENDEE';
export const CHANGE_EVENT_REMOVE_ATTENDEE = 'DPS_CHANGE_EVENT_REMOVE_ATTENDEE';
export const CHANGE_EVENT_REQUEST_RESPONSES = 'DPS_CHANGE_EVENT_REQUEST_RESPONSES';

export const SEND_CALANDER_EVENT = 'DPS_SEND_CALANDER_EVENT';
export const SEND_CALANDER_EVENT_SUCCESS = 'DPS_SEND_CALANDER_EVENT_SUCCESS';
export const SEND_CALANDER_EVENT_FAIL = 'DPS_SEND_CALANDER_EVENT_FAIL';
export const SENDING_CALANDER_EVENT = 'DPS_SENDING_CALANDER_EVENT';

export const DELETE_CALANDER_EVENT = 'DPS_DELETE_CALANDER_EVENT';
export const DELETE_CALANDER_EVENT_SUCCESS = 'DPS_DELETE_CALANDER_EVENT_SUCCESS';
export const DELETE_CALANDER_EVENT_FAIL = 'DPS_DELETE_CALANDER_EVENT_FAIL';
export const DELETING_CALANDER_EVENT = 'DPS_DELETING_CALANDER_EVENT';

export const UPDATE_CALANDER_EVENT_DETAILS = 'UPDATE_CALANDER_EVENT_DETAILS';

export const ADD_ATTACHMENT = 'DPS_ADD_ATTACHMENT_TO_EVENT';
export const UPLOAD_ATTACHMENT = 'DPS_UPLOAD_ATTACHMENT_TO_EVENT';
export const UPLOAD_ATTACHMENT_SUCCESS = 'DPS_UPLOAD_ATTACHMENT_TO_EVENT_SUCCESS';
export const UPLOAD_ATTACHMENT_FAIL = 'DPS_UPLOAD_ATTACHMENT_TO_EVENT_FAIL';
export const DELETE_ATTACHMENT = 'DPS_DELETE_ATTACHMENT_FROM_EVENT';
export const DELETE_ATTACHMENT_SUCCESS = 'DPS_DELETE_CALANDER_ATTACHMENT_IN_EVENT_SUCCESS';
export const DELETE_ATTACHMENT_FAIL = 'DPS_DELETE_CALANDER_ATTACHMENT_IN_EVENT_FAIL';
export const OPEN_ATTACHEMENT = 'DPS_OPEN_EVENT_ATTACHEMENT';
export const DOWNLOAD_ATTACHMENT = 'DPS_DOWNLOAD_ATTACHMENT_IN_EVENT_EDIT';
export const DOWNLOAD_ATTACHMENT_SUCCESS = 'DPS_DOWNLOAD_ATTACHMENT_IN_EVENT_EDIT_SUCCESS';
export const DOWNLOAD_ATTACHMENT_FAIL = 'DPS_DOWNLOAD_ATTACHMENT_IN_EVENT_EDIT_FAIL';

export const RESPONSE_CALENDAR_EVENT = 'DPS_RESPONSE_CALENDAR_EVENT_EDIT';
export const RESPONSE_CALENDAR_EVENT_SUCCESS = 'DPS_RESPONSE_CALENDAR_EVENT_EDIT_SUCCESS';
export const RESPONSE_CALENDAR_EVENT_FAIL = 'DPS_RESPONSE_CALENDAR_EVENT_EDIT_FAIL';
export const ITEM_CREATING = 'DPS_CLANENDAR_ITEM_CREATING';

export const CLOSE_POPUP = 'DPS_EVENT_EDIT_POPUP_CLOSE';

export const CHANGE_ONLINE_MEETING = 'DPS_EVENT_CHANGE_ONLINE_MEETING';

export const GET_ROOMS = 'DPS_CALENDAR_GET_ROOMS';
export const GET_ROOMS_SUCCESS = 'DPS_CALENDAR_GET_ROOMS_SUCCESS';
export const GET_ROOMS_FAIL = 'DPS_CALENDAR_GET_ROOMS_FAIL';

export class AddEvent implements Action {
    readonly type = ADD_EVENT;
    constructor(public payload: { event: MsGraphBeta.Event }) {
    }
}

export class ChangeEventTitle implements Action {
    readonly type = CHANGE_EVENT_TITLE;
    constructor(public payload: { title: string }) {
    }
}

export class ChangeEventBody implements Action {
    readonly type = CHANGE_EVENT_BODY;
    constructor(public payload: { body: string }) {
    }
}

export class ChangeEventLocation implements Action {
    readonly type = CHANGE_EVENT_LOCATION;
    constructor(public payload: { location: MsGraphBeta.Location, index?: number }) {
    }
}

export class ChangeEventStart implements Action {
    readonly type = CHANGE_EVENT_START;
    constructor(public payload: { start: string }) {
    }
}

export class ChangeEventEnd implements Action {
    readonly type = CHANGE_EVENT_END;
    constructor(public payload: { end: string }) {
    }
}

export class ChangeEventIsAllDay implements Action {
    readonly type = CHANGE_EVENT_ISALLDAY;
    constructor(public payload: { isAllDay: boolean }) {
    }
}

export class ChangeEventIsPrivate implements Action {
    readonly type = CHANGE_EVENT_ISPRIVATE;
    constructor(public payload: { isPrivate: boolean }) {
    }
}

export class ChangeEventReMinder implements Action {
    readonly type = CHANGE_EVENT_REMINDER;
    constructor(public payload: { reminderMinutesBeforeStart?: number }) {
    }
}

export class ChangeEventRepeatRangeStart implements Action {
    readonly type = CHANGE_EVENT_REPEAT_RANGE_START;
    constructor(public payload: { start: string }) {
    }
}

export class ChangeEventRepeatRangeEnd implements Action {
    readonly type = CHANGE_EVENT_REPEAT_RANGE_END;
    constructor(public payload: { end: string }) {
    }
}

export class ChangeEventRepeatPattern implements Action {
    readonly type = CHANGE_EVENT_REPEAT_PATTERN;
    constructor(public payload: { recurrencePattern: MsGraphBeta.RecurrencePattern }) {
    }
}

export class ChangeEventShowAs implements Action {
    readonly type = CHANGE_EVENT_SHOWAS;
    constructor(public payload: { showAs: string }) {
    }
}

export class ChangeEventSaveToCalender implements Action {
    readonly type = CHANGE_EVENT_SAVE_TO_CALANDER;
    constructor(public payload: { calendar: MsGraphBeta.Calendar }) {
    }
}

export class ChangeEventAddAttendee implements Action {
    readonly type = CHANGE_EVENT_ADD_ATTENDEE;
    constructor(public payload: { attendee: MsGraphBeta.Attendee }) {
    }
}

export class ChangeEventRemoveAttendee implements Action {
    readonly type = CHANGE_EVENT_REMOVE_ATTENDEE;
    constructor(public payload: { attendee: MsGraphBeta.Attendee }) {
    }
}

export class ChangeEventRequestresponses implements Action {
    readonly type = CHANGE_EVENT_REQUEST_RESPONSES;
    constructor(public payload: { responseRequested: boolean }) {
    }
}

export class SendCalanderEvent implements Action {
    readonly type = SEND_CALANDER_EVENT;
    constructor(public payload: { event?: MsGraphBeta.Event }) {
    }
}

export class SendCalanderEventSuccess implements Action {
    readonly type = SEND_CALANDER_EVENT_SUCCESS;
    constructor(public payload: { event?: MsGraphBeta.Event, newEvent: MsGraphBeta.Event }) {
    }
}

export class SendCalanderEventFail implements Action {
    readonly type = SEND_CALANDER_EVENT_FAIL;
    constructor(public payload: { event?: MsGraphBeta.Event }) {
    }
}

export class SendingCalanderEvent implements Action {
    readonly type = SENDING_CALANDER_EVENT;
    constructor() {
    }
}

export class DeleteCalanderEvent implements Action {
    readonly type = DELETE_CALANDER_EVENT;
    constructor(public payload: { event?: MsGraphBeta.Event }) {
    }
}

export class DeleteCalanderEventSuccess implements Action {
    readonly type = DELETE_CALANDER_EVENT_SUCCESS;
    constructor(public payload: { event?: MsGraphBeta.Event }) {
    }
}

export class DeleteCalanderEventFail implements Action {
    readonly type = DELETE_CALANDER_EVENT_FAIL;
    constructor(public payload: { event?: MsGraphBeta.Event }) {
    }
}

export class DeletingCalanderEvent implements Action {
    readonly type = DELETING_CALANDER_EVENT;
    constructor() {
    }
}

export class AddAttachment implements Action {
    readonly type = ADD_ATTACHMENT;
    constructor(public payload: { attachment: MsGraphBeta.FileAttachment, uid: string, type: string, event: MsGraphBeta.Event }) {
    }
}

export class UploadAttachment implements Action {
    readonly type = UPLOAD_ATTACHMENT;
    constructor(public payload: { event: MsGraphBeta.Event, attachment: MsGraphBeta.FileAttachment, uid: string, type: string }) {
    }
}

export class UploadAttachmentSuccess implements Action {
    readonly type = UPLOAD_ATTACHMENT_SUCCESS;
    constructor(public payload: { attachment: MsGraphBeta.FileAttachment, uid: string }) {
    }
}

export class UploadAttachmentFail implements Action {
    readonly type = UPLOAD_ATTACHMENT_FAIL;
    constructor(public payload: { event: MsGraphBeta.Event, attachment: MsGraphBeta.FileAttachment, uid: string }) {
    }
}

export class DeleteAttachment implements Action {
    readonly type = DELETE_ATTACHMENT;
    constructor(public payload: { event: MsGraphBeta.Event, attachmentId: string }) {
    }
}

export class DeleteAttachmentSuccess implements Action {
    readonly type = DELETE_ATTACHMENT_SUCCESS;
    constructor(public payload: { attachmentID: string }) {
    }
}

export class DeleteAttachmentFail implements Action {
    readonly type = DELETE_ATTACHMENT_FAIL;
    constructor(public payload: { attachmentID: string }) {
    }
}

export class DownloadAttachment implements Action {
    readonly type = DOWNLOAD_ATTACHMENT;
    constructor(public payload: { itemId: string, attachment: MsGraphBeta.Attachment, type: string }) { }
}
export class DownloadAttachmentSuccess implements Action {
    readonly type = DOWNLOAD_ATTACHMENT_SUCCESS;
    constructor(public payload: { ids: { itemId: string, attachmentId: string }, data: MsGraphBeta.Attachment }) { }
}
export class DownloadAttachmentFail implements Action {
    readonly type = DOWNLOAD_ATTACHMENT_FAIL;
    constructor(public payload: { error: string, ids: { itemId: string, attachmentId: string } }) { }
}
export class EventEditPopupClose implements Action {
    readonly type = CLOSE_POPUP;
    constructor(public payload: { attachmentChange: boolean, event: MsGraphBeta.Event, type: string }) { }
}

export class ResponseCalendarEvent implements Action {
    readonly type = RESPONSE_CALENDAR_EVENT;
    constructor(public payload: {
        event: MsGraphBeta.Event, comment: string, sendResponse: boolean, type: string, isSeries: boolean
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
export class ItemCreating implements Action {
    readonly type = ITEM_CREATING;
    constructor() { }
}

export class ChangeOnlineMeeting implements Action {
    readonly type = CHANGE_ONLINE_MEETING;
    constructor(public payload: { isOnline: boolean }) {
    }
}

export class GetRooms implements Action {
    readonly type = GET_ROOMS;
    constructor() { }
}
export class GetRoomsSuccess implements Action {
    readonly type = GET_ROOMS_SUCCESS;
    constructor(public payload: { rooms: MsGraphBeta.EmailAddress[] }) { }
}
export class GetRoomsFail implements Action {
    readonly type = GET_ROOMS_FAIL;
    constructor(public error) { }
}

export type Any = AddEvent | ChangeEventTitle | ChangeEventBody | ChangeEventLocation | ChangeEventStart | ChangeEventEnd |
    ChangeEventIsAllDay | ChangeEventIsPrivate | ChangeEventReMinder | ChangeEventRepeatRangeStart | ChangeEventRepeatRangeEnd |
    ChangeEventRepeatPattern | ChangeEventShowAs | ChangeEventAddAttendee | ChangeEventRemoveAttendee | ChangeEventRequestresponses |
    SendCalanderEvent | SendCalanderEventSuccess | SendCalanderEventFail | SendingCalanderEvent |
    DeleteCalanderEvent | DeleteCalanderEventSuccess | DeleteCalanderEventFail | DeletingCalanderEvent | ChangeEventSaveToCalender |
    AddAttachment | UploadAttachmentSuccess | UploadAttachmentFail | UploadAttachment | DeleteAttachment | DeleteAttachmentSuccess |
    DeleteAttachmentFail | DownloadAttachment | EventEditPopupClose | ResponseCalendarEvent |
    ResponseCalendarEventSuccsess | ResponseCalendarEventFail | ItemCreating | ChangeOnlineMeeting |
    GetRooms | GetRoomsSuccess | GetRoomsFail;

