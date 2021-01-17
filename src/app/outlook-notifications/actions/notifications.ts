import { Action } from '@ngrx/store';

export const START_NOTIFICATIONS = 'DPS_START_NOTIFICATIONS';

export class StartNotifications implements Action {
    readonly type = START_NOTIFICATIONS;
    constructor(public isReconnect: boolean, public iteration: number) { }
}

export type Any = StartNotifications;
