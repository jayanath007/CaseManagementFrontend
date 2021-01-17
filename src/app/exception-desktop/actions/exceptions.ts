import { ExceptionDialogData } from '../../shared/models/dialog';
import { Action } from '@ngrx/store';

export const EXCEPTION_NOTIFICATION_RECEIVED = 'DPS_EXCEPTION_NOTIFICATION_RECEIVED';
export const EXCEPTION_NOTIFICATION_DELETE = 'DPS_EXCEPTION_NOTIFICATION_DELETE';
export const EXCEPTION_NOTIFICATION_HIDE = 'EXCEPTION_NOTIFICATION_HIDE';



export class ExceptionNotificationReceived implements Action {
    readonly type = EXCEPTION_NOTIFICATION_RECEIVED;
    constructor(public payload: {exception: ExceptionDialogData }) {}
}
export class DeleteException implements Action {
    readonly type = EXCEPTION_NOTIFICATION_DELETE;
    constructor(public id: number) {}
}

export class HideException implements Action {
    readonly type = EXCEPTION_NOTIFICATION_HIDE;
    constructor(public id: number) {}
}



export type Any = ExceptionNotificationReceived | DeleteException | HideException;

