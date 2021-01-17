import { PreviousTransInput } from './../models/interface';
import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { AllGridRequest } from '../models/request';
import { AllGridPageInfo } from '../models/interface';
import { GridFilterType } from '../models/enums';

export const INIT_PREVIOUS_TRANSACTION = 'INIT_PREVIOUS_TRANSACTION';

export const REQUEST_PREVIOUS_TRANSACTION_GRID_DATA = 'REQUEST_PREVIOUS_TRANSACTION_GRID_DATA';
export const GET_PREVIOUS_TRANSACTION_GRID_DATA = 'GET_PREVIOUS_TRANSACTION_GRID_DATA';
export const GET_PREVIOUS_TRANSACTION_GRID_DATA_SUCCESS = 'GET_PREVIOUS_TRANSACTION_GRID_DATA_SUCCESS';
export const GET_PREVIOUS_TRANSACTION_GRID_DATA_FAIL = 'GET_PREVIOUS_TRANSACTION_GRID_DATA_FAIL';

export const GET_PREVIOUS_TRANSACTION_GRID_CHANGE_PAGE = 'GET_PREVIOUS_TRANSACTION_GRID_CHANGE_PAGE';
export const GET_PREVIOUS_TRANSACTION_GRID_FILTER_TYPE = 'GET_PREVIOUS_TRANSACTION_GRID_FILTER_TYPE';
export const GET_PREVIOUS_TRANSACTION_SHOW_BALANCE_CHANGE = 'GET_PREVIOUS_TRANSACTION_SHOW_BALANCE_CHANGE';
export const PRINT_PREVIOUS_TRANSACTION = 'PRINT_PREVIOUS_TRANSACTION';
export const PRINT_PREVIOUS_TRANSACTION_SUCCESS = 'PRINT_PREVIOUS_TRANSACTION_SUCCESS';
export const PRINT_PREVIOUS_TRANSACTION_FAIL = 'PRINT_PREVIOUS_TRANSACTION_FAIL';
export const APPLY_COLUM_SORTING = 'PREVIOUS_TRANSACTION_APPLY_COLUM_SORTING';
export const APPLY_COLUM_FILTER = 'PREVIOUS_TRANSACTION_APPLY_COLUM_FILTER';

export class InitPreviousTransaction extends TokenizeAction implements Action {
    readonly type = INIT_PREVIOUS_TRANSACTION;
    constructor(public token: string, public payload: {
        columnDef: ColumnDef[],
        paginatorDef: PaginatorDef,
        input: PreviousTransInput

    }) { super(token); }
}
export class RequestGridData extends TokenizeAction implements Action {
    readonly type = REQUEST_PREVIOUS_TRANSACTION_GRID_DATA;
    constructor(public token: string) { super(token); }
} export class GetPreviousTransGridData extends TokenizeAction implements Action {
    readonly type = GET_PREVIOUS_TRANSACTION_GRID_DATA;
    constructor(public token: string, public request: AllGridRequest) { super(token); }
}
export class GetPreviousTransGridDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_PREVIOUS_TRANSACTION_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { allGridPageData: AllGridPageInfo }) { super(token); }
}
export class GetPreviousTransGridDataFail extends TokenizeAction implements Action {
    readonly type = GET_PREVIOUS_TRANSACTION_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}
export class ChangePaginator extends TokenizeAction {
    readonly type = GET_PREVIOUS_TRANSACTION_GRID_CHANGE_PAGE;
    constructor(public token, public pageDef: PaginatorDef) {
        super(token);
    }
} export class ShowBalancesCheckChange extends TokenizeAction implements Action {
    readonly type = GET_PREVIOUS_TRANSACTION_SHOW_BALANCE_CHANGE;
    constructor(public token: string, public payload: { checkedValue: boolean, columnDef: ColumnDef[] }) { super(token); }
}
export class ChangeGridFilterType extends TokenizeAction implements Action {
    readonly type = GET_PREVIOUS_TRANSACTION_GRID_FILTER_TYPE;
    constructor(public token: string, public payload: { gridFilterType: GridFilterType }) { super(token); }
}
export class PrintPreviousTrans extends TokenizeAction implements Action {
    readonly type = PRINT_PREVIOUS_TRANSACTION;
    constructor(public token: string) {// AllGridFilterModel
        super(token);
    }
}
export class PrintPreviousTransSuccess extends TokenizeAction implements Action {
    readonly type = PRINT_PREVIOUS_TRANSACTION_SUCCESS;
    constructor(public token: string, public payload: { url: any }) { super(token); }
}
export class PrintPreviousTransFail extends TokenizeAction implements Action {
    readonly type = PRINT_PREVIOUS_TRANSACTION_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}
export class ApplyColumSort extends TokenizeAction {
    readonly type = APPLY_COLUM_SORTING;
    constructor(public token: string, public columDef: ColumnDef) {
        super(token);
    }
}
export class ApplyColumFilter extends TokenizeAction {
    readonly type = APPLY_COLUM_FILTER;
    constructor(public token: string, public columDef: ColumnDef, public isClear?: boolean) {
        super(token);
    }
}
export type Any = InitPreviousTransaction | RequestGridData | GetPreviousTransGridData | GetPreviousTransGridDataSuccess |
    GetPreviousTransGridDataFail | ChangePaginator | ChangeGridFilterType | ShowBalancesCheckChange |
    PrintPreviousTrans | PrintPreviousTransSuccess | PrintPreviousTransFail | ApplyColumSort | ApplyColumFilter;
