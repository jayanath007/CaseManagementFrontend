import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { UpdateCol, DropdownListData } from '../models/interface';
import { Operator, ViewChangeKind } from '../models/enum';
import { GridDocumentData } from '../../core/lib/matter';



export const INIT_GLOBAL_DOCUMENT_SEARCH = 'INIT_GLOBAL_DOCUMENT_SEARCH';

export const GET_GLOBAL_DOCUMENT_URL = 'GET_GLOBAL_DOCUMENT_URL';
export const GET_GLOBAL_DOCUMENT_URL_SUCCESS = 'GET_GLOBAL_DOCUMENT_URL_SUCCESS';
export const GET_GLOBAL_DOCUMENT_URL_FAIL = 'GET_GLOBAL_DOCUMENT_URL_FAIL';

export const LOAD_DOCUMENT_DATA = 'LOAD_DOCUMENT_DATA';
export const LOAD_DOCUMENT_DATA_SUCCESS = 'LOAD_DOCUMENT_DATA_SUCCESS';
export const LOAD_DOCUMENT_DATA_FAIL = 'LOAD_DOCUMENT_DATA_FAIL';

export const ADD_DOCUMENT_FILTER_ROW = 'ADD_DOCUMENT_FILTER_ROW';
export const REMOVE_DOCUMENT_FILTER_ROW = 'REMOVE_DOCUMENT_FILTER_ROW';
export const FILTER_ITEM_CHANGE = 'FILTER_ITEM_CHANGE';

export const GLOBAL_SEARCH_CHANGE_SEARCH_TEXT = 'GLOBAL_SEARCH_CHANGE_SEARCH_TEXT';

export const GET_GLOBAL_DOC_FEE_EARNER_LIST = 'GET_GLOBAL_DOC_FEE_EARNER_LIST';
export const GET_GLOBAL_DOC_FEE_EARNER_LIST_SUCCESS = 'GET_GLOBAL_DOC_FEE_EARNER_LIST_SUCCESS';
export const GET_GLOBAL_DOC_FEE_EARNER_LIST_FAIL = 'GET_GLOBAL_DOC_FEE_EARNER_LIST_FAIL';

export const GET_GLOBAL_DOC_APP_CODE_LIST = 'GET_GLOBAL_DOC_APP_CODE_LIST';
export const GET_GLOBAL_DOC_APP_CODE_LIST_SUCCESS = 'GET_GLOBAL_DOC_APP_CODE_LIST_SUCCESS';
export const GET_GLOBAL_DOC_APP_CODE_LIST_FAIL = 'GET_GLOBAL_DOC_APP_CODE_LIST_FAIL';

export const CLOSE_DOCUMENT_VIEWER = 'CLOSE_DOCUMENT_VIEWER';
export const REMOVE_FILTER_ROW = 'REMOVE_FILTER_ROW';

export const GRID_VIEW_CHANGE = 'GRID_VIEW_CHANGE';
export const GLOBAL_SEARCH_DOCUMENT_CLEAR = 'GLOBAL_SEARCH_DOCUMENT_CLEAR';
export const GLOBAL_SEARCH_DOCUMENT_REFRESH = 'GLOBAL_SEARCH_DOCUMENT_REFRESH';

export const GET_GLOBAL_SEARCH_DOCUMENT_POPUP_URL = 'GET_GLOBAL_SEARCH_DOCUMENT_POPUP_URL';
export const GET_GLOBAL_DOCUMENT_POPUP_URL_SUCCESS = 'GET_GLOBAL_DOCUMENT_POPUP_URL_SUCCESS';
export const GET_GLOBAL_DOCUMENT_POPUP_URL_FAIL = 'GET_GLOBAL_DOCUMENT_POPUP_URL_FAIL';

export const LOAD_WEB_VIEW_URL = 'DPS_GLOBAL_SEARCH_LOAD_WEB_VIEW_URL';

export const LOAD_GLOBAL_DOCUMENT_EMAIL_ITEM_FROM_DIARY = 'LOAD_GLOBAL_DOCUMENT_EMAIL_ITEM_FROM_DIARY';

