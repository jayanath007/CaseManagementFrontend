import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { PaginatorDef, ColumnDef, GridGroupData } from '../../core/lib/grid-model';
import {
    Department, FromToDate, Periods, GridDataObject, GridFilterUpdate, GridData, MatterFinance,
    Summery, GroupMode
} from '../models/interfce';
import { GridRequest } from '../models/request';
import { ViewChangeKind } from '../models/enumeration';


export const INIT_WORK_DONE = 'WD_INIT_WORK_DONE';

export const LOAD_DEPARTMENTS = 'WD_DPS_LOAD_DEPARTMENTS';
export const LOAD_DEPARTMENTS_SUCCESS = 'WD_DPS_LOAD_DEPARTMENT_SUCESS';
export const LOAD_DEPARTMENTS_FAIL = 'WD_DPS_LOAD_DEPARTMENT_FAIL';

export const LOAD_PERIODS = 'WD_DPS_LOAD_PERIODS';
export const LOAD_PERIODS_SUCCESS = 'WD_LOAD_PERIODS_SUCESS';
export const LOAD_PERIODS_FAIL = 'WD_LOAD_PERIODS_FAIL';

export const LOAD_FROM_TO_DATE = 'WD_LOAD_FROM_TO_DATE';
export const LOAD_FROM_TO_DATE_SUCCESS = 'WD_LOAD_FROM_TO_DATE_SUCESS';
export const LOAD_FROM_TO_DATE_FAIL = 'WD_LOAD_FROM_TO_DATE_FAIL';

export const LOAD_SUMMERY = 'WD_LOAD_SUMMERY';
export const LOAD_SUMMERY_SUCCESS = 'WD_LOAD_SUMMERY_SUCESS';
export const LOAD_SUMMERY_FAIL = 'WD_LOAD_SUMMERY_FAIL';

export const REQUEST_GRID_DATA = 'WD_REQUEST_GRID_DATA';
export const LOAD_GRID_DATA = 'WD_LOAD_GRID_DATA';
export const LOAD_GRID_DATA_SUCCESS = 'WD_GRID_DATA_SUCCESS';
export const LOAD_GRID_DATA_FAIL = 'WD_LOAD_GRID_DATA_FAIL';
export const GRID_FILTER_UPDATE = 'WD_GRID_FILTER_UPDATE';
export const GRID_ROW_EXPAND = 'WD_GRID_ROW_EXPAND';
export const GRID_VIEW_CHANGE = 'WD_GRID_VIEW_CHANGE';

export const GET_MATTER_FINANCE = 'WD_GET_MATTER_FINANCE';
export const GET_MATTER_FINANCE_SUCCESS = 'WD_GET_MATTER_FINANCE_SUCESS';
export const GET_MATTER_FINANCE_FAIL = 'WD_GET_MATTER_FINANCE_FAIL';
export const GRID_REFRESH = 'WD_GRID_REFRESH';

export const GET_DOCUMENT_URL = 'WD_GET_DOCUMENT_URL';
export const GET_DOCUMENT_URL_SUCCESS = 'WD_GET_DOCUMENT_URL_SUCCESS';
export const GET_DOCUMENT_URL_FAIL = 'WD_GET_DOCUMENT_URL_FAIL';

export const LOAD_EMAIL_ITEM = 'WD_LOAD_EMAIL_ITEM';
export const LOAD_EMAIL_ITEM_SUCCESS = 'WD_LOAD_EMAIL_ITEM_SUCCESS';
export const LOAD_EMAIL_ITEM_FAIL = 'WD_LOAD_EMAIL_ITEM_FAIL';

export const LOAD_WEB_VIEW_URL = 'WD_LOAD_WEB_VIEW_URL';
export const VIEW_DOC = 'WD_VIEW_DOC';
export const GET_DOC_PASSWORD = 'WD_GET_DOC_PASSWORD';
export const VALIDATE_PASSWORD = 'WD_VALIDATE_PASSWORD';
export const SET_DOC_PASSWORD = 'WD_SET_DOC_PASSWORD';
export const REMOVE_PASSWORD_REQUEST_ROW = 'WD_REMOVE_PASSWORD_REQUEST_ROW';
export const PASSWORD_INVALID = 'WD_PASSWORD_INVALID';

export const ALL_DATA_UPDATE = 'WD_ALL_DATA_UPDATE';

export const LOAD_WORK_DONE_GROUP = 'LOAD_WORK_DONE_GROUP';
export const LOAD_WORK_DONE_GROUP_SUCCESS = 'LOAD_WORK_DONE_GROUP_SUCCESS';
export const LOAD_WORK_DONE_GROUP_FAIL = 'LOAD_WORK_DONE_GROUP_FAIL';

export const GROUP_DATA = 'GROUP_DATA';
export const GROUP_DATA_REQUEST = 'GROUP_DATA_REQUEST';

export const GO_TO_OPEN_CASE = 'WD_GO_TO_OPEN_CASE';


