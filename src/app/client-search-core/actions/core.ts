import { ClientGridData, ClientSearchPopupData, MatterViewModel } from '../models/interfaces';
import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { ClientSearchRequest, ClientPopupRequest } from '../models/requests';
import { ClientSearchResponse, ClientGridRowRapper, MatterGridRowRapper, MatterExpandData } from '../models/interfaces';
import { ClientSearchKind } from '../models/enums';


export const INIT_CLIENT_SEARCH = 'INIT_CLIENT_SEARCH';
// export const INIT_CLIENT_SEARCH_SUCCESS = 'INIT_CLIENT_SEARCH_SUCCESS';
// export const INIT_CLIENT_SEARCH_FAIL = 'INIT_CLIENT_SEARCH_FAIL';

export const CLIENT_SEARCH_SUBMIT = 'CLIENT_SEARCH_SUBMIT';

export const CLIENT_SEARCH_TEXT_CHANGE = 'CLIENT_SEARCH_TEXT_CHANGE';
export const CLIENT_SEARCH_TEXT_CHANGE_REJECT = 'CLIENT_SEARCH_TEXT_CHANGE_REJECT';
export const CLIENT_SEARCH_SUBMIT_SUCCESS = 'CLIENT_SEARCH_SUBMIT_SUCCESS';
export const CLIENT_SEARCH_TEXT_CHANGE_EMPTY = 'CLIENT_SEARCH_TEXT_CHANGE_EMPTY';

export const LOAD_CLIENT_SEARCH_GRID_DATA = 'LOAD_CLIENT_SEARCH_GRID_DATA';
export const LOAD_CLIENT_SEARCH_GRID_DATA_SUCCESS = 'LOAD_CLIENT_SEARCH_GRID_DATA_SUCCESS';
export const LOAD_CLIENT_SEARCH_GRID_DATA_FAIL = 'LOAD_CLIENT_SEARCH_GRID_DATA_FAIL';

export const TOGGLE_CLIENT_ROW_EXPAND = 'TOGGLE_CLIENT_ROW_EXPAND';
export const TOGGLE_MATTER_ROW_EXPAND = 'TOGGLE_MATTER_ROW_EXPAND';
export const GRID_REFRESH = 'CS_GRID_REFRESH';

export const LOAD_CLIENT_SEARCH_POPUP_DATA = 'LOAD_CLIENT_SEARCH_POPUP_DATA';
export const LOAD_CLIENT_SEARCH_POPUP_DATA_SUCCESS = 'LOAD_CLIENT_SEARCH_POPUP_DATA_SUCCESS';
export const LOAD_CLIENT_SEARCH_POPUP_DATA_FAIL = 'LOAD_CLIENT_SEARCH_POPUP_DATA_FAIL';
export const LOAD_POPUP_CLIENT_DATA = 'LOAD_POPUP_CLIENT_DATA';
export const LOAD_OPPORTUNITY_POPUP_CLIENT_DATA = 'DPS_LOAD_OPPORTUNITY_POPUP_CLIENT_SEARCH_DATA';
export const EXIT_CLIENT_SEARCH_POPUP = 'EXIT_CLIENT_SEARCH_POPUP';

export const GET_MATTERS = 'CLIENT_SEARCH_GET_MATTERS';
export const GET_MATTERS_SUCESS = 'CLIENT_SEARCH_GET_MATTERS_SUCESS';
export const GET_MATTERS_FAIL = 'CLIENT_SEARCH_GET_MATTERS_FAIL';
export const CHANGE_MATTERS_PAGE = 'CLIENT_SEARCH_CHANGE_MATTERS_PAGE';

export class InitClientSearch extends TokenizeAction implements Action {
    readonly type = INIT_CLIENT_SEARCH;
    constructor(public token, public payload: {
        clientColumnDef: ColumnDef[],
        clientPaginatorDef: PaginatorDef,
        clientSearchpopupColumn: ColumnDef[],
        matterColumnDef: ColumnDef[],
        isPopup: boolean,
        clientSearchData: ClientSearchPopupData,
    }) { super(token); }
}

