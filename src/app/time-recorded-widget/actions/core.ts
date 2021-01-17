import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { DataRequest } from '../models/request';
import { GridDataObject, FromToDate, GridData } from '../models/interfce';
export const INIT_TIME_RECORDED_WIDGET = 'INIT_TIME_RECORDED_WIDGET';
export const REQUEST_DATA = 'TIME_RECORDED_WIDGET_REQUEST_GRID_DATA';
export const LOAD_DATA = 'TIME_RECORDED_WIDGET_LOAD_DATA';
export const LOAD_DATA_SUCCESS = 'TIME_RECORDED_WIDGET_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'TIME_RECORDED_WIDGET_DATA_FAIL';

export const LOAD_FROM_TO_DATE = 'TIME_RECORDED_WIDGET_LOAD_FROM_TO_DATE';
export const LOAD_FROM_TO_DATE_SUCCESS = 'TIME_RECORDED_WIDGET_LOAD_FROM_TO_DATE_SUCESS';
export const LOAD_FROM_TO_DATE_FAIL = 'TIME_RECORDED_WIDGET_LOAD_FROM_TO_DATE_FAIL';

export const REFRESH_TIME_RECORDED_EIDGET_DATA = 'MY_TIME_WIDGET_RECORDED_REFRESH_DATA';

export const GO_TO_OPEN_CASE = 'MY_TIME_WIDGET_GO_TO_OPEN_CASE';

export class InitTimeRecordedWidget implements Action {
    readonly type = INIT_TIME_RECORDED_WIDGET;
    constructor(public timeOffset: number) { }
}

export class LoadFromToDate implements Action {
    readonly type = LOAD_FROM_TO_DATE;
    constructor() { }
}

export class LoadFromToDateSuccess implements Action {
    readonly type = LOAD_FROM_TO_DATE_SUCCESS;
    constructor(public payload: { dates: FromToDate }) { }
}

export class LoadFromToDateFail implements Action {
    readonly type = LOAD_FROM_TO_DATE_FAIL;
    constructor() { }
}

export class RequestData implements Action {
    readonly type = REQUEST_DATA;
    constructor() { }
}

export class LoadData implements Action {
    readonly type = LOAD_DATA;
    constructor(public request: DataRequest) { }
}

export class LoadDataSuccess implements Action {
    readonly type = LOAD_DATA_SUCCESS;
    constructor(public payload: { dataObj: GridDataObject }) { }
}

export class LoadDataFail implements Action {
    readonly type = LOAD_DATA_FAIL;
    constructor() { }
}


export class RefreshTimeRecordedWidget implements Action {
    readonly type = REFRESH_TIME_RECORDED_EIDGET_DATA;
    constructor() { }
}

export class GoToOpenCase implements Action {
    readonly type = GO_TO_OPEN_CASE;
    constructor(public matter: GridData) { }
}

export type Any = InitTimeRecordedWidget | RequestData | LoadData | LoadDataSuccess | LoadDataFail | RefreshTimeRecordedWidget |
    LoadFromToDate | LoadFromToDateSuccess | LoadFromToDateFail;
