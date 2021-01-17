import { TimeRequest } from '../models/time-core-request';

import { Time, TimeResponse, TimeListItem } from '../models/interface';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { MatterInfo } from '../../core/lib/matter';

export const INIT_TIME_CORE = 'INIT_TIME_CORE';

export const LOAD_TIME_CORE_DATA_WITH_CURRENT_STATE = 'LOAD_TIME_CORE_DATA_WITH_CURRENT_STATE';


export const TIME_CORE_CHANGE = 'TIME_CORE_CHANGE';

export const TIME_CORE_GRID_ROW_CHANGE = 'TIME_CORE_GRID_ROW_CHANGE';

export const LOAD_TIME_CORE_GRID_DATA = 'LOAD_TIME_CORE_GRID_DATA';
export const LOAD_TIME_CORE_GRID_DATA_LOAD_SUCCESS = 'LOAD_TIME_CORE_GRID_DATA_LOAD_SUCCESS';
export const LOAD_TIME_CORE_GRID_DATA_LOAD_FAIL = 'LOAD_TIME_CORE_GRID_DATA_LOAD_FAIL';


export const LOAD_FILE_URL = 'LOAD_FILE_URL_LOAD';
export const LOAD_FILE_URL_LOAD_SUCCESS = 'LOAD_FILE_URL_LOAD_SUCCESS';
export const LOAD_FILE_URL_LOAD_FAIL = 'LOAD_FILE_URL_LOAD_FAIL';


export enum ViewChangeKind {
    SearchText = 'SEARCH_TEXT',
    PageEvent = 'PAGE_EVENT',
}
export enum RowItemChangeKind {
    IsExpand = 'IS_EXPAND',
}

export class InitTime extends TokenizeAction implements Action {
    readonly type = INIT_TIME_CORE;
    constructor(public token: string, public matterInfo: MatterInfo) { super(token); }
}
export class TimeViewChange extends TokenizeAction implements Action {
    readonly type = TIME_CORE_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}

export class TimeGridRowChange extends TokenizeAction implements Action {
    readonly type = TIME_CORE_GRID_ROW_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowItemChangeKind,
        row: TimeListItem<Time>, value: any
    }) { super(token); }
}

export class LoadTimeDataWithCurrentState extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_CORE_DATA_WITH_CURRENT_STATE;
    constructor(public token) { super(token); }
}
export class LoadTimeGridData extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_CORE_GRID_DATA;
    constructor(public token: string, public request: TimeRequest) { super(token); }
}

export class LoadTimeGridDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_CORE_GRID_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: TimeResponse, request: TimeRequest }) {
        super(token);
    }
}
export class LoadTimeGridDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_CORE_GRID_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { TimeList: Time[] }) {
        super(token);
    }
}



export type Any = InitTime | LoadTimeGridDataSuccess | LoadTimeGridDataFail
 | TimeViewChange | TimeGridRowChange | LoadTimeGridData;