export class ClientSearchSubmit extends TokenizeAction implements Action {
    readonly type = CLIENT_SEARCH_SUBMIT;
    constructor(public token, public payload: { kind: ClientSearchKind, value: any }) { super(token); }
}
export class ClientSearchTextChange extends TokenizeAction implements Action {
    readonly type = CLIENT_SEARCH_TEXT_CHANGE;
    constructor(public token, public payload: { searchText: string }) { super(token); }
}
export class ClientSearchTextChangeReject extends TokenizeAction implements Action {
    readonly type = CLIENT_SEARCH_TEXT_CHANGE_REJECT;
    constructor(public token) { super(token); }
}
export class ClientSearchSubmitSuccess extends TokenizeAction implements Action {
    readonly type = CLIENT_SEARCH_SUBMIT_SUCCESS;
    constructor(public token) { super(token); }
}
export class ClientSearchTextChangeEmpty extends TokenizeAction implements Action {
    readonly type = CLIENT_SEARCH_TEXT_CHANGE_EMPTY;
    constructor(public token) { super(token); }
}

export class LoadClientSearchGridData extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT_SEARCH_GRID_DATA;
    constructor(public token: string, public payload: { request: ClientSearchRequest }) { super(token); }
}

export class LoadClientSearchGridDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT_SEARCH_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { responce: ClientSearchResponse }) { super(token); }
}

export class LoadClientSearchGridDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT_SEARCH_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) { super(token); }
}

export class ExpandClientRow extends TokenizeAction implements Action {
    readonly type = TOGGLE_CLIENT_ROW_EXPAND;
    constructor(public token: string, public payload: { client: ClientGridRowRapper }) { super(token); }
}

export class ExpandMatterRow extends TokenizeAction implements Action {
    readonly type = TOGGLE_MATTER_ROW_EXPAND;
    constructor(public token: string, public payload: { row: MatterExpandData }) { super(token); }
}

export class GridRefresh extends TokenizeAction implements Action {
    readonly type = GRID_REFRESH;
    constructor(public token) { super(token); }
}

export class LoadClientSearchPopupData extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT_SEARCH_POPUP_DATA;
    constructor(public token: string, public payload: { request: ClientPopupRequest }) { super(token); }
}

export class LoadClientSearchPopupDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT_SEARCH_POPUP_DATA_SUCCESS;
    constructor(public token: string, public payload: { responce: any }) { super(token); }
}

export class LoadPopupClientData extends TokenizeAction implements Action {
    readonly type = LOAD_POPUP_CLIENT_DATA;
    constructor(public token: string) { super(token); }
}
export class LoadOpportunityPopupClientData extends TokenizeAction implements Action {
    readonly type = LOAD_OPPORTUNITY_POPUP_CLIENT_DATA;
    constructor(public token: string) { super(token); }
}
export class LoadClientSearchPopupDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT_SEARCH_POPUP_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) { super(token); }
}

export class ExitClientSearchPopup extends TokenizeAction implements Action {
    readonly type = EXIT_CLIENT_SEARCH_POPUP;
    constructor(public token) { super(token); }
}

export class GetMatters extends TokenizeAction implements Action {
    readonly type = GET_MATTERS;
    constructor(public token, public clientRef: string) { super(token); }
}

export class GetMattersSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTERS_SUCESS;
    constructor(public token, public clientRef: string, public matters: MatterViewModel[]) { super(token); }
}
export class GetMattersFail extends TokenizeAction implements Action {
    readonly type = GET_MATTERS_FAIL;
    constructor(public token, public clientRef: string) { super(token); }
}
export class ChangeMatterPage extends TokenizeAction implements Action {
    readonly type = CHANGE_MATTERS_PAGE;
    constructor(public token, public clientRef: string, public matterPaginatorDef: PaginatorDef) { super(token); }
}

export type Any = InitClientSearch |
    ClientSearchSubmit | ClientSearchSubmitSuccess |
    ClientSearchTextChange | ClientSearchTextChangeReject | ClientSearchTextChangeEmpty |
    LoadClientSearchGridData | LoadClientSearchGridDataSuccess | LoadClientSearchGridDataFail |
    LoadClientSearchGridData | LoadClientSearchGridDataSuccess | LoadClientSearchGridDataFail |
    ExpandClientRow | ExpandMatterRow | GridRefresh | LoadClientSearchPopupData | LoadClientSearchPopupDataSuccess
    | LoadClientSearchPopupDataFail | LoadPopupClientData | LoadOpportunityPopupClientData | ExitClientSearchPopup
    | GetMatters | GetMattersSuccess | GetMattersFail | ChangeMatterPage;
