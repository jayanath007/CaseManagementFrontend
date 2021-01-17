import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { PaginatorDef, ColumnDef, GridGroupData } from '../../core/lib/grid-model';
import {
    Group, Users, GridDataObject, GridFilterUpdate, GridData,
    GridButtonAction,
    Department
} from '../models/interfce';
import { GridRequest } from '../models/request';
import { ViewChangeKind } from '../models/enumeration';
import { MessageItemWrapper } from '../../mail-item-core/models/interface';
import { GroupMode } from '../models/enumeration';

export const INIT_POST_CODE = 'PC_INIT_POST_CODE';
export const POST_OFFICE_GRID_ROW_CHANGE = 'POST_OFFICE_GRID_ROW_CHANGE';


export const LOAD_DEPARTMENTS = 'PC_DPS_LOAD_DEPARTMENTS';
export const LOAD_DEPARTMENTS_SUCCESS = 'PC_DPS_LOAD_DEPARTMENT_SUCESS';
export const LOAD_DEPARTMENTS_FAIL = 'PC_DPS_LOAD_DEPARTMENT_FAIL';

export const LOAD_LOOOK_FOR = 'PC_DPS_LOAD_LOOOK_FOR';
export const LOAD_LOOOK_FOR_SUCCESS = 'PC_DPS_LOOOK_FORSUCESS';
export const LOAD_LOOOK_FOR_FAIL = 'PC_DPS_LOOOK_FOR_FAIL';

export const LOAD_PERIODS = 'PC_DPS_LOAD_PERIODS';
export const LOAD_PERIODS_SUCCESS = 'PC_LOAD_PERIODS_SUCESS';
export const LOAD_PERIODS_FAIL = 'PC_LOAD_PERIODS_FAIL';

export const REQUEST_GRID_DATA = 'PC_REQUEST_GRID_DATA';
export const LOAD_GRID_DATA = 'PC_LOAD_GRID_DATA';
export const LOAD_GRID_DATA_SUCCESS = 'PC_GRID_DATA_SUCCESS';
export const LOAD_GRID_DATA_FAIL = 'PC_LOAD_GRID_DATA_FAIL';
export const GRID_FILTER_UPDATE = 'PC_GRID_FILTER_UPDATE';

export const GRID_ROW_EXPAND = 'PC_GRID_ROW_EXPAND';
export const GRID_VIEW_CHANGE = 'PC_GRID_VIEW_CHANGE';
export const GRID_REFRESH = 'PC_GRID_REFRESH';

export const GET_DOCUMENT_URL = 'PC_GET_DOCUMENT_URL';
export const GET_DOCUMENT_URL_SUCCESS = 'PC_GET_DOCUMENT_URL_SUCCESS';
export const GET_DOCUMENT_URL_FAIL = 'PC_GET_DOCUMENT_URL_FAIL';

export const LOAD_EMAIL_ITEM = 'PC_LOAD_EMAIL_ITEM';
export const LOAD_EMAIL_ITEM_SUCCESS = 'PC_LOAD_EMAIL_ITEM_SUCCESS';
export const LOAD_EMAIL_ITEM_FAIL = 'PC_LOAD_EMAIL_ITEM_FAIL';

export const LOAD_DOCUMENT_WOPI_URL = 'PC_LOAD_DOCUMENT_WOPI_URL';
export const LOAD_DOCUMENT_PDF_URL = 'PC_LOAD_DOCUMENT_PDF_URL';
export const LOAD_CONCERTION_URL = 'PC_LOAD_CONCERTION_URL';

export const VIEW_DOC = 'PC_VIEW_DOC';
export const GET_DOC_PASSWORD = 'PC_GET_DOC_PASSWORD';
export const VALIDATE_PASSWORD = 'PC_VALIDATE_PASSWORD';
export const SET_DOC_PASSWORD = 'PC_SET_DOC_PASSWORD';
export const REMOVE_PASSWORD_REQUEST_ROW = 'PC_REMOVE_PASSWORD_REQUEST_ROW';
export const PASSWORD_INVALID = 'PC_PASSWORD_INVALID';

export const ALL_DATA_UPDATE = 'PC_ALL_DATA_UPDATE';

export const LOAD_WORK_DONE_GROUP = 'LOAD_WORK_DONE_GROUP';
export const LOAD_WORK_DONE_GROUP_SUCCESS = 'LOAD_WORK_DONE_GROUP_SUCCESS';
export const LOAD_WORK_DONE_GROUP_FAIL = 'LOAD_WORK_DONE_GROUP_FAIL';

