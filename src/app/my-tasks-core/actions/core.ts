import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { PaginatorDef, ColumnDef } from '../../core/lib/grid-model';
import {
    Department, GridFilterUpdate, GridData, Summery, UserPermission, GridDataObject,
    MsgModel, GroupDataResponse, GridGroupData, GroupMode
} from '../models/interfce';
import { GridRequest, RequestToCompleteTask, LoadMyTaskGroupRequest } from '../models/request';
import { ViewChangeKind } from '../models/enumeration';

export const INIT_MY_TASK = 'INIT_MY_TASK';

export const LOAD_DEPARTMENTS = 'MY_TASK_DPS_LOAD_DEPARTMENTS';
export const LOAD_DEPARTMENTS_SUCCESS = 'MY_TASK_DPS_LOAD_DEPARTMENT_SUCESS';
export const LOAD_DEPARTMENTS_FAIL = 'MY_TASK_DPS_LOAD_DEPARTMENT_FAIL';

export const LOAD_USER_PERMISSION = 'MY_TASK_LOAD_USER_PERMISSION';
export const LOAD_USER_PERMISSION_SUCCESS = 'MY_TASK_LOAD_USER_PERMISSION_SUCESS';
export const LOAD_USER_PERMISSION_FAIL = 'MY_TASK_LOAD_USER_PERMISSION_FAIL';

export const LOAD_SUMMERY = 'MY_TASK_LOAD_SUMMERY';
export const LOAD_SUMMERY_SUCCESS = 'MY_TASK_LOAD_SUMMERY_SUCESS';
export const LOAD_SUMMERY_FAIL = 'MY_TASK_LOAD_SUMMERY_FAIL';



export const REQUEST_GRID_DATA = 'MY_TASK_REQUEST_GRID_DATA';
export const LOAD_GRID_DATA = 'MY_TASK_LOAD_GRID_DATA';
export const LOAD_GRID_DATA_SUCCESS = 'MY_TASK_GRID_DATA_SUCCESS';
export const LOAD_GRID_DATA_FAIL = 'MY_TASK_LOAD_GRID_DATA_FAIL';
export const GRID_FILTER_UPDATE = 'MY_TASK_GRID_FILTER_UPDATE';
export const GRID_ROW_EXPAND = 'MY_TASK_GRID_ROW_EXPAND';
export const GRID_VIEW_CHANGE = 'MY_TASK_GRID_VIEW_CHANGE';
export const GRID_REFRESH = 'MY_TASK_GRID_REFRESH';

export const REQUEST_TO_COMPLETE = 'MY_TASK_REQUEST_TO_COMPLETE';

export const CHECK_TIME_RECORDED_ENABLE = 'MY_TASK_CHECK_TIME_RECORDED_ENABLE';
export const CHECK_TIME_RECORDED_ENABLE_SUCCESS = 'MY_TASKCHECK_TIME_RECORDED_ENABLE_SUCESS';
export const CHECK_TIME_RECORDED_ENABLE_FAIL = 'MY_TASK_CHECK_TIME_RECORDED_ENABLE_FAIL';

export const COMPLETE_TASK_REQUEST = 'MY_TASK_COMPLETE_TASK_REQUEST';
export const COMPLETE_TASK = 'MY_TASK_COMPLETE_TASK';
export const COMPLETE_TASK_SUCCESS = 'MY_TASK_COMPLETE_TASK_SUCESS';
export const COMPLETE_TASK_FAIL = 'MY_TASK_COMPLETE_TASK_FAIL';

export const SHOW_MSG = 'MY_TASK_SHOW_MSG';

export const LOAD_MY_TASK_GROUP = 'LOAD_MY_TASK_GROUP';
export const LOAD_MY_TASK_GROUP_SUCCESS = 'LOAD_MY_TASK_GROUP_SUCCESS';
export const LOAD_MY_TASK_GROUP_FAIL = 'LOAD_MY_TASK_GROUP_FAIL';


export const EXPAND_MY_TASK_GROUP = 'EXPAND_MY_TASK_GROUP';

