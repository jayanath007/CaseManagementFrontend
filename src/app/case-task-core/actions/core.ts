import { CaseTaskRequest } from '../models/case-task-request';
import { CaseTask, CaseTaskResponse, TaskItemWrapper, RequestToCompleteTask, MsgModel } from '../models/interface';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { MatterInfo } from '../../core/lib/matter';
import { ColumnDef } from '../../core/lib/grid-model';
import { GridData } from '../../task-add-edit-core';

export const INIT_CASE_TASK = 'INIT_CASE_TASK';
export const LOAD_CASE_TASK_DATA_WITH_CURRENT_STATE = 'LOAD_CASE_TASK_DATA_WITH_CURRENT_STATE';
export const CASE_TASK_CHANGE = 'CASE_TASK_CHANGE';
export const CASE_TASK_GRID_ROW_CHANGE = 'CASE_TASK_GRID_ROW_CHANGE';
export const LOAD_CASE_TASK_GRID_DATA = 'LOAD_CASE_TASK_GRID_DATA';
export const LOAD_CASE_TASK_GRID_DATA_LOAD_SUCCESS = 'LOAD_CASE_TASK_GRID_DATA_LOAD_SUCCESS';
export const LOAD_CASE_TASK_GRID_DATA_LOAD_FAIL = 'LOAD_CASE_TASK_GRID_DATA_LOAD_FAIL';

export const CASE_TASK_REFRESH = 'CASE_TASK_REFRESH';
export const CASE_TASK_REQUEST_TO_COMPLETE = 'CASE_TASK_REQUEST_TO_COMPLETE';

export const CASE_TASK_CHECK_TIME_RECORDED_ENABLE = 'CASE_TASK_CHECK_TIME_RECORDED_ENABLE';
export const CASE_TASK_CHECK_TIME_RECORDED_ENABLE_SUCCESS = 'CASE_TASK_CHECK_TIME_RECORDED_ENABLE_SUCCESS';
export const CASE_TASK_CHECK_TIME_RECORDED_ENABLE_FAIL = 'CASE_TASK_CHECK_TIME_RECORDED_ENABLE_FAIL';

export const CASE_TASK_COMPLETE_TASK = 'CASE_TASK_COMPLETE_TASK';
export const CASE_TASK_COMPLETE_TASK_SUCCESS = 'CASE_TASK_COMPLETE_TASK_SUCCESS';
export const CASE_TASK_COMPLETE_TASK_FAIL = 'CASE_TASK_COMPLETE_TASK_FAIL';

export const CASE_TASK_COMPLETE_TASK_REQUEST = 'CASE_TASK_COMPLETE_TASK_REQUEST';
export const CASE_TASK_SHOW_MSG = 'CASE_TASK_SHOW_MSG';

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

export class InitCaseTask extends TokenizeAction implements Action {
    readonly type = INIT_CASE_TASK;
    constructor(public token: string, public payload: { columnDef: ColumnDef[], matterInfo: MatterInfo }) { super(token); }
}
export class CaseTaskViewChange extends TokenizeAction implements Action {
    readonly type = CASE_TASK_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}
export class CaseTaskRefresh extends TokenizeAction implements Action {
    readonly type = CASE_TASK_REFRESH;
    constructor(public token: string) { super(token); }
}

export class CaseTaskGridRowChange extends TokenizeAction implements Action {
    readonly type = CASE_TASK_GRID_ROW_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowItemChangeKind,
        row: TaskItemWrapper, value: any
    }) { super(token); }
}

export class LoadCaseTaskDataWithCurrentState extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_TASK_DATA_WITH_CURRENT_STATE;
    constructor(public token) { super(token); }
}
export class LoadCaseTaskGridData extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_TASK_GRID_DATA;
    constructor(public token: string, public request: CaseTaskRequest) { super(token); }
}

export class LoadCaseTaskGridDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_TASK_GRID_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: CaseTaskResponse, request: CaseTaskRequest }) {
        super(token);
    }
}
export class LoadCaseTaskGridDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_TASK_GRID_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { CaseTaskList: CaseTask[] }) {
        super(token);
    }
}
export class RequestToComplete extends TokenizeAction implements Action {
    readonly type = CASE_TASK_REQUEST_TO_COMPLETE;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}
export class CompleteTaskRequest extends TokenizeAction implements Action {
    readonly type = CASE_TASK_COMPLETE_TASK_REQUEST;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}
export class CheckTREnabaleCase extends TokenizeAction implements Action {
    readonly type = CASE_TASK_CHECK_TIME_RECORDED_ENABLE;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}

export class CheckTREnabaleSuccessCase extends TokenizeAction implements Action {
    readonly type = CASE_TASK_CHECK_TIME_RECORDED_ENABLE_SUCCESS;
    constructor(public token: string, public payload: { row: GridData, isEnable: boolean }) { super(token); }
}

export class CheckTREnabaleFailCase extends TokenizeAction implements Action {
    readonly type = CASE_TASK_CHECK_TIME_RECORDED_ENABLE_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class CompleteTaskCase extends TokenizeAction implements Action {
    readonly type = CASE_TASK_COMPLETE_TASK;
    constructor(public token: string, public payload: { request: RequestToCompleteTask }) { super(token); }
}

export class CompleteTaskSuccessCase extends TokenizeAction implements Action {
    readonly type = CASE_TASK_COMPLETE_TASK_SUCCESS;
    constructor(public token: string) { super(token); }
}

export class CompleteTaskFailCase extends TokenizeAction implements Action {
    readonly type = CASE_TASK_COMPLETE_TASK_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}
export class ShowMsg extends TokenizeAction implements Action {
    readonly type = CASE_TASK_SHOW_MSG;
    constructor(public token: string, public payload: { msgModel: MsgModel }) { super(token); }
}

export type Any = InitCaseTask | LoadCaseTaskGridDataSuccess | LoadCaseTaskGridDataFail | CaseTaskRefresh
    | CaseTaskViewChange | CaseTaskGridRowChange | LoadCaseTaskGridData | RequestToComplete |
    CheckTREnabaleCase | CheckTREnabaleSuccessCase | CheckTREnabaleFailCase
    | CompleteTaskCase | CompleteTaskSuccessCase | CompleteTaskFailCase | CompleteTaskRequest | ShowMsg;
