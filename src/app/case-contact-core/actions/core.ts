import { CaseContactRequest, MainContactRequest } from '../models/case-contact-request';
import { CaseContact, CaseContactResponse, ContactItemWrapper } from '../models/interface';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { MatterInfo } from '../../core/lib/matter';
import { ColumnDef } from '../../core/lib/grid-model';

export const INIT_CASE_CONTACT = 'INIT_CASE_CONTACT';
export const LOAD_CASE_CONTACT_DATA_WITH_CURRENT_STATE = 'LOAD_CASE_CONTACT_DATA_WITH_CURRENT_STATE';
export const CASE_CONTACT_CHANGE = 'CASE_CONTACT_CHANGE';
export const CASE_CONTACT_GRID_ROW_CHANGE = 'CASE_CONTACT_GRID_ROW_CHANGE';

export const LOAD_CASE_CONTACT_GRID_DATA = 'LOAD_CASE_CONTACT_GRID_DATA';
export const LOAD_CASE_CONTACT_GRID_DATA_LOAD_SUCCESS = 'LOAD_CASE_CONTACT_GRID_DATA_LOAD_SUCCESS';
export const LOAD_CASE_CONTACT_GRID_DATA_LOAD_FAIL = 'LOAD_CASE_CONTACT_GRID_DATA_LOAD_FAIL';

export const CASE_CONTACT_REFRESH = 'CASE_CONTACT_REFRESH';

export const CASE_CONTACT_MODE_CHANGE = 'CASE_CONTACT_MODE_CHANGE';

export enum ViewChangeKind {
    SearchText = 'SEARCH_TEXT',
    PageEvent = 'PAGE_EVENT',
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    ToggleFieldSort = 'FIELD_SORT',
}
export enum RowItemChangeKind {
    IsExpand = 'IS_EXPAND',
    DoubleClick = 'DOUBLE_CLICK'
}

export class InitCaseContact extends TokenizeAction implements Action {
    readonly type = INIT_CASE_CONTACT;
    constructor(public token: string, public payload: {
        columnDef: ColumnDef[],
        matterInfo: MatterInfo,
        fromContact?: boolean,
        searchText?: string
    }) { super(token); }
}
export class CaseContactViewChange extends TokenizeAction implements Action {
    readonly type = CASE_CONTACT_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}

export class CaseContactRefresh extends TokenizeAction implements Action {
    readonly type = CASE_CONTACT_REFRESH;
    constructor(public token: string) { super(token); }
}

export class CaseContactModeChange extends TokenizeAction implements Action {
    readonly type = CASE_CONTACT_MODE_CHANGE;
    constructor(public token: string, public payload: { value: string }) { super(token); }
}

export class CaseContactGridRowChange extends TokenizeAction implements Action {
    readonly type = CASE_CONTACT_GRID_ROW_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowItemChangeKind,
        row: ContactItemWrapper, value: any
    }) { super(token); }
}

export class LoadCaseContactDataWithCurrentState extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_CONTACT_DATA_WITH_CURRENT_STATE;
    constructor(public token) { super(token); }
}
export class LoadCaseContactGridData extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_CONTACT_GRID_DATA;
    constructor(public token: string, public request: CaseContactRequest | MainContactRequest) { super(token); }
}

export class LoadCaseContactGridDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_CONTACT_GRID_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: {
        response: CaseContactResponse,
        contactTypeResponse: any, request: CaseContactRequest | MainContactRequest
    }) {
        super(token);
    }
}
export class LoadCaseContactGridDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_CASE_CONTACT_GRID_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { CaseContactList: CaseContact[] }) {
        super(token);
    }
}




export type Any = InitCaseContact | LoadCaseContactGridDataSuccess | LoadCaseContactGridDataFail | CaseContactModeChange
    | CaseContactViewChange | CaseContactGridRowChange | LoadCaseContactGridData | CaseContactRefresh
    ;
