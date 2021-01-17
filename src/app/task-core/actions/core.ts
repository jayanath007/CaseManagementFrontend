import { TaskRequest } from '../models/task-core-request';

import { Task, TaskResponse, TaskListItem } from '../models/interface';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { MatterInfo } from '../../core/lib/matter';

export const INIT_TASK_CORE = 'INIT_TASK_CORE';

export const LOAD_TASK_CORE_DATA_WITH_CURRENT_STATE = 'LOAD_TASK_CORE_DATA_WITH_CURRENT_STATE';


export const TASK_CORE_CHANGE = 'TASK_CORE_CHANGE';

export const TASK_CORE_GRID_ROW_CHANGE = 'TASK_CORE_GRID_ROW_CHANGE';

export const LOAD_TASK_CORE_GRID_DATA = 'LOAD_TASK_CORE_GRID_DATA';
export const LOAD_TASK_CORE_GRID_DATA_LOAD_SUCCESS = 'LOAD_TASK_CORE_GRID_DATA_LOAD_SUCCESS';
export const LOAD_TASK_CORE_GRID_DATA_LOAD_FAIL = 'LOAD_TASK_CORE_GRID_DATA_LOAD_FAIL';


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

export class InitTask extends TokenizeAction implements Action {
    readonly type = INIT_TASK_CORE;
    constructor(public token: string, public matterInfo: MatterInfo) { super(token); }
}
export class TaskViewChange extends TokenizeAction implements Action {
    readonly type = TASK_CORE_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}

export class TaskGridRowChange extends TokenizeAction implements Action {
    readonly type = TASK_CORE_GRID_ROW_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowItemChangeKind,
        row: TaskListItem<Task>, value: any
    }) { super(token); }
}

export class LoadTaskDataWithCurrentState extends TokenizeAction implements Action {
    readonly type = LOAD_TASK_CORE_DATA_WITH_CURRENT_STATE;
    constructor(public token) { super(token); }
}
export class LoadTaskGridData extends TokenizeAction implements Action {
    readonly type = LOAD_TASK_CORE_GRID_DATA;
    constructor(public token: string, public request: TaskRequest) { super(token); }
}

export class LoadTaskGridDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TASK_CORE_GRID_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: TaskResponse, request: TaskRequest }) {
        super(token);
    }
}
export class LoadTaskGridDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_TASK_CORE_GRID_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { TaskList: Task[] }) {
        super(token);
    }
}



export type Any = InitTask | LoadTaskGridDataSuccess | LoadTaskGridDataFail
 | TaskViewChange | TaskGridRowChange | LoadTaskGridData;
