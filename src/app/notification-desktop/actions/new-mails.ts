import { Action } from '@ngrx/store';
import { InboxMessageNotification } from '../../core/notifications';

export const NEW_MAIL_NOTIFICATION_RECIVED = 'DPS_NEW_MAIL_NOTIFICATION_RECIVED';
export const HIDE_NEW_MAIL_INDICATOR = 'DPS_HIDE_NEW_MAIL_INDICATOR';
export const TOGGLE_MAIL_LAST_EVENT = 'DPS_TOGGLE_MAIL_INDICATOR';
export const TOGGLE_MAIL_LIST = 'DPS_TOGGLE_MAIL_LIST';
export const DELETE_EVENT = 'DPS_DELETE_CURRENT_EVENT_INDICATOR';

export class NewMailNotificationReceived implements Action {
    readonly type = NEW_MAIL_NOTIFICATION_RECIVED;
    constructor(public payload: {event: InboxMessageNotification }) {}
}

export class HideIndicator implements Action {
    readonly type = HIDE_NEW_MAIL_INDICATOR;
    constructor() {}
}

export class DeleteEvent implements Action {
    readonly type = DELETE_EVENT;
    constructor(public id: string) {}
}

export class ToggleMailList implements Action {
    readonly type = TOGGLE_MAIL_LIST;
    constructor() {}
}

export class ToggleLastEvent implements Action {
    readonly type = TOGGLE_MAIL_LAST_EVENT;
    constructor() {}
}

export type Any = NewMailNotificationReceived | HideIndicator | ToggleLastEvent | DeleteEvent | ToggleMailList;