export const LOAD_GLOBAL_SEARCH_DOCUMENT_DOCUMENT_URL_LOAD = 'LOAD_GLOBAL_SEARCH_DOCUMENT_DOCUMENT_URL_LOAD';

export const GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA = 'GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA';
export const GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA_SUCCESS = 'GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA_SUCCESS';
export const GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA_FAIL = 'GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA_FAIL';

export const GET_GLOBAL_DOCUMENT_SHARE_DATA = 'GET_GLOBAL_DOCUMENT_SHARE_DATA';
export const GET_GLOBAL_DOCUMENT_SHARE_DATA_SUCCESS = 'GET_GLOBAL_DOCUMENT_SHARE_DATA_SUCCESS';
export const GET_GLOBAL_DOCUMENT_SHARE_DATA_FAIL = 'GET_GLOBAL_DOCUMENT_SHARE_DATA_FAIL';


export class InitGlobalDocumentSearch extends TokenizeAction implements Action {
    readonly type = INIT_GLOBAL_DOCUMENT_SEARCH;
    constructor(public token: string, public payload: {
        columnDef: ColumnDef[],
        paginatorDef: PaginatorDef
        filterOperate: { textOperators: { id: Operator, label: string }[], dateOperators: { id: Operator, label: string }[] }
    }) { super(token); }
}



export class GetGlobalDocURL extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_URL;
    constructor(public token: string, public payload: { gridRowUrlRequest: GridDocumentData }) {
        super(token);
    }
}
export class GetGlobalDocURLSuccess extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_URL_SUCCESS;
    constructor(public token: string, public payload: { gridRow: GridDocumentData, url: string }) {
        super(token);
    }
}
export class GetGlobalDocURLFail extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_URL_FAIL;
    constructor(public token: string, public payload: { gridRow: GridDocumentData, url: string }) {
        super(token);
    }
}


export class LoadDocumentData extends TokenizeAction implements Action {
    readonly type = LOAD_DOCUMENT_DATA;
    constructor(public token: string, public payload: { searchButton: boolean }) { super(token); }
}

export class LoadDocumentDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DOCUMENT_DATA_SUCCESS;
    constructor(public token: string, public payload: { data: any }) { super(token); }
}

export class LoadDocumentDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_DOCUMENT_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class AddDocumentFilterRow extends TokenizeAction implements Action {
    readonly type = ADD_DOCUMENT_FILTER_ROW;
    constructor(public token: string) {
        super(token);
    }
}

export class RemoveDocumentFilterRow extends TokenizeAction implements Action {
    readonly type = REMOVE_DOCUMENT_FILTER_ROW;
    constructor(public token: string) {
        super(token);
    }
}

export class GridViewChange extends TokenizeAction implements Action {
    readonly type = GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class FilterItemChange extends TokenizeAction implements Action {
    readonly type = FILTER_ITEM_CHANGE;
    constructor(public token: string, public payload: { rowId: number, changeValue: any, changeCol: UpdateCol }) { super(token); }
}

export class GetGlobalDocFeeEarnerList extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOC_FEE_EARNER_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetGlobalDocFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOC_FEE_EARNER_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetGlobalDocFeeEarnerListFail extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOC_FEE_EARNER_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export class GetGlobalDocAppCodeList extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOC_APP_CODE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetGlobalDocAppCodeListSuccess extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOC_APP_CODE_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetGlobalDocAppCodeListFail extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOC_APP_CODE_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }


}
export class GlobalSearchChangeSearchText extends TokenizeAction implements Action {
    readonly type = GLOBAL_SEARCH_CHANGE_SEARCH_TEXT;
    constructor(public token: string, public payload: { searchText: string }) { super(token); }
}

export class CloseDocumentViewer extends TokenizeAction implements Action {
    readonly type = CLOSE_DOCUMENT_VIEWER;
    constructor(public token: string) {
        super(token);
    }
}

export class RemoveFilterRow extends TokenizeAction implements Action {
    readonly type = REMOVE_FILTER_ROW;
    constructor(public token: string, public payload: { filterRowId: number }) { super(token); }
}

