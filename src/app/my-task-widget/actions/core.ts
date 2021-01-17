import { Action } from '@ngrx/store';
import { DataRequest, RequestToCompleteTask } from '../models/request';
import { GridDataObject, GridData } from '../models/interfce';
export const INIT_MY_TASK_WIDGET = 'INIT_MY_TASK_WIDGET_WIDGET';
export const REQUEST_DATA = 'MY_TASK_WIDGET_REQUEST_GRID_DATA';
export const LOAD_DATA = 'MY_TASK_WIDGET_LOAD_DATA';
export const LOAD_DATA_SUCCESS = 'MY_TASK_WIDGET_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'MY_TASK_WIDGET_DATA_FAIL';

export const COMPLETE_TASK_REQUEST = 'MY_TASK_WIDGET_COMPLETE_TASK_REQUEST';
export const COPMLETE_TASK = 'MY_TASK_WIDGET_COPMLETE_TASK';
export const COMPLETE_TASK_SUCCESS = 'MY_TASK_WIDGET_COMPLETE_TASK_SUCESS';
export const COMPLETE_TASK_FAIL = 'MY_TASK_WIDGET_COMPLETE_TASK_FAIL';

export const REFRESH_DATA = 'MY_TASK_WIDGET_REFRESH_DATA';

export class InitMyTaskWidget implements Action {
    readonly type = INIT_MY_TASK_WIDGET;
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

export class CompleteTaskRequest implements Action {
    readonly type = COMPLETE_TASK_REQUEST;
    constructor(public payload: { row: GridData }) { }
}

export class CompleteTask implements Action {
    readonly type = COPMLETE_TASK;
    constructor(public payload: { request: RequestToCompleteTask }) { }
}

export class CompleteTaskSuccess implements Action {
    readonly type = COMPLETE_TASK_SUCCESS;
    constructor() { }
}

export class CompleteTaskFail implements Action {
    readonly type = COMPLETE_TASK_FAIL;
    constructor() { }
}

export class RefreshMyTaskWidget implements Action {
    readonly type = REFRESH_DATA;
    constructor() { }
}

export type Any = InitMyTaskWidget | RequestData | LoadData | LoadDataSuccess | LoadDataFail | RefreshMyTaskWidget;
