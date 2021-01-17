import { CaseTimeRequest } from '../models/case-time-request';
import { CaseTime, CaseTimeResponse, TimeItemWrapper } from '../models/interface';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { MatterInfo } from '../../core/lib/matter';
import { ColumnDef } from '../../core/lib/grid-model';

export const INIT_CASE_TIME = 'INIT_CASE_TIME';
export const LOAD_CASE_TIME_DATA_WITH_CURRENT_STATE = 'LOAD_CASE_TIME_DATA_WITH_CURRENT_STATE';
export const CASE_TIME_CHANGE = 'CASE_TIME_CHANGE';
export const CASE_TIME_GRID_ROW_CHANGE = 'CASE_TIME_GRID_ROW_CHANGE';
export const LOAD_CASE_TIME_GRID_DATA = 'LOAD_CASE_TIME_GRID_DATA';
export const LOAD_CASE_TIME_GRID_DATA_LOAD_SUCCESS = 'LOAD_CASE_TIME_GRID_DATA_LOAD_SUCCESS';
export const LOAD_CASE_TIME_GRID_DATA_LOAD_FAIL = 'LOAD_CASE_TIME_GRID_DATA_LOAD_FAIL';
export const CASE_TIME_REFRESH = 'CASE_TIME_REFRESH';

export const DELETE_TIME = 'CASE_TIME_RECORD_DELETE';
export const DELETE_TIME_SUCCESS = 'CASE_TIME_RECORD_DELETE_SUCCESS';
export const DELETE_TIME_FAIL = 'CASE_TIME_RECORD_DELETE_FAIL';


export enum ViewChangeKind {
    SearchText = 'SEARCH_TEXT',
    PageEvent = 'PAGE_EVENT',
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    ToggleFieldSort = 'FIELD_SORT',
}
export enum RowItemChangeKind {
    IsExpand = 'IS_EXPAND',
}

export class InitCaseTime extends TokenizeAction implements Action {
    readonly type = INIT_CASE_TIME;
    constructor(public token: string, public payload: { columnDef: ColumnDef[], matterInfo: MatterInfo }) { super(token); }
}
export class CaseTimeViewChange extends TokenizeAction implements Action {
    readonly type = CASE_TIME_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}
export class CaseTimeRefresh extends TokenizeAction implements Action {
    readonly type = CASE_TIME_REFRESH;
    constructor(public token: string) { super(token); }
}

export class CaseTimeGridRowChange extends TokenizeAction implements Action {
    readonly type = CASE_TIME_GRID_ROW_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowItemChangeKind,
        row: TimeItemWrapper, value: any
    }) { super(token); }
}

export class LoadCaseTimeDataWithCurrentState extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_TIME_DATA_WITH_CURRENT_STATE;
    constructor(public token) { super(token); }
}
export class LoadCaseTimeGridData extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_TIME_GRID_DATA;
    constructor(public token: string, public request: CaseTimeRequest) { super(token); }
}

export class LoadCaseTimeGridDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_TIME_GRID_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: CaseTimeResponse, request: CaseTimeRequest }) {
        super(token);
    }
}
export class LoadCaseTimeGridDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_TIME_GRID_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { CaseTimeList: CaseTime[] }) {
        super(token);
    }
}
export class DeleteTime extends TokenizeAction implements Action {
    readonly type = DELETE_TIME;
    constructor(public token: string, public payload: { CaseTime: TimeItemWrapper, matterRef: string }) {
        super(token);
    }
}
export class DeleteTimeSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_TIME_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}
export class DeleteTimeFail extends TokenizeAction implements Action {
    readonly type = DELETE_TIME_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export type Any = InitCaseTime | LoadCaseTimeGridDataSuccess | LoadCaseTimeGridDataFail | CaseTimeRefresh |
    CaseTimeViewChange | CaseTimeGridRowChange | LoadCaseTimeGridData | DeleteTime | DeleteTimeSuccess | DeleteTimeFail;
