
import {
    DropdownListData, MatterResponse, Branch
} from '../models/interfaces';
import { Action } from '@ngrx/store'; // MatterViews
import { TokenizeAction } from '../../core';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { SerchInfoResponce, AdvanceSearchRequest } from '../models/requests';
import { ViewChangeKind } from '../models/enums';


export const INIT_ADVANCED_SEARCH_VIEW = 'DPS_INIT_ADVANCED_SEARCH_VIEW';

export const GET_CLIENT_LIST_ADVANCED_SEARCH = 'DPS_GET_CLIENT_LIST_ADVANCED_SEARCH';
export const GET_CLIENT_LIST_ADVANCED_SEARCH_SUCCESS = 'DPS_GET_CLIENT_LIST_ADVANCED_SEARCH_SUCCESS';
export const GET_CLIENT_LIST_ADVANCED_SEARCH_FAIL = 'DPS_GET_CLIENT_LIST_ADVANCED_SEARCH_FAIL';

export const GET_ADVANCED_SEARCH_HEADERS = 'DPS_GET_ADVANCED_SEARCH_HEADERS';
export const GET_ADVANCED_SEARCH_HEADERS_SUCCESS = 'DPS_GET_ADVANCED_SEARCH_HEADERS_SUCCESS';
export const GET_ADVANCED_SEARCH_HEADERS_FAIL = 'DPS_GET_ADVANCED_SEARCH_HEADERS_FAIL';

export const GET_MATTER_ADVANCED_LOADING_INFO = 'DPS_GET_MATTER_ADVANCED_LOADING_INFO';
export const GET_MATTER_ADVANCED_LOADING_INFO_SUCCESS = 'DPS_GET_MATTER_ADVANCED_LOADING_INFO_SUCCESS';
export const GET_MATTER_ADVANCED_LOADING_INFO_FAIL = 'DPS_GET_MATTER_ADVANCED_LOADING_INFO_FAIL';

export const LOAD_ADVANCED_SEARCH_DATA = 'DPS_LOAD_ADVANCED_SEARCH_DATA';
export const LOAD_ADVANCED_SEARCH_DATA_SUCCESS = 'DPS_LOAD_ADVANCED_SEARCH_DATA_SUCCESS';
export const LOAD_ADVANCED_SEARCH_DATA_FAIL = 'DPS_LOAD_ADVANCED_SEARCH_DATA_FAIL';

export const LOAD_APP_CODE_DATA = 'DPS_LOAD_APP_CODE_DATA_DATA';
export const LOAD_APP_CODE_DATA_SUCCESS = 'DPS_LOAD_APP_CODE_DATA_SUCCESS';
export const LOAD_APP_CODE_DATA_FAIL = 'DPS_LOAD_APP_CODE_DATA_FAIL';

export const CHANGE_COLUMN_HEADER = 'DPS_CHANGE_COLUMN_HEADER';
export const CHANGE_COLUMN_HEADER_SUCCESS = 'DPS_CHANGE_COLUMN_HEADER_SUCCESS';
export const CHANGE_COLUMN_HEADER_FAIL = 'DPS_CHANGE_COLUMN_HEADER_FAIL';

export const ADVANCED_SEARCH_VIEW_CHANGE = 'DPS_ADVANCED_SEARCH_VIEW_CHANGE';

export const ADVANCED_SEARCH_APP_CODE_CHANGE = 'DPS_ADVANCED_SEARCH_APP_CODE_CHANGE';

export const ADVANCED_SEARCH_SET_COLOUMN_HEADERS = 'DPS_ADVANCED_SEARCH_SET_COLOUMN_HEADERS';

export const REQUEST_ADVANCED_GRID_DATA = 'DPS_REQUEST_ADVANCED_GRID_DATA';

export const GET_BRANCH_LIST_ADVANCED_SEARCH = 'DPS_GET_BRANCH_LIST_ADVANCED_SEARCH';
export const GET_BRANCH_LIST_ADVANCED_SEARCH_SUCCESS = 'DPS_GET_BRANCH_LIST_ADVANCED_SEARCH_SUCCESS';
export const GET_BRANCH_LIST_ADVANCED_SEARCH_FAIL = 'DPS_GET_BRANCH_LIST_ADVANCED_SEARCH_FAIL';

