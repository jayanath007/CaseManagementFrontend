import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';

export const OV_LIST_ITEMS_UPDATE = 'OV_LIST_ITEMS_UPDATE';
export const INIT_OV_ITEM = 'DPS_INIT_OV_ITEM';
export const SCREEN_DESIGNER_UPDATE_OV_ITEM = 'SCREEN_DESIGNER_UPDATE_OV_ITEM';
export const OV_LIST_SEARCH_TEXT_CHANGE = 'OV_LIST_SEARCH_TEXT_CHANGE';

export const LOAD_OV_ITEM = 'LOAD_OV_ITEM';
export const LOAD_OV_ITEM_LIST_FAIL = 'LOAD_OV_ITEM_LIST_FAIL';
export const LOAD_OV_ITEM_SUCCESS = 'LOAD_OV_ITEM_SUCCESS';
import { RowOvItemChangeKind } from './core';
import { OvItem } from '../models/application-component';
import { FormView } from '../reducers/screen-desingner';
import { SaveOvItemRequest, SaveOvItemResponse, DeleteOvItemRequest,
     DeleteOvItemResponse, ExportOvItemRequest, ExportOvItemResponse } from '../models/ov-item-request';


export class OvListItemsUpdate extends TokenizeAction implements Action {
    readonly type = OV_LIST_ITEMS_UPDATE;
    constructor(public token: string, public payload: { ovItem: OvItem[], formView: FormView; }) {
        super(token);
    }
}

export class OvListSearchTextChange extends TokenizeAction implements Action {
    readonly type = OV_LIST_SEARCH_TEXT_CHANGE;
    constructor(public token: string, public payload: { text: string }) {
        super(token);
    }
}

export class InitOvItem extends TokenizeAction implements Action {
    readonly type = INIT_OV_ITEM;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadOvItemList extends TokenizeAction implements Action {
    readonly type = LOAD_OV_ITEM;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadLoadOvItemSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_OV_ITEM_SUCCESS;
    constructor(public token: string, public payload: { ovItem: OvItem[] }) {
        super(token);
    }
}

export class LoadOvItemListFail extends TokenizeAction implements Action {
    readonly type = LOAD_OV_ITEM_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}

export class ScreenDesignerUpdateOvItem extends TokenizeAction implements Action {
    readonly type = SCREEN_DESIGNER_UPDATE_OV_ITEM;
    constructor(public token: string, public payload: { kind: RowOvItemChangeKind, row: OvItem, value: any }) {
        super(token);
    }
}


export const SAVE_OV_ITEM = 'SAVE_OV_ITEM';
export const SAVE_OV_ITEM_SUCCESS = 'SAVE_OV_ITEM_SUCCESS';
export const SAVE_OV_ITEM_FAIL = 'SAVE_OV_ITEM_FAIL';


/////////////////////// load SaveOvItem start
export class SaveOvItem extends TokenizeAction implements Action {
    readonly type = SAVE_OV_ITEM;
    constructor(public token: string, public request: SaveOvItemRequest) { super(token); }
}

export class SaveOvItemSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_OV_ITEM_SUCCESS;
    constructor(public token: string, public payload: {
        response: SaveOvItemResponse,
        request: SaveOvItemRequest
    }) { super(token); }
}

export class SaveOvItemFail extends TokenizeAction implements Action {
    readonly type = SAVE_OV_ITEM_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}
/////////////////////// load SaveOvItem end




export const DELETE_OV_ITEM = 'DELETE_OV_ITEM';
export const DELETE_OV_ITEM_SUCCESS = 'DELETE_OV_ITEM_SUCCESS';
export const DELETE_OV_ITEM_FAIL = 'DELETE_OV_ITEM_FAIL';


/////////////////////// load DeleteOvItem start
export class DeleteOvItem extends TokenizeAction implements Action {
    readonly type = DELETE_OV_ITEM;
    constructor(public token: string, public request: DeleteOvItemRequest) { super(token); }
}

export class DeleteOvItemSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_OV_ITEM_SUCCESS;
    constructor(public token: string, public payload: {
        response: DeleteOvItemResponse,
        request: DeleteOvItemRequest
    }) { super(token); }
}

export class DeleteOvItemFail extends TokenizeAction implements Action {
    readonly type = DELETE_OV_ITEM_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}
/////////////////////// load DeleteOvItem end



export const EXPORT_OV_ITEM = 'EXPORT_OV_ITEM';
export const EXPORT_OV_ITEM_SUCCESS = 'EXPORT_OV_ITEM_SUCCESS';
export const EXPORT_OV_ITEM_FAIL = 'EXPORT_OV_ITEM_FAIL';


/////////////////////// load ExportOvItem start
export class ExportOvItem extends TokenizeAction implements Action {
    readonly type = EXPORT_OV_ITEM;
    constructor(public token: string, public request: ExportOvItemRequest) { super(token); }
}

export class ExportOvItemSuccess extends TokenizeAction implements Action {
    readonly type = EXPORT_OV_ITEM_SUCCESS;
    constructor(public token: string, public payload: {
        response: ExportOvItemResponse,
        request: ExportOvItemRequest
    }) { super(token); }
}

export class ExportOvItemFail extends TokenizeAction implements Action {
    readonly type = EXPORT_OV_ITEM_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}
/////////////////////// load ExportOvItem end

export type Any = InitOvItem | LoadOvItemList |
    LoadOvItemListFail | LoadLoadOvItemSuccess | ScreenDesignerUpdateOvItem
    | OvListItemsUpdate | OvListSearchTextChange;