export class GlobalSearchDocumentClear extends TokenizeAction implements Action {
    readonly type = GLOBAL_SEARCH_DOCUMENT_CLEAR;
    constructor(public token: string) {
        super(token);
    }
}

export class GlobalSearchDocumentRefresh extends TokenizeAction implements Action {
    readonly type = GLOBAL_SEARCH_DOCUMENT_REFRESH;
    constructor(public token: string) {
        super(token);
    }
}

export class GetGlobalSearchDocumentPopupUrl extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_SEARCH_DOCUMENT_POPUP_URL;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadGlobalDocumentDocumentURL extends TokenizeAction implements Action {
    readonly type = LOAD_GLOBAL_SEARCH_DOCUMENT_DOCUMENT_URL_LOAD;
    constructor(public token: string, public request: GridDocumentData) { super(token); }
}

export class GetGlobalSearchDocumentPopupUrlSuccess extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_POPUP_URL_SUCCESS;
    constructor(public token: string, public payload: { popupUrl: string, request: GridDocumentData }) {
        super(token);
    }
}

export class GetGlobalSearchDocumentPopupUrlFail extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_POPUP_URL_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}

export class LoadWebViewUrl extends TokenizeAction implements Action {
    readonly type = LOAD_WEB_VIEW_URL;
    constructor(public token: string, public request: GridDocumentData) { super(token); }
}
export class GetGlobalDocumentEmailItemForMSG extends TokenizeAction implements Action {
    readonly type = LOAD_GLOBAL_DOCUMENT_EMAIL_ITEM_FROM_DIARY;
    constructor(public token: string, public request: GridDocumentData) {
        super(token);
    }
}

export class GetGlobalDocumentMenuOpenCaseData extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA;
    constructor(public token: string, public payload: { openCaseRequestData: GridDocumentData }) {
        super(token);
    }
}
export class GetGlobalDocumentMenuOpenCaseDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA_SUCCESS;
    constructor(public token: string, public payload: { inputData: any }) {
        super(token);
    }
}
export class GetGlobalDocumentMenuOpenCaseDataFail extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) {
        super(token);
    }
}

export class GetGlobalDocumentShareData extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_SHARE_DATA;
    constructor(public token: string, public payload: { shareRequestData: GridDocumentData }) {
        super(token);
    }
}
export class GetGlobalDocumentShareDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_SHARE_DATA_SUCCESS;
    constructor(public token: string, public payload: { inputData: any }) {
        super(token);
    }
}
export class GetGlobalDocumentShareDataFail extends TokenizeAction implements Action {
    readonly type = GET_GLOBAL_DOCUMENT_SHARE_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) {
        super(token);
    }



}


















export type Any = InitGlobalDocumentSearch | GetGlobalDocURL | GetGlobalDocURLSuccess | GetGlobalDocURLFail |
    LoadDocumentData | LoadDocumentDataSuccess | LoadDocumentDataFail | AddDocumentFilterRow | RemoveDocumentFilterRow |
    FilterItemChange | GetGlobalDocFeeEarnerList | GetGlobalDocFeeEarnerListSuccess | GetGlobalDocFeeEarnerListFail |
    GetGlobalDocAppCodeList | GetGlobalDocAppCodeListSuccess | GlobalSearchChangeSearchText |
    GetGlobalDocAppCodeListFail | CloseDocumentViewer | RemoveFilterRow | GridViewChange | GlobalSearchDocumentClear |
    GlobalSearchDocumentRefresh | GetGlobalSearchDocumentPopupUrl | GetGlobalSearchDocumentPopupUrlSuccess |
    GetGlobalSearchDocumentPopupUrlFail | GetGlobalDocumentEmailItemForMSG |
    GetGlobalDocumentMenuOpenCaseData | GetGlobalDocumentMenuOpenCaseDataSuccess | GetGlobalDocumentMenuOpenCaseDataFail |
    GetGlobalDocumentShareData | GetGlobalDocumentShareDataSuccess | GetGlobalDocumentShareDataFail;