export const ADVANCED_SEARCH_COLOUMN_RIGHT_CLICK = 'DPS_ADVANCED_SEARCH_COLOUMN_RIGHT_CLICK';

export const ADVANCED_SEARCH_OPEN_CASE = 'DPS_ADVANCED_SEARCH_OPEN_CASE';

export const CLOSE_ADVANCED_SEARCH = 'DPS_CLOSE_ADVANCED_SEARCH';
export const ADVANCED_SEARCH_SAVE_BRANCH_SUCCESS = 'DPS_ADVANCED_SEARCH_SAVE_BRANCH_SUCCESS';
export const ADVANCED_SEARCH_SAVE_BRANCH_FAIL = 'DPS_ADVANCED_SEARCH_SAVE_BRANCH_FAIL';

export const ADVANCED_SEARCH_GRID_VIEW_CHANGE = 'DPS_ADVANCED_SEARCH_GRID_VIEW_CHANGE';






export class InitAdvancedSearchView extends TokenizeAction implements Action {
    readonly type = INIT_ADVANCED_SEARCH_VIEW;
    constructor(public token: string, public payload: {
        columnDef: ColumnDef[],
        paginatorDef: PaginatorDef,
    }) { super(token); }
}



export class GetMatterSearchAdvancedLoadingInfo extends TokenizeAction implements Action {
    readonly type = GET_MATTER_ADVANCED_LOADING_INFO;
    constructor(public token: string) {
        super(token);
    }
}
export class GetMatterSearchAdvancedLoadingInfoSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTER_ADVANCED_LOADING_INFO_SUCCESS;
    constructor(public token: string, public payload: SerchInfoResponce
    ) {
        super(token);
    }
}
export class GetMatterSearchAdvancedLoadingInfoFail extends TokenizeAction implements Action {
    readonly type = GET_MATTER_ADVANCED_LOADING_INFO_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}