export const MY_TASK_GROUP_CHANGE = 'MY_TASK_GROUP_CHANGE';

export const LOAD_MY_TASK_GRID_DATA_BY_GROUP = 'LOAD_MY_TASK_GRID_DATA_BY_GROUP';
export const LOAD_MY_TASK_GRID_DATA_BY_GROUP_SUCCESS = 'LOAD_MY_TASK_GRID_DATA_BY_GROUP_SUCCESS';
export const LOAD_MY_TASK_GRID_DATA_BY_GROUP_FAIL = 'LOAD_MY_TASK_GRID_DATA_BY_GROUP_FAIL';

export const MY_TASK_GROUP_LOAD_MORE = 'MY_TASK_GROUP_LOAD_MORE';

export const GO_TO_OPEN_CASE = 'MY_TASK_GO_TO_OPEN_CASE';


export class InitMyTask extends TokenizeAction implements Action {
    readonly type = INIT_MY_TASK;
    constructor(public token: string, public payload: {
        columnDef: ColumnDef[],
        paginatorDef: PaginatorDef
    }) { super(token); }
}


export class MyTaskGroupLoadMore extends TokenizeAction implements Action {
    readonly type = MY_TASK_GROUP_LOAD_MORE;
    constructor(public token: string, public payload: { row: GridGroupData }) { super(token); }
}


export class LoadMyTaskGroup extends TokenizeAction implements Action {
    readonly type = LOAD_MY_TASK_GROUP;
    constructor(public token: string, public request: LoadMyTaskGroupRequest) { super(token); }
}

export class LoadMyTaskGroupSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MY_TASK_GROUP_SUCCESS;
    constructor(public token: string, public groups: GroupDataResponse[]) { super(token); }
}

export class LoadMyTaskGroupFail extends TokenizeAction implements Action {
    readonly type = LOAD_MY_TASK_GROUP_FAIL;
    constructor(public token: string, public payload: { data: any }) { super(token); }
}



export class ExpandMyTaskGroup extends TokenizeAction implements Action {
    readonly type = EXPAND_MY_TASK_GROUP;
    constructor(public token: string, public payload: { row: GridGroupData }) { super(token); }
}



export class MyTaskGroupChange extends TokenizeAction implements Action {
    readonly type = MY_TASK_GROUP_CHANGE;
    constructor(public token: string, public payload: { groupMode: GroupMode; }) { super(token); }
}






export class LoadMyTaskGridDataByGroup extends TokenizeAction implements Action {
    readonly type = LOAD_MY_TASK_GRID_DATA_BY_GROUP;
    constructor(public token: string, public payload: { request: GridRequest }) { super(token); }
}
export class LoadMyTaskGridDataByGroupSuccess extends TokenizeAction implements Action {

    readonly type = LOAD_MY_TASK_GRID_DATA_BY_GROUP_SUCCESS;
    constructor(public token: string, public payload: { pageData: GridDataObject, request: GridRequest }) {
        super(token);
    }
}
export class LoadMyTaskGridDataByGroupFail extends TokenizeAction implements Action {
    readonly type = LOAD_MY_TASK_GRID_DATA_BY_GROUP_FAIL;
    constructor(public token: string, public payload: { response: any, }) {
        super(token);
    }
}


































export class LoadDepartments extends TokenizeAction implements Action {
    readonly type = LOAD_DEPARTMENTS;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadDepartmentsSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DEPARTMENTS_SUCCESS;
    constructor(public token: string, public payload: { items: Department[] }) {
        super(token);
    }
}
export class LoadDepartmentsFail extends TokenizeAction implements Action {
    readonly type = LOAD_DEPARTMENTS_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}

export class LoadUserPermission extends TokenizeAction implements Action {
    readonly type = LOAD_USER_PERMISSION;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadUserPermissionSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_USER_PERMISSION_SUCCESS;
    constructor(public token: string, public payload: { items: UserPermission }) {
        super(token);
    }
}
export class LoadUserPermissionFail extends TokenizeAction implements Action {
    readonly type = LOAD_USER_PERMISSION_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}

