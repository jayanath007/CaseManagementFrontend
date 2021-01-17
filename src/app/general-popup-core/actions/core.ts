import { } from '../models/interfaces';
import { State } from '../reducers';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
// import { extend } from 'webdriver-js-extender';
import { } from '../models/interfaces';
import { GeneralSearchRequest } from '../models/requests';
import { PaginatorDef, ColumnDef } from '../../core/lib/grid-model';
import { PDFBundleCaseFileIdentityWithAppIdRequestViewModel } from '../../bundling-desktop/containers/bundling-existing-manager.component.component';


export const INIT_GENERAL_POPUP = 'INIT_GENERAL_POPUP';
export const INIT_GENERAL_POPUP_SUCCESS = 'INIT_GENERAL_POPUP_SUCCESS';
export const INIT_GENERAL_POPUP_FAIL = 'INIT_GENERAL_POPUP_FAIL';
export const LOAD_GENERAL_POPUP = 'LOAD_GENERAL_POPUP';
export const GENERAL_SEARCH_TEXT_CHANGE = 'GENERAL_SEARCH_TEXT_CHANGE';
export const LOAD_GENERAL_POPUP_DATA = 'LOAD_GENERAL_POPUP_DATA';
export const LOAD_GENERAL_POPUP_DATA_SUCCESS = 'LOAD_GENERAL_POPUP_DATA_SUCCESS';
export const LOAD_GENERAL_POPUP_DATA_FAIL = 'LOAD_GENERAL_POPUP_DATA_FAIL';
export const CHANGE_PAGE = 'GENERAL_POPUP_CHANGE_PAGE';
export const LOAD_DATA = 'GENERAL_POPUP_LOAD_DATA';
export const TOGGLE_SORTING = 'GENERAL_POPUP_TOGGLE_SORTING';

export class InitGeneralPopup extends TokenizeAction implements Action {
    readonly type = INIT_GENERAL_POPUP;
    constructor(public token: string, public payload: {
        generalPopupColumn: ColumnDef[],
        generalPaginatorDef: PaginatorDef,
        searchText: string,
        sitePath: string,
        isFrontEndFilter: boolean,
        request: PDFBundleCaseFileIdentityWithAppIdRequestViewModel
    }) {
        super(token);
    }
}


export class LoadGeneralPopup extends TokenizeAction implements Action {
    readonly type = LOAD_GENERAL_POPUP;
    constructor(public token: string, public payload: { request: any }) {
        super(token);
    }
}

export class InitGeneralPopupSuccess extends TokenizeAction implements Action {
    readonly type = INIT_GENERAL_POPUP_SUCCESS;
    constructor(public token: string, public payload: { generalPopupList: any }) {
        super(token);
    }
}

export class InitGeneralPopupFail extends TokenizeAction implements Action {
    readonly type = INIT_GENERAL_POPUP_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GeneralSearchTextChange extends TokenizeAction implements Action {
    readonly type = GENERAL_SEARCH_TEXT_CHANGE;
    constructor(public token, public payload: { searchText: string, }) {
        super(token);
    }
}

export class LoadGeneralPopupData extends TokenizeAction implements Action {
    readonly type = LOAD_GENERAL_POPUP_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadGeneralPopupDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_GENERAL_POPUP_DATA_SUCCESS;
    constructor(public token: string, public payload: { generalPopupList: any }) { super(token); }
}

export class LoadGeneralPopupDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_GENERAL_POPUP_DATA_FAIL;
    constructor(public token: string) { super(token); }
}

export class ChangePage extends TokenizeAction implements Action {
    readonly type = CHANGE_PAGE;
    constructor(public token: string, public payload: { pageDef: PaginatorDef }) {
        super(token);
    }
}

export class ToggleSorting extends TokenizeAction implements Action {
    readonly type = TOGGLE_SORTING;
    constructor(public token: string, public payload: { colDef: ColumnDef }) {
        super(token);
    }
}


export type Any = InitGeneralPopup | InitGeneralPopupSuccess | InitGeneralPopupFail | GeneralSearchTextChange | LoadGeneralPopup |

    LoadGeneralPopupDataSuccess | LoadGeneralPopupDataFail | LoadGeneralPopupData | ChangePage | ToggleSorting;



