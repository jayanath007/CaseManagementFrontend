import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import * as MicrosoftGraph from '../../core/lib/microsoft-graph';

export const INIT_CALENDAR_WIDGET = 'INIT_CALENDAR_WIDGET_WIDGET';
export const LOAD_DATA = 'CALENDAR_WIDGET_LOAD_DATA';
export const LOAD_DATA_SUCCESS = 'CALENDAR_WIDGET_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'CALENDAR_WIDGET_DATA_FAIL';

export const REFRESH_DATA = 'CALENDAR_WIDGET_REFRESH_DATA';

export class InitCalendarWidget implements Action {
    readonly type = INIT_CALENDAR_WIDGET;
    constructor() { }
}


export class LoadData implements Action {
    readonly type = LOAD_DATA;
    constructor() { }
}

export class LoadDataSuccess implements Action {
    readonly type = LOAD_DATA_SUCCESS;
    constructor(public payload: { data: MicrosoftGraph.Event[] }) { }
}

export class LoadDataFail implements Action {
    readonly type = LOAD_DATA_FAIL;
    constructor() { }
}

export class RefreshCalendarWidgetData implements Action {
    readonly type = REFRESH_DATA;
    constructor() { }
}

export type Any = InitCalendarWidget | LoadData | LoadDataSuccess | LoadDataFail | RefreshCalendarWidgetData;