export class GridDataRequest extends TokenizeAction implements Action {
    readonly type = REQUEST_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadGrid extends TokenizeAction implements Action {
    readonly type = LOAD_GRID_DATA;
    constructor(public token: string, public request: GridRequest) { super(token); }
}

export class LoadGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { pageData: GridDataObject }) { super(token); }
}

export class LoadGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class GridFilterChange extends TokenizeAction implements Action {
    readonly type = GRID_FILTER_UPDATE;
    constructor(public token: string, public payload: { newData: GridFilterUpdate }) { super(token); }
}

export class GridRowExpand extends TokenizeAction implements Action {
    readonly type = GRID_ROW_EXPAND;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}

export class GridViewChange extends TokenizeAction implements Action {
    readonly type = GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class GridRefresh extends TokenizeAction implements Action {
    readonly type = GRID_REFRESH;
    constructor(public token: string) { super(token); }
}

export class LoadSummery extends TokenizeAction implements Action {
    readonly type = LOAD_SUMMERY;
    constructor(public token: string) { super(token); }
}

export class LoadSummerySuccess extends TokenizeAction implements Action {
    readonly type = LOAD_SUMMERY_SUCCESS;
    constructor(public token: string, public payload: { data: Summery }) { super(token); }
}

export class LoadSummeryFail extends TokenizeAction implements Action {
    readonly type = LOAD_SUMMERY_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class CheckTREnabale extends TokenizeAction implements Action {
    readonly type = CHECK_TIME_RECORDED_ENABLE;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}

export class CheckTREnabaleSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_TIME_RECORDED_ENABLE_SUCCESS;
    constructor(public token: string, public payload: { row: GridData, isEnable: boolean }) { super(token); }
}

export class CheckTREnabaleFail extends TokenizeAction implements Action {
    readonly type = CHECK_TIME_RECORDED_ENABLE_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class RequestToComplete extends TokenizeAction implements Action {
    readonly type = REQUEST_TO_COMPLETE;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}

export class CompleteTaskRequest extends TokenizeAction implements Action {
    readonly type = COMPLETE_TASK_REQUEST;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}

export class CompleteTask extends TokenizeAction implements Action {
    readonly type = COMPLETE_TASK;
    constructor(public token: string, public payload: { request: RequestToCompleteTask }) { super(token); }
}

export class CompleteTaskSuccess extends TokenizeAction implements Action {
    readonly type = COMPLETE_TASK_SUCCESS;
    constructor(public token: string) { super(token); }
}

export class CompleteTaskFail extends TokenizeAction implements Action {
    readonly type = COMPLETE_TASK_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class ShowMsg extends TokenizeAction implements Action {
    readonly type = SHOW_MSG;
    constructor(public token: string, public payload: { msgModel: MsgModel }) { super(token); }
}

export class GoToOpenCase implements Action {
    readonly type = GO_TO_OPEN_CASE;
    constructor(public matter: GridData) { }
}

export type Any = InitMyTask |
    LoadDepartments | LoadDepartmentsSuccess | LoadDepartmentsFail |
    LoadUserPermission | LoadUserPermissionSuccess | LoadUserPermissionFail |
    GridDataRequest | LoadGrid | LoadGridSuccess | LoadGridFail | GridFilterChange |
    GridViewChange | GridRowExpand | GridRefresh |
    LoadSummery | LoadSummerySuccess | LoadSummeryFail |
    RequestToComplete | CheckTREnabale | CheckTREnabaleSuccess | CheckTREnabaleFail |
    CompleteTask | CompleteTaskRequest | ShowMsg |
    LoadMyTaskGroup |
    LoadMyTaskGroupSuccess |
    LoadMyTaskGroupFail |
    ExpandMyTaskGroup |
    LoadMyTaskGridDataByGroup |
    LoadMyTaskGridDataByGroupSuccess |
    LoadMyTaskGridDataByGroupFail | MyTaskGroupChange | MyTaskGroupLoadMore;

