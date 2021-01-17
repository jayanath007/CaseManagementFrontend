
import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';

import { PaginatorDef, GridGroupData } from '../../core/lib/grid-model';
import {
    Department, Type, Periods, UserPermission, GridDataObject, GridFilterUpdate, FromToDate,
    GridTemplete, Summery, GridData
} from '../models/interfce';
import { GridRequest } from '../models/request';
import { ViewChangeKind, GroupMode } from '../models/enumeration';

export const INIT_TIME_RECORDED = 'TR_INIT_TIME_RECORDED';
export const ALL_DATA_UPDATE = 'TR_ADD_NOTE_ALL_DATA_UPDATE';

export const LOAD_USER_PERMISSION = 'TR_LOAD_USER_PERMISSION';
export const LOAD_USER_PERMISSION_SUCCESS = 'TR_LOAD_USER_PERMISSION_SUCESS';
export const LOAD_USER_PERMISSION_FAIL = 'TR_LOAD_USER_PERMISSION_FAIL';

export const LOAD_DEPARTMENTS = 'TR_DPS_LOAD_DEPARTMENTS';
export const LOAD_DEPARTMENTS_SUCCESS = 'TR_DPS_LOAD_DEPARTMENT_SUCESS';
export const LOAD_DEPARTMENTS_FAIL = 'TR_DPS_LOAD_DEPARTMENT_FAIL';

export const LOAD_TYPES = 'TR_DPS_LOAD_TYPES';
export const LOAD_TYPES_SUCCESS = 'TR_LOAD_TYPES_SUCESS';
export const LOAD_TYPES_FAIL = 'TR_LOAD_TYPES_FAIL';

export const LOAD_PERIODS = 'TR_DPS_LOAD_PERIODS';
export const LOAD_PERIODS_SUCCESS = 'TR_LOAD_PERIODS_SUCESS';
export const LOAD_PERIODS_FAIL = 'TR_LOAD_PERIODS_FAIL';

export const LOAD_FROM_TO_DATE = 'TR_LOAD_FROM_TO_DATE';
export const LOAD_FROM_TO_DATE_SUCCESS = 'TR_LOAD_FROM_TO_DATE_SUCESS';
export const LOAD_FROM_TO_DATE_FAIL = 'TR_LOAD_FROM_TO_DATE_FAIL';

export const LOAD_SUMMERY = 'TR_LOAD_SUMMERY';
export const LOAD_SUMMERY_SUCCESS = 'TR_LOAD_SUMMERY_SUCESS';
export const LOAD_SUMMERY_FAIL = 'TR_LOAD_SUMMERY_FAIL';

export const REQUEST_GRID_DATA = 'TR_REQUEST_GRID_DATA';
export const LOAD_GRID_DATA = 'TR_LOAD_GRID_DATA';
export const LOAD_GRID_DATA_SUCCESS = 'TR_GRID_DATA_SUCCESS';
export const LOAD_GRID_DATA_FAIL = 'TR_LOAD_GRID_DATA_FAIL';
export const GRID_FILTER_UPDATE = 'TR_GRID_FILTER_UPDATE';
export const GRID_VIEW_CHANGE = 'TR_GRID_VIEW_CHANGE';

export const GRID_REFRESH = 'TR_GRID_REFRESH';
export const CHANGE_SELECT_ROW = 'TR_CHANGE_SELECT_ROW';

export const GROUP_DATA = 'TR_GROUP_DATA';
export const GROUP_DATA_REQUEST = 'TR_GROUP_DATA_REQUEST';

export const LOAD_RECORD_TIME_LIST = 'TR_LOAD_RECORD_TIME_LIST';
export const LOAD_RECORD_TIME_LIST_SUCCESS = 'TR_LOAD_RECORD_TIME_LIST_SUCCESS';
export const LOAD_RECORD_TIME_LIST_FAIL = 'TR_LOAD_RECORD_TIME_LIST_FAIL';
export const EXPORT_TO_EXCEL = 'TR_EXPORT_TO_EXCEL';
export const EXPORT_TO_EXCEL_SUCCESS = 'TR_EXPORT_TO_EXCEL_SUCCESS';
export const EXPORT_TO_EXCEL_FAIL = 'TR_EXPORT_TO_EXCEL_FAIL';
export const TIME_RECORDED_DATE_TIME_CHANGE = 'TIME_RECORDED_DATE_TIME_CHANGE';

