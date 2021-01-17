import {
    ConflictSearchClientResponse,
    ConflictSearchClientDetailResponse, ConflictSearchClientRequest, OpportunityConflictSearchRequest,
    ConflictSearchDetailRequest, ClientResponse, ConflictSearchGridRowItemWrapper, SearchModel, ConflictSearchPopupInput
} from '../models/interfaces';
import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { PageEvent } from '@angular/material';
import { ConflictSaveType } from '../models/enum';

export const INIT_CONFLICT_SEARCH = 'INIT_CONFLICT_SEARCH';

export const CONFLICT_SEARCH_SEARCH_CLIENT = 'CONFLICT_SEARCH_SEARCH_CLIENT';
export const CONFLICT_SEARCH_SEARCH_CLIENT_SUCCESS = 'CONFLICT_SEARCH_SEARCH_CLIENT_SUCCESS';
export const CONFLICT_SEARCH_SEARCH_CLIENT_FAIL = 'CONFLICT_SEARCH_SEARCH_CLIENT_FAIL';

export const CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS = 'INIT_CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS';
export const CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS_SUCCESS = 'CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS_SUCCESS';
export const CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS_FAIL = 'CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS_FAIL';

export const CONFLICT_SEARCH_SELECT_ITEM = 'CONFLICT_SEARCH_SELECT_ITEM';

export const CONFLICT_SEARCH_GRID_PAGE_EVENT_CHANGE = 'CONFLICT_SEARCH_GRID_PAGE_EVENT_CHANGE';
export const CLIENT_MATTER_GRID_PAGE_EVENT_CHANGE = 'CLIENT_MATTER_GRID_PAGE_EVENT_CHANGE';

export const CONFLICT_SEARCH_SAVE = 'CONFLICT_SEARCH_SAVE';
export const CONFLICT_SEARCH_SAVE_SUCCESS = 'CONFLICT_SEARCH_SAVE_SUCCESS';
export const CONFLICT_SEARCH_SAVE_FAIL = 'CONFLICT_SEARCH_SAVE_FAIL';

export const CONFLICT_SEARCH_CLOSE = 'CONFLICT_SEARCH_CLOSE';
export const CONFLICT_SEARCH_CLOSED = 'CONFLICT_SEARCH_CLOSED';

export const ADD_OPPORTUNITY_COMPANY_LIST = 'OPPORTUNITY_COMPANY_LIST';

export const OPPORTUNITY_CONFLICT_SEARCH = 'OPPORTUNITY_CONFLICT_SEARCH';
export const OPPORTUNITY_CONFLICT_SEARCH_SUCCESS = 'OPPORTUNITY_CONFLICT_SEARCH_SUCCESS';
export const OPPORTUNITY_CONFLICT_SEARCH_FAIL = 'OPPORTUNITY_CONFLICT_SEARCH_FAIL';
export const OPPORTUNITY_CONFLICT_SEARCH_SAVE = 'OPPORTUNITY_CONFLICT_SEARCH_SAVE';
export const OPPORTUNITY_CONFLICT_SEARCH_SAVE_SUCCESS = 'OPPORTUNITY_CONFLICT_SEARCH_SAVE_SUCCESS';
export const OPPORTUNITY_CONFLICT_SEARCH_SAVE_FAIL = 'OPPORTUNITY_CONFLICT_SEARCH_SAVE_FAIL';


export class InitConflictSearch extends TokenizeAction implements Action {
    readonly type = INIT_CONFLICT_SEARCH;
    constructor(public token: string, public payload: { inputData: ConflictSearchPopupInput }) {
        super(token);
    }
}
export class ConflictSearchClose extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_CLOSE;
    constructor(public token: string, public payload: { saveType: ConflictSaveType }) {
        super(token);
    }
}
export class ConflictSearchClosed extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_CLOSED;
    constructor(public token: string) {
        super(token);
    }
}
export class ConflictSearchSave extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SAVE;
    constructor(public token: string, public payload: { type: string }) { super(token); }
}
export class ConflictSearchSaveSuccess extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SAVE_SUCCESS;
    constructor(public token: string, public payload: {}) { super(token); }
}
export class ConflictSearchSaveFail extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SAVE_FAIL;
    constructor(public token: string, public payload: {}) { super(token); }
}
export class ConflictSearchSelectItem extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SELECT_ITEM;
    constructor(public token: string, public payload: { item: ConflictSearchGridRowItemWrapper }) { super(token); }
}
export class ConflictSearchGridPageEventChange extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_GRID_PAGE_EVENT_CHANGE;
    constructor(public token: string, public payload: { pageEvent: PageEvent }) { super(token); }
}

