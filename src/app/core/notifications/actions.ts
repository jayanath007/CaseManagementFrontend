import { Action } from '@ngrx/store';
import { GenericNotification } from './interfaces';
import { Message, Reminder } from '../lib/microsoft-graph';

export const NOTIFICATION_RECEIVED = 'DPS_OUTLOOK_NOTIFICATION_RECIVED';
export const INBOX_NEW_ITEM_NOTIFICATION = 'DPS_INBOX_NEW_ITEM_NOTIFICATION';
export const NOTIFICATION_RECONNECTED = 'DPS_OUTLOOK_NOTIFICATION_RECONNECTED';

export const REMINDERS_RECEIVED = 'DPS_OUTLOOK_REMINDERS_RECEIVED';
export const NEW_REMINDER_RECEIVED = 'DPS_OUTLOOK_NEW_REMINDER_RECEIVED';

export class NotificationReceived implements Action {
    readonly type = NOTIFICATION_RECEIVED;
    constructor(public payload: GenericNotification) { }
}

export class InboxNewItemNotification implements Action {
    readonly type = INBOX_NEW_ITEM_NOTIFICATION;
    constructor(public payload: Message) { }
}

export class NotificationReconnected implements Action {
    readonly type = NOTIFICATION_RECONNECTED;
    constructor() { }
}

export class RemindersReceived implements Action {
    readonly type = REMINDERS_RECEIVED;
    constructor(public payload: Reminder[]) { }
}

export class NewReminderReceived implements Action {
    readonly type = NEW_REMINDER_RECEIVED;
    constructor(public payload: Reminder) { }
}