export class InitTimeRecorded extends TokenizeAction implements Action {
    readonly type = INIT_TIME_RECORDED;
    constructor(public token: string, public payload: {
        gridTemplete: GridTemplete,
        paginatorDef: PaginatorDef,
        timeOffset: number
    }) { super(token); }
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

export class LoadTypes extends TokenizeAction implements Action {
    readonly type = LOAD_TYPES;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTypesSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TYPES_SUCCESS;
    constructor(public token: string, public payload: { items: Type[] }) {
        super(token);
    }
}
export class LoadTypesFail extends TokenizeAction implements Action {
    readonly type = LOAD_TYPES_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}


export class LoadPeriods extends TokenizeAction implements Action {
    readonly type = LOAD_PERIODS;
    constructor(public token: string) {
        super(token);
    }
}

export class AllDataUpdate extends TokenizeAction implements Action {
    readonly type = ALL_DATA_UPDATE;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadPeriodsSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_PERIODS_SUCCESS;
    constructor(public token: string, public payload: { items: Periods[] }) {
        super(token);
    }
}
export class LoadPeriodsFail extends TokenizeAction implements Action {
    readonly type = LOAD_PERIODS_FAIL;
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
    constructor(public token: string, public isGropuing?: boolean, public GroupType?: string,
        public gridGroupData?: GridGroupData) { super(token); }
}

export class LoadGrid extends TokenizeAction implements Action {
    readonly type = LOAD_GRID_DATA;
    constructor(public token: string, public request: GridRequest, public gridGroupData?: GridGroupData) { super(token); }
}

export class LoadGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { pageData: GridDataObject, gridGroupData?: GridGroupData },
        public request: GridRequest) { super(token); }
}

export class LoadGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class GridFilterChange extends TokenizeAction implements Action {
    readonly type = GRID_FILTER_UPDATE;
    constructor(public token: string, public payload: { newData: GridFilterUpdate }) { super(token); }
}

export class GridViewChange extends TokenizeAction implements Action {
    readonly type = GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class LoadFromToDate extends TokenizeAction implements Action {
    readonly type = LOAD_FROM_TO_DATE;
    constructor(public token: string, public payload: { periodId: number }) { super(token); }
}

export class LoadFromToDateSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FROM_TO_DATE_SUCCESS;
    constructor(public token: string, public payload: { dates: FromToDate, periadId: number }) { super(token); }
}

export class LoadFromToDateFail extends TokenizeAction implements Action {
    readonly type = LOAD_FROM_TO_DATE_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
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

export class GridChangeSelectRow extends TokenizeAction implements Action {
    readonly type = CHANGE_SELECT_ROW;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}

export class GroupData extends TokenizeAction implements Action {
    readonly type = GROUP_DATA;
    constructor(public token: string, public payload: { type: GroupMode }) { super(token); }
}

export class GroupDataRequest extends TokenizeAction implements Action {
    readonly type = GROUP_DATA_REQUEST;
    constructor(public token: string, public payload: { gridGroupData: GridGroupData, isLoadMore?: boolean }) { super(token); }
}

export class LoadRecordTimeList extends TokenizeAction implements Action {
    readonly type = LOAD_RECORD_TIME_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadRecordTimeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_RECORD_TIME_LIST_SUCCESS;
    constructor(public token: string, public payload: { items: any[] }) {
        super(token);
    }
}
export class LoadRecordTimeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_RECORD_TIME_LIST_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}

export class ExportToExcel extends TokenizeAction implements Action {
    readonly type = EXPORT_TO_EXCEL;
    constructor(public token: string) {
        super(token);
    }
}
export class ExportToExcelSuccess extends TokenizeAction implements Action {
    readonly type = EXPORT_TO_EXCEL_SUCCESS;
    constructor(public token: string, public exportData: any) {
        super(token);
    }
}
export class ExportToExcelFail extends TokenizeAction implements Action {
    readonly type = EXPORT_TO_EXCEL_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class DateTypeDange extends TokenizeAction implements Action {
    readonly type = TIME_RECORDED_DATE_TIME_CHANGE;
    constructor(public token: string, public dateType: boolean) {
        super(token);
    }
}
export type Any = InitTimeRecorded |
    LoadDepartments | LoadDepartmentsSuccess | LoadDepartmentsFail |
    LoadTypes | LoadTypesSuccess | LoadTypesFail |
    LoadPeriods | LoadPeriodsSuccess | LoadPeriodsFail |
    LoadUserPermission | LoadUserPermissionSuccess | LoadUserPermissionFail |
    GridDataRequest | LoadGrid | LoadGridSuccess | LoadGridFail |
    GridFilterChange | GridViewChange |
    LoadFromToDate | LoadFromToDateSuccess | LoadFromToDateFail | GridRefresh |
    LoadSummery | LoadSummerySuccess | LoadSummeryFail | GridChangeSelectRow |
    GroupData | GroupDataRequest | AllDataUpdate | DateTypeDange |
    LoadRecordTimeList | LoadRecordTimeListSuccess | LoadRecordTimeListFail | ExportToExcel | ExportToExcelSuccess | ExportToExcelFail;
