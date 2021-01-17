import { Action } from '@ngrx/store';
import { Reminder } from '../../core/lib/microsoft-graph';

export const NEW_REMINDER_RECEIVED = 'DPS_NEW_REMINDER_RECEIVED';
export const HIDE_NEW_REMINDER = 'DPS_HIDE_NEW_REMINDER';
export const SNOOZE_REMINDER = 'DPS_SNOOZE_REMINDER';
export const DISMISS_REMINDER = 'DPS_DISMISS_REMINDER';
export const DISMISS_ALL_REMINDER = 'DPS_DISMISS_ALL_REMINDER';
export const FIND_NEW_REMINDERS = 'DPS_FIND_NEW_REMINDERS';
export const UPDATE_REMINDERS = 'DPS_UPDATE_REMINDERS';
export const CHANGE_CURRENT_TIME = 'DPS_REMINDERS_CHANGE_CURRENT_TIME';

export const GET_AUTO_REPLY = 'DPS_NOTIFICATION_GET_AUTO_REPLY';
export const GET_AUTO_REPLY_SUCCESSS = 'DPS_NOTIFICATION_GET_AUTO_REPLY_SUCCESSS';
export const GET_AUTO_REPLY_FAIL = 'DPS_NOTIFICATION_GET_AUTO_REPLY_FAIL';

export const OFF_AUTO_REPLY = 'DPS_NOTIFICATION_OFF_AUTO_REPLY';
export const OFF_AUTO_REPLY_SUCCESSS = 'DPS_NOTIFICATION_OFF_AUTO_REPLY_SUCCESSS';
export const OFF_AUTO_REPLY_FAIL = 'DPS_NOTIFICATION_OFF_AUTO_REPLY_FAIL';

export class NewRemindersReceived implements Action {
    readonly type = NEW_REMINDER_RECEIVED;
    constructor(public payload: { reminders: Reminder[] }) { }
}

export class HideNewReminder implements Action {
    readonly type = HIDE_NEW_REMINDER;
    constructor(public payload?: { reminders: Reminder[] }) { }
}

export class SnoozeReminder implements Action {
    readonly type = SNOOZE_REMINDER;
    constructor(public payload: { reminder: Reminder, newReminderTime: string }) { }
}

export class DismissReminder implements Action {
    readonly type = DISMISS_REMINDER;
    constructor(public payload: { reminder: Reminder }) { }
}

export class DismissAllReminder implements Action {
    readonly type = DISMISS_ALL_REMINDER;
    constructor(public payload: { reminders: Reminder[] }) { }
}

export class FindNewReminders implements Action {
    readonly type = FIND_NEW_REMINDERS;
    constructor(public payload?: any) { }
}

export class UpdateReminders implements Action {
    readonly type = UPDATE_REMINDERS;
    constructor(public payload: { reminders: Reminder[] }) { }
}

export class ChangeCurrentTime implements Action {
    readonly type = CHANGE_CURRENT_TIME;
    constructor(public payload: { dateTime: string }) { }
}

// auto reply

export class GetAutoReply implements Action {
    readonly type = GET_AUTO_REPLY;
    constructor(public payload?: any) { }
}

export class GetAutoReplySuccess implements Action {
    readonly type = GET_AUTO_REPLY_SUCCESSS;
    constructor(public payload?: any) { }
}

export class GetAutoReplyFail implements Action {
    readonly type = GET_AUTO_REPLY_FAIL;
    constructor(public payload?: any) { }
}

export class OffAutoReply implements Action {
    readonly type = OFF_AUTO_REPLY;
    constructor(public payload?: any) { }
}

export class OffAutoReplySuccess implements Action {
    readonly type = OFF_AUTO_REPLY_SUCCESSS;
    constructor(public payload?: any) { }
}

export class OffAutoReplyFail implements Action {
    readonly type = OFF_AUTO_REPLY_FAIL;
    constructor(public payload?: any) { }
}


export type Any = NewRemindersReceived | HideNewReminder | UpdateReminders |
    SnoozeReminder | DismissReminder | ChangeCurrentTime | DismissAllReminder | GetAutoReplySuccess;