export class GetClientListAdvancedSearch extends TokenizeAction implements Action {
    readonly type = GET_CLIENT_LIST_ADVANCED_SEARCH;
    constructor(public token: string) {
        super(token);
    }
}
export class GetClientListAdvancedSearchSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLIENT_LIST_ADVANCED_SEARCH_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetClientListAdvancedSearchFail extends TokenizeAction implements Action {
    readonly type = GET_CLIENT_LIST_ADVANCED_SEARCH_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetBranchListAdvancedSearch extends TokenizeAction implements Action {
    readonly type = GET_BRANCH_LIST_ADVANCED_SEARCH;
    constructor(public token: string) {
        super(token);
    }
}
export class GetBranchListAdvancedSearchSuccess extends TokenizeAction implements Action {
    readonly type = GET_BRANCH_LIST_ADVANCED_SEARCH_SUCCESS;
    constructor(public token: string, public payload: Branch[]) {
        super(token);
    }
}
export class GetBranchListAdvancedSearchFail extends TokenizeAction implements Action {
    readonly type = GET_BRANCH_LIST_ADVANCED_SEARCH_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetAppCodeData extends TokenizeAction implements Action {
    readonly type = LOAD_APP_CODE_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class GetAppCodeDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_APP_CODE_DATA_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetAppCodeDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_APP_CODE_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetAdvancedSearchHeaders extends TokenizeAction implements Action {
    readonly type = GET_ADVANCED_SEARCH_HEADERS;
    constructor(public token: string, public payload: {
        branchId: number, appId: number,
        searchColumnOption: string, matterSearchMode: string
    }) {
        super(token);
    }
}
export class GetAdvancedSearchHeadersSuccess extends TokenizeAction implements Action {
    readonly type = GET_ADVANCED_SEARCH_HEADERS_SUCCESS;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class GetAdvancedSearchHeadersFail extends TokenizeAction implements Action {
    readonly type = GET_ADVANCED_SEARCH_HEADERS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class RequestAdvancedGridData extends TokenizeAction implements Action {
    readonly type = REQUEST_ADVANCED_GRID_DATA;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadAdvanceSearchData extends TokenizeAction implements Action {
    readonly type = LOAD_ADVANCED_SEARCH_DATA;
    constructor(public token: string, public request: AdvanceSearchRequest) { super(token); }
}

export class LoadAdvanceSearchDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ADVANCED_SEARCH_DATA_SUCCESS;
    constructor(public token: string, public payload: { response: MatterResponse, request: any }) { super(token); }
}
export class LoadAdvanceSearchDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_ADVANCED_SEARCH_DATA_FAIL;
    constructor(public token: string, error: any) { super(token); }
}

export class ChangeColoumHeader extends TokenizeAction implements Action {
    readonly type = CHANGE_COLUMN_HEADER;
    constructor(public token: string, public request: AdvanceSearchRequest) { super(token); }
}

export class ChangeColoumHeaderSuccess extends TokenizeAction implements Action {
    readonly type = CHANGE_COLUMN_HEADER_SUCCESS;
    constructor(public token: string, public payload: { response: any, request: any }) { super(token); }
}
export class ChangeColoumHeaderFail extends TokenizeAction implements Action {
    readonly type = CHANGE_COLUMN_HEADER_FAIL;
    constructor(public token: string, error: any) { super(token); }
}

export class AdvancedSearchViewChange extends TokenizeAction implements Action {
    readonly type = ADVANCED_SEARCH_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}

export class AdvancedSearchGridViewChange extends TokenizeAction implements Action {
    readonly type = ADVANCED_SEARCH_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}


export class AdvancedSearchAppCodeChange extends TokenizeAction implements Action {
    readonly type = ADVANCED_SEARCH_APP_CODE_CHANGE;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}

export class AdvancedSetColoumHeaders extends TokenizeAction implements Action {
    readonly type = ADVANCED_SEARCH_SET_COLOUMN_HEADERS;
    constructor(public token: string, public payload: { headers: string[] }) { super(token); }
}

export class AdvancedSearchColoumnRightClick extends TokenizeAction implements Action {
    readonly type = ADVANCED_SEARCH_COLOUMN_RIGHT_CLICK;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}
export class AdvancedSearchOpenCase extends TokenizeAction implements Action {
    readonly type = ADVANCED_SEARCH_OPEN_CASE;
    constructor(public token: string, public payload: any) { super(token); }
}

export class CloseAdvancedSearch extends TokenizeAction implements Action {
    readonly type = CLOSE_ADVANCED_SEARCH;
    constructor(public token: string) {
        super(token);
}
}

export class AdvancedSearchSaveBranchSuccess extends TokenizeAction implements Action {
    readonly type = ADVANCED_SEARCH_SAVE_BRANCH_SUCCESS;
    constructor(public token: string, public responce: any) {
        super(token);
    }
}
export class AdvancedSearchSaveBranchFail extends TokenizeAction implements Action {
    readonly type = ADVANCED_SEARCH_SAVE_BRANCH_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}



export type Any = InitAdvancedSearchView | GetClientListAdvancedSearch | GetClientListAdvancedSearchSuccess |
    GetClientListAdvancedSearchFail | GetAdvancedSearchHeaders | GetAdvancedSearchHeadersSuccess |
    GetAdvancedSearchHeadersFail | GetMatterSearchAdvancedLoadingInfo | GetMatterSearchAdvancedLoadingInfoSuccess |
    GetMatterSearchAdvancedLoadingInfoFail| RequestAdvancedGridData | LoadAdvanceSearchDataSuccess | LoadAdvanceSearchDataFail
     | LoadAdvanceSearchData |
    GetAppCodeData | GetAppCodeDataFail | GetAppCodeDataSuccess | ChangeColoumHeader
    | ChangeColoumHeaderSuccess | ChangeColoumHeaderFail | AdvancedSearchViewChange |
    AdvancedSearchAppCodeChange | AdvancedSetColoumHeaders | GetBranchListAdvancedSearch |
     GetBranchListAdvancedSearchSuccess |
    GetBranchListAdvancedSearchFail | AdvancedSearchColoumnRightClick | AdvancedSearchOpenCase | CloseAdvancedSearch
    | AdvancedSearchSaveBranchSuccess | AdvancedSearchSaveBranchFail | AdvancedSearchGridViewChange;