export class InitWorkDone extends TokenizeAction implements Action {
    readonly type = INIT_WORK_DONE;
    constructor(public token: string, public payload: {
        columnDef: ColumnDef[],
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


export class LoadPeriods extends TokenizeAction implements Action {
    readonly type = LOAD_PERIODS;
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

export class GetDocURL extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_URL;
    constructor(public token: string, public payload: { gridRow: GridData }) {
        super(token);
    }
}
export class GetDocURLSuccess extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_URL_SUCCESS;
    constructor(public token: string, public payload: { gridRow: GridData, url: string }) {
        super(token);
    }
}
export class GetDocURLFail extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_URL_FAIL;
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

export class LoadFromToDate extends TokenizeAction implements Action {
    readonly type = LOAD_FROM_TO_DATE;
    constructor(public token: string, public payload: { periodId: number }) { super(token); }
}

export class LoadFromToDateSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FROM_TO_DATE_SUCCESS;
    constructor(public token: string, public payload: { dates: FromToDate, periodId: number }) { super(token); }
}

export class LoadFromToDateFail extends TokenizeAction implements Action {
    readonly type = LOAD_FROM_TO_DATE_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class GetMatterFinance extends TokenizeAction implements Action {
    readonly type = GET_MATTER_FINANCE;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}

export class GetMatterFinanceSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTER_FINANCE_SUCCESS;
    constructor(public token: string, public payload: { row: GridData, financeData: MatterFinance }) { super(token); }
}

export class GetMatterFinanceFail extends TokenizeAction implements Action {
    readonly type = GET_MATTER_FINANCE_FAIL;
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

export class GetEmailItem extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM;
    constructor(public token: string, public request: GridData) {
        super(token);
    }
}
export class GetEmailItemSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM_SUCCESS;
    constructor(public token: string, public payload: { emailItem: boolean, row: GridData }) {
        super(token);
    }
}

export class LoadWebViewUrl extends TokenizeAction implements Action {
    readonly type = LOAD_WEB_VIEW_URL;
    constructor(public token: string, public request: GridData) { super(token); }
}

export class ViewDoc extends TokenizeAction implements Action {
    readonly type = VIEW_DOC;
    constructor(public token: string, public row: GridData) { super(token); }
}

export class GetDocPassword extends TokenizeAction implements Action {
    readonly type = GET_DOC_PASSWORD;
    constructor(public token: string, public payload: { row: GridData }) { super(token); }
}

export class ValidatePassword extends TokenizeAction implements Action {
    readonly type = VALIDATE_PASSWORD;
    constructor(public token: string, public payload: { row: GridData, insertPassword: string; }) { super(token); }
}

export class SetPassword extends TokenizeAction implements Action {
    readonly type = SET_DOC_PASSWORD;
    constructor(public token: string, public payload: { row: GridData, insertPassword: string; }) { super(token); }
}

export class RemovePaswordRequestRow extends TokenizeAction implements Action {
    readonly type = REMOVE_PASSWORD_REQUEST_ROW;
    constructor(public token: string) { super(token); }
}

export class PaswordInvalid extends TokenizeAction implements Action {
    readonly type = PASSWORD_INVALID;
    constructor(public token: string) { super(token); }
}

export class AllDataUpdate extends TokenizeAction implements Action {
    readonly type = ALL_DATA_UPDATE;
    constructor(public token: string) { super(token); }
}
export class GroupData extends TokenizeAction implements Action {
    readonly type = GROUP_DATA;
    constructor(public token: string, public payload: { type: GroupMode }) { super(token); }
}

export class GroupDataRequest extends TokenizeAction implements Action {
    readonly type = GROUP_DATA_REQUEST;
    constructor(public token: string, public payload: { gridGroupData: GridGroupData, isLoadMore?: boolean }) { super(token); }
}

export class GoToOpenCase implements Action {
    readonly type = GO_TO_OPEN_CASE;
    constructor(public matter: GridData) { }
}

export type Any = InitWorkDone |
    LoadDepartments | LoadDepartmentsSuccess | LoadDepartmentsFail |
    LoadPeriods | LoadPeriodsSuccess | LoadPeriodsFail |
    GridDataRequest | LoadGrid | LoadGridSuccess | LoadGridFail | GridFilterChange | GridRowExpand |
    GetMatterFinance | GetMatterFinanceSuccess | GetMatterFinanceFail |
    GridViewChange |
    LoadFromToDate | LoadFromToDateSuccess | LoadFromToDateFail |
    GridRefresh |
    LoadSummery | LoadSummerySuccess | LoadSummeryFail |
    GetDocURL | GetDocURLSuccess | GetDocURLFail |
    GetEmailItemSuccess | ViewDoc | GetDocPassword | SetPassword | RemovePaswordRequestRow |
    PaswordInvalid | AllDataUpdate | GroupData | GroupDataRequest;