export class ClientMatterGridPageEventChange extends TokenizeAction implements Action {
    readonly type = CLIENT_MATTER_GRID_PAGE_EVENT_CHANGE;
    constructor(public token: string, public payload: { pageEvent: PageEvent }) { super(token); }
}
export class ConflictSearchSearchClient extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SEARCH_CLIENT;
    constructor(public token: string, public payload: { searchModel: SearchModel }) { super(token); }
}

export class ConflictSearchSearchClientSucess extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SEARCH_CLIENT_SUCCESS;
    constructor(public token: string, public payload: {
        response: ConflictSearchClientResponse,
        request: ConflictSearchClientRequest
    }) { super(token); }
}
export class ConflictSearchSearchClientFail extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SEARCH_CLIENT_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}

export class ConflictSearchClientDetails extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS;
    constructor(public token: string,
        public payload: { request: ConflictSearchDetailRequest }) { super(token); }
}
export class ConflictSearchClientDetailsSucess extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS_SUCCESS;
    constructor(public token: string, public payload: {
        clientDetailListResponce: ConflictSearchClientDetailResponse,
        clientResponse: ClientResponse,
        request: ConflictSearchDetailRequest
    }) { super(token); }
}
export class ConflictSearchClientDetailsFail extends TokenizeAction implements Action {
    readonly type = CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS_FAIL;
    constructor(public token: string, public payload: { value: any }) {
        super(token);
    }
}
export class OpportunityComanyListUpdate extends TokenizeAction implements Action {
    readonly type = ADD_OPPORTUNITY_COMPANY_LIST;
    constructor(public token: string, public payload: { companyList: string[] }) { super(token); }
}
export class OpportunityConflictSearch extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_CONFLICT_SEARCH;
    constructor(public token: string, public payload: { searchModel: SearchModel }) { super(token); }
}
export class OpportunityConflictSearchSucess extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_CONFLICT_SEARCH_SUCCESS;
    constructor(public token: string, public payload: {
        response: ConflictSearchClientResponse,
        request: OpportunityConflictSearchRequest
    }) { super(token); }
}
export class OpportunityConflictSearchFail extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_CONFLICT_SEARCH_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}
export class OpportunityConflictSearchSave extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_CONFLICT_SEARCH_SAVE;
    constructor(public token: string, public payload: { type: string }) { super(token); }
}
export class OpportunityConflictSearchSaveSuccess extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_CONFLICT_SEARCH_SAVE_SUCCESS;
    constructor(public token: string, public payload: {}) { super(token); }
}
export class OpportunityConflictSearchSaveFail extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_CONFLICT_SEARCH_SAVE_FAIL;
    constructor(public token: string, public payload: {}) { super(token); }
}

export type Any = InitConflictSearch | ConflictSearchClose | ConflictSearchClosed
    | ConflictSearchSearchClient | ConflictSearchSearchClientSucess | ConflictSearchSearchClientFail
    | ConflictSearchClientDetails | ConflictSearchClientDetailsSucess | ConflictSearchClientDetailsFail
    | ConflictSearchSelectItem | ConflictSearchGridPageEventChange | ClientMatterGridPageEventChange
    | ConflictSearchSave | ConflictSearchSaveSuccess | ConflictSearchSaveFail | OpportunityComanyListUpdate
    | OpportunityConflictSearch | OpportunityConflictSearchSucess | OpportunityConflictSearchFail
    | OpportunityConflictSearchSave | OpportunityConflictSearchSaveSuccess | OpportunityConflictSearchSaveFail;