export const GROUP_DATA = 'PC_GROUP_DATA';
export const GROUP_DATA_REQUEST = 'PC_GROUP_DATA_REQUEST';


export const DELETE_FILE_RECORD = 'PC_DELETE_FILE_RECORD';
export const DELETE_FILE_RECORD_SUCCESS = 'PC_DELETE_FILE_RECORD_SUCCESS';
export const DELETE_FILE_RECORD_FAIL = 'PC_DELETE_FILE_RECORD_FAIL';


export const GROUP_CHANGE = 'PC_GROUP_CHANGE';

export class InitPostOffice extends TokenizeAction implements Action {
    readonly type = INIT_POST_CODE;
    constructor(public token: string, public payload: {
        columnDef: ColumnDef[],
        paginatorDef: PaginatorDef
    }) { super(token); }
}




export class LoadGroups extends TokenizeAction implements Action {
    readonly type = LOAD_DEPARTMENTS;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadGroupsSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DEPARTMENTS_SUCCESS;
    constructor(public token: string, public payload: { items: Group[] }) {
        super(token);
    }
}
export class LoadGroupsFail extends TokenizeAction implements Action {
    readonly type = LOAD_DEPARTMENTS_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}


export class LoadLoookFor extends TokenizeAction implements Action {
    readonly type = LOAD_LOOOK_FOR;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadLoookForSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_LOOOK_FOR_SUCCESS;
    constructor(public token: string, public payload: { items: Group[] }) {
        super(token);
    }
}
export class LoadLoookForFail extends TokenizeAction implements Action {
    readonly type = LOAD_LOOOK_FOR_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}


export class LoadUsers extends TokenizeAction implements Action {
    readonly type = LOAD_PERIODS;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadUsersSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_PERIODS_SUCCESS;
    constructor(public token: string, public payload: { items: Users[] }) {
        super(token);
    }
}
export class LoadUsersFail extends TokenizeAction implements Action {
    readonly type = LOAD_PERIODS_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}



export class PostOfficeGridRowChange extends TokenizeAction implements Action {
    readonly type = POST_OFFICE_GRID_ROW_CHANGE;
    constructor(public token: string, public payload: GridButtonAction) { super(token); }
}






export class DeleteFileRecord extends TokenizeAction implements Action {
    readonly type = DELETE_FILE_RECORD;
    constructor(public token: string, public payload: { gridRow: GridData }) {
        super(token);
    }
}

export class DeleteFileRecordSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_FILE_RECORD_SUCCESS;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}
export class DeleteFileRecordFail extends TokenizeAction implements Action {
    readonly type = DELETE_FILE_RECORD_FAIL;
    constructor(public token: string, public payload: {}) {
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
    constructor(public token: string, public payload: { pageData: GridDataObject, gridGroupData?: GridGroupData }) { super(token); }
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




export class GetEmailItem extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM;
    constructor(public token: string, public request: GridData) {
        super(token);
    }
}
export class GetEmailItemSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM_SUCCESS;
    constructor(public token: string, public payload: { emailItem: MessageItemWrapper, row: GridData }) {
        super(token);
    }
}

export class LoadWopiURL extends TokenizeAction implements Action {
    readonly type = LOAD_DOCUMENT_WOPI_URL;
    constructor(public token: string, public request: GridData) { super(token); }
}

export class LoadPDFiURL extends TokenizeAction implements Action {
    readonly type = LOAD_DOCUMENT_PDF_URL;
    constructor(public token: string, public request: GridData) { super(token); }
}

export class LoadConversionURL extends TokenizeAction implements Action {
    readonly type = LOAD_CONCERTION_URL;
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


export type Any = InitPostOffice | PostOfficeGridRowChange |
    DeleteFileRecord | DeleteFileRecordFail | DeleteFileRecordSuccess |
    LoadGroups | LoadGroupsSuccess | LoadGroupsFail |
    LoadLoookFor | LoadLoookForSuccess | LoadLoookForFail |
    LoadUsers | LoadUsersSuccess | LoadUsersFail |
    GridDataRequest | LoadGrid | LoadGridSuccess | LoadGridFail | GridFilterChange | GridRowExpand |
    GridViewChange | GridRefresh |
    GetDocURL | GetDocURLSuccess | GetDocURLFail |
    GetEmailItemSuccess | ViewDoc | GetDocPassword | SetPassword | RemovePaswordRequestRow |
    PaswordInvalid | AllDataUpdate | GroupData | GroupDataRequest
    | LoadDepartments | LoadDepartmentsSuccess | LoadDepartmentsFail;






