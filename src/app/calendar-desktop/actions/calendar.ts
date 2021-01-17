import { Action } from '@ngrx/store';

export const CHANGE_CALENDAR_VIEW = 'DPS_CHANGE_CALENDAR_VIEW';
export const CHANGE_CALENDAR_TITLE = 'DPS_CHANGE_CALENDAR_TITLE';
export const CHANGE_SHOW_BUSINESS_HOURS = 'DPS_CHANGE_SHOW_BUSINESS_HOURS';

export class ChangeCalendarView implements Action {
    readonly type = CHANGE_CALENDAR_VIEW;
    constructor(public payload: { view: string}) { }
}
export class ChangeCalendarTitle implements Action {
    readonly type = CHANGE_CALENDAR_TITLE;
    constructor(public payload: { title: string}) { }
}
export class ChangeShowBusinessHours implements Action {
    readonly type = CHANGE_SHOW_BUSINESS_HOURS;
    constructor(public payload: { showBusinessHours: boolean}) { }
}
export type Any = ChangeCalendarView | ChangeCalendarTitle | ChangeShowBusinessHours;

