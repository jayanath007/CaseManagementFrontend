import { NarrativeItem, NarrativeDataModel } from './../models/interfaces';
import { ViewChangeKind } from '../models/enums';

import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { NarrativeGroup } from '../models/interfaces';

export const INIT_BILLING_NARRATIVE = 'DPS_INIT_BILLING_NATTATIVE';

export const BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE = 'DPS_BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE';
export const BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE_SCCEESS = 'DPS_BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE_SCCEESS';
export const BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE_SCCEESS_FAIL = 'DPS_BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE_SCCEESS_FAIL';

export const GET_NARRATIVE_GROUPS = 'DPS_GET_NARRATIVE_GROUPS';
export const GET_NARRATIVE_GROUPS_SUCCESS = 'DPS_GET_NARRATIVE_GROUPS_SCCEESS';
export const GET_NARRATIVE_GROUPS_FAIL = 'DPS_GET_NARRATIVE_GROUPS_FAIL';

export const GET_NARRATIVE_ITEMS = 'DPS_GET_NARRATIVE_ITEMS';
export const GET_NARRATIVE_ITEMS_SUCCESS = 'DPS_GET_NARRATIVE_ITEMS_SCCEESS';
export const GET_NARRATIVE_ITEMS_FAIL = 'DPS_GET_NARRATIVE_ITEMS_FAIL';

export const SELECT_NARRATIVE_GROUP = 'DPS_SELECT_NARRATIVE_GROUP';
export const SELECT_NARRATIVE_GROUP_ITEM = 'DPS_SELECT_NARRATIVE_GROUP_ITEM';
export const VIEW_CHANGE = 'DPS_VIEW_CHANGE';

export const DELETE_SELECTED_NARRATIVE_ITEM = 'DPS_DELETE_SELECTED_NARRATIVE_ITEM';
export const DELETE_SELECTED_NARRATIVE_ITEMS_SUCCESS = 'DPS_DELETE_SELECTED_NARRATIVE_ITEMS_SUCCESS';
export const DELETE_SELECTED_NARRATIVE_ITEMS_FAIL = 'DPS_DELETE_SELECTED_NARRATIVE_ITEMS_FAIL';

export const DELETE_SELECTED_GROUP = 'DPS_DELETE_SELECTED_GROUP';
export const DELETE_SELECTED_GROUP_SUCCESS = 'DPS_DELETE_SELECTED_GROUP_SUCCESS';
export const DELETE_SELECTED_GROUP_FAIL = 'DPS_DELETE_SELECTED_GROUP_FAIL';





export class InitPage extends TokenizeAction implements Action {
    readonly type = INIT_BILLING_NARRATIVE;
    constructor(public token: string, public payload: { inputData: any }) {
        super(token);
    }
}

export class BillingNattativeGroupAndItemSave extends TokenizeAction implements Action {
    readonly type = BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE;
    constructor(public token: string) { super(token); }
}

export class BillingNarrativeGroupAndItemSaveSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE_SCCEESS;
    constructor(public token: string, public response) { super(token); }
}

export class BillingNarrativeGroupAndItemSaveFail extends TokenizeAction implements Action {
    readonly type = BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE_SCCEESS_FAIL;
    constructor(public token: string, public payload: { nattativeSuccessInfo: any }) { super(token); }
}

export class GetNarrativeGroups extends TokenizeAction implements Action {
    readonly type = GET_NARRATIVE_GROUPS;
    constructor(public token: string) {
        super(token);
    }
}
export class GetNarrativeGroupsSuccess extends TokenizeAction implements Action {
    readonly type = GET_NARRATIVE_GROUPS_SUCCESS;
    constructor(public token: string, public payload: { narrativeData: NarrativeDataModel[] } ) {
        super(token);
    }
}
export class GetNarrativeGroupsFail extends TokenizeAction implements Action {
    readonly type = GET_NARRATIVE_GROUPS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetNarrativeItems extends TokenizeAction implements Action {
    readonly type = GET_NARRATIVE_ITEMS;
    constructor(public token: string) {
        super(token);
    }
}
export class GetNarrativeItemsSuccess extends TokenizeAction implements Action {
    readonly type = GET_NARRATIVE_ITEMS_SUCCESS;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class GetNarrativeItemsFail extends TokenizeAction implements Action {
    readonly type = GET_NARRATIVE_ITEMS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class SelectNarrativeGroup extends TokenizeAction implements Action {
    readonly type = SELECT_NARRATIVE_GROUP;
    constructor(public token: string, public narrativeGroup: NarrativeDataModel) {
        super(token);
    }
}

export class SelectNarrativeGroupItem extends TokenizeAction implements Action {
    readonly type = SELECT_NARRATIVE_GROUP_ITEM;
    constructor(public token: string, public narrativeItem: NarrativeItem) {
        super(token);
    }
}

export class ViewChange extends TokenizeAction implements Action {
    readonly type = VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class DeleteSelectedNarrativeItem extends TokenizeAction implements Action {
    readonly type = DELETE_SELECTED_NARRATIVE_ITEM;
    constructor(public token: string) {
        super(token);
    }
}
export class DeleteSelectedNarrativeItemsSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_SELECTED_NARRATIVE_ITEMS_SUCCESS;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class DeleteSelectedNarrativeItemsFail extends TokenizeAction implements Action {
    readonly type = DELETE_SELECTED_NARRATIVE_ITEMS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class DeleteSelectedGroup extends TokenizeAction implements Action {
    readonly type = DELETE_SELECTED_GROUP;
    constructor(public token: string) {
        super(token);
    }
}
export class DeleteSelectedGroupSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_SELECTED_GROUP_SUCCESS;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class DeleteSelectedGroupFail extends TokenizeAction implements Action {
    readonly type = DELETE_SELECTED_GROUP_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}




export type Any = InitPage | BillingNattativeGroupAndItemSave | BillingNarrativeGroupAndItemSaveSuccess |
    BillingNarrativeGroupAndItemSaveFail | GetNarrativeGroups | GetNarrativeGroupsSuccess | GetNarrativeGroupsFail |
    GetNarrativeItems | GetNarrativeItemsSuccess | GetNarrativeItemsFail | SelectNarrativeGroup | ViewChange
| SelectNarrativeGroupItem | DeleteSelectedNarrativeItem | DeleteSelectedNarrativeItemsSuccess | DeleteSelectedNarrativeItemsFail |
DeleteSelectedGroup | DeleteSelectedGroupSuccess | DeleteSelectedGroupFail;
