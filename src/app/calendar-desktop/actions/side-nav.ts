import { Action } from '@ngrx/store';

export const CALENDAR_START_SIDENAVE_TOGGLE = 'DPS_START_SIDENAVE_TOGGLE';
export const CALENDAR_START_SIDENAVE_OPEN = 'DPS_START_SIDENAVE_OPEN';
export const CALENDAR_START_SIDENAVE_CLOSE = 'DPS_CALENDAR_START_SIDENAVE_CLOSE';

export const CALENDAR_END_SIDENAVE_TOGGLE = 'DPS_END_SIDENAVE_TOGGLE';
export const CALENDAR_END_SIDENAVE_OPEN = 'DPS_END_SIDENAVE_OPEN';
export const CALENDAR_END_SIDENAVE_CLOSE = 'DPS_CALENDAR_END_SIDENAVE_CLOSE';
export const CALENDAR_END_SIDENAVE_ENABLE = 'DPS_END_SIDENAVE_ENABLE';
export const CALENDAR_END_SIDENAVE_DISABLE = 'DPS_CALENDAR_END_SIDENAVE_DISABLE';

export class StartSidenaveToggle implements Action {
    readonly type = CALENDAR_START_SIDENAVE_TOGGLE;
    constructor() { }
}
export class StartSidenaveOpen implements Action {
    readonly type = CALENDAR_START_SIDENAVE_OPEN;
    constructor() { }
}
export class StartSidenaveClose implements Action {
    readonly type = CALENDAR_START_SIDENAVE_CLOSE;
    constructor() { }
}

export class EndSidenaveToggle implements Action {
    readonly type = CALENDAR_END_SIDENAVE_TOGGLE;
    constructor() { }
}
export class EndSidenaveOpen implements Action {
    readonly type = CALENDAR_END_SIDENAVE_OPEN;
    constructor() { }
}
export class EndSidenaveClose implements Action {
    readonly type = CALENDAR_END_SIDENAVE_CLOSE;
    constructor() { }
}
export class EndSidenaveEnable implements Action {
    readonly type = CALENDAR_END_SIDENAVE_ENABLE;
    constructor() { }
}
export class EndSidenaveDisable implements Action {
    readonly type = CALENDAR_END_SIDENAVE_DISABLE;
    constructor() { }
}

export type Any = StartSidenaveToggle | StartSidenaveOpen | StartSidenaveClose | EndSidenaveToggle | EndSidenaveOpen |
    EndSidenaveClose | EndSidenaveEnable | EndSidenaveDisable;
