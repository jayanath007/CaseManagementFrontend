import { Action } from '@ngrx/store';

export const START_REMINDERS = 'DPS_START_REMINDERS';
export const REFRESH_REMINDERS = 'DPS_REFRESH_REMINDERS';

export class StartReminders implements Action {
    readonly type = START_REMINDERS;
    constructor(public iteration: number) { }
}

export class RefreshReminders implements Action {
    readonly type = REFRESH_REMINDERS;
    constructor(public iteration: number) { }
}

export type Any = StartReminders;
