import { Action } from '@ngrx/store';
import { Template, CheckedOutData, TemplateListResponse, TemplateClipboard, AppInfo } from '../models/interfaces';
import { TemplateFilterByCheckoutType } from '../models/enum';
import { ItemClipboard } from '../../drive-core';
import { SafeBoxType } from '../../core';

export const INIT_TEMPLATE_DIRECTORY = 'DPS_INIT_TEMPLATE_DIRECTORY';

export const GET_APP_LIST = 'DPS_TEMPLATE_DIRECTORY_GET_APP_LIST';
export const GET_APP_LIST_SUCCESS = 'DPS_TEMPLATE_DIRECTORY_GET_APP_LIST_SUCCESS';
export const GET_APP_LIST_FAIL = 'DPS_TEMPLATE_DIRECTORY_GET_APP_LIST_FAIL';

export const SELECT_APP = 'DPS_TEMPLATE_DIRECTORY_SELECT_APP';

export const TOGGLE_APP_LIST_EXPAND = 'DPS_TEMPLATE_DIRECTORY_TOGGLE_APP_LIST_EXPAND';

export const GET_TEMPLATE_LIST = 'DPS_TEMPLATE_DIRECTORY_GET_TEMPLATE_LIST';
export const GET_TEMPLATE_LIST_SUCCESS = 'DPS_TEMPLATE_DIRECTORY_GET_TEMPLATE_LIST_SUCCESS';
export const GET_TEMPLATE_LIST_FAIL = 'DPS_TEMPLATE_DIRECTORY_GET_TEMPLATE_LIST_FAIL';

export const VIEW_TEMPLATE = 'DPS_TEMPLATE_DIRECTORY_VIEW_TEMPLATE';

export const SELECT_TEMPLATE = 'DPS_TEMPLATE_DIRECTORY_SELECT_TEMPLATE';

export const CHANGE_SORT = 'DPS_TEMPLATE_DIRECTORY_CHANGE_SORT';

export const CHANGE_FILTER = 'DPS_TEMPLATE_DIRECTORY_CHANGE_FILTER';

export const CHANGE_SEARCH_TEXT = 'DPS_TEMPLATE_DIRECTORY_CHANGE_SEARCH_TEXT';

export const CHANGE_SHOW_COMMON_TEMPLATES = 'DPS_TEMPLATE_DIRECTORY_CHANGE_SHOW_COMMON_TEMPLATES';

export const GET_CHECKED_OUT_FILES = 'DPS_TEMPLATE_DIRECTORY_GET_CHECKED_OUT_FILES';
export const GET_CHECKED_OUT_FILES_SUCCESS = 'DPS_TEMPLATE_DIRECTORY_GET_CHECKED_OUT_FILES_SUCCESS';
export const GET_CHECKED_OUT_FILES_FAIL = 'DPS_TEMPLATE_DIRECTORY_GET_CHECKED_OUT_FILES_FAIL';

export const CUT_OR_COPY_TEMPLATES = 'DPS_TEMPLATE_DIRECTORY_CUT_OR_COPY_TEMPLATES';
export const PASTE_ITEMS = 'DPS_TEMPLATE_DIRECTORY_PASTE_ITEMS';

export const DELETE_ITEMS = 'DPS_TEMPLATE_DIRECTORY_DELETE_ITEMS';
export const DELETE_ITEMS_SUCCESS = 'DPS_TEMPLATE_DIRECTORY_DELETE_ITEMS_SUCCESS';

export const RENAME_ITEM = 'DPS_TEMPLATE_DIRECTORY_RENAME_ITEM';
export const RENAME_ITEM_SUCCESS = 'DPS_TEMPLATE_DIRECTORY_RENAME_ITEM_SUCCESS';

export const UPLOAD_FILES = 'DPS_TEMPLATE_DIRECTORY_UPLOAD_FILES';

export const ADD_NEW_ITEM = 'DPS_TEMPLATE_DIRECTORY_ADD_NEW_ITEM';

export class InitTemplateDirectory implements Action {
    readonly type = INIT_TEMPLATE_DIRECTORY;
    constructor() { }
}

export class GetAppList implements Action {
    readonly type = GET_APP_LIST;
    constructor() { }
}
export class GetAppListSuccess implements Action {
    readonly type = GET_APP_LIST_SUCCESS;
    constructor(public payload: AppInfo[]) { }
}
export class GetAppListFail implements Action {
    readonly type = GET_APP_LIST_FAIL;
    constructor(public payload: { error: any }) { }
}

export class SelectApp implements Action {
    readonly type = SELECT_APP;
    constructor(public payload: AppInfo) { }
}

export class ToggleAppListExpand implements Action {
    readonly type = TOGGLE_APP_LIST_EXPAND;
    constructor() { }
}

export class GetTemplateList implements Action {
    readonly type = GET_TEMPLATE_LIST;
    constructor(public payload: AppInfo) { }
}
export class GetTemplateListSuccess implements Action {
    readonly type = GET_TEMPLATE_LIST_SUCCESS;
    constructor(public payload: { templates: TemplateListResponse, checkedOutList: CheckedOutData[], app: AppInfo }) { }
}
export class GetTemplateListFail implements Action {
    readonly type = GET_TEMPLATE_LIST_FAIL;
    constructor(public payload: { error: any, app: AppInfo }) { }
}

export class GetCheckedOutFiles implements Action {
    readonly type = GET_CHECKED_OUT_FILES;
    constructor(public payload: AppInfo) { }
}
export class GetCheckedOutFilesSuccess implements Action {
    readonly type = GET_CHECKED_OUT_FILES_SUCCESS;
    constructor(public payload: { checkedOutList: CheckedOutData[], app: AppInfo }) { }
}
export class GetCheckedOutFilesFail implements Action {
    readonly type = GET_CHECKED_OUT_FILES_FAIL;
    constructor(public payload: { error: any, app: AppInfo }) { }
}

export class ViewTemplate implements Action {
    readonly type = VIEW_TEMPLATE;
    constructor(public payload: { appId: number, fileName: string, isCommon?: boolean }) { }
}

export class SelectTemplate implements Action {
    readonly type = SELECT_TEMPLATE;
    constructor(public payload: { appId: number, template: Template, isMulti: boolean, path: string }) { }
}

export class ChangeSort implements Action {
    readonly type = CHANGE_SORT;
    constructor(public payload: string) { }
}

export class ChangeFilter implements Action {
    readonly type = CHANGE_FILTER;
    constructor(public payload: TemplateFilterByCheckoutType) { }
}

export class ChangeSearchText implements Action {
    readonly type = CHANGE_SEARCH_TEXT;
    constructor(public payload: string) { }
}

export class ChangeShowCommonTemplates implements Action {
    readonly type = CHANGE_SHOW_COMMON_TEMPLATES;
    constructor(public payload: boolean) { }
}

export class CutOrCopyTemplates implements Action {
    readonly type = CUT_OR_COPY_TEMPLATES;
    constructor(public payload: TemplateClipboard) {
    }
}

export class PasteItems implements Action {
    readonly type = PASTE_ITEMS;
    constructor(public payload: {
        clipboard: TemplateClipboard, appId: number,
        path: string, copyFrom: SafeBoxType, diveClipboard: ItemClipboard
    }) {
    }
}

export class DeleteItems implements Action {
    readonly type = DELETE_ITEMS;
    constructor(public payload: { templates: Template[], appId: number, path: string }) {
    }
}
export class DeleteItemsSuccess implements Action {
    readonly type = DELETE_ITEMS_SUCCESS;
    constructor(public payload: { templates: Template[], appId: number }) {
    }
}

export class RenameItem implements Action {
    readonly type = RENAME_ITEM;
    constructor(public payload: { template: Template, newName: string, extension: string, appId: number, path: string, appPath: string }) {
    }
}
export class RenameItemSuccess implements Action {
    readonly type = RENAME_ITEM_SUCCESS;
    constructor(public payload: { template: Template, newName: string, extension: string, appId: number, appPath: string }) {
    }
}
export class UploadFiles implements Action {
    readonly type = UPLOAD_FILES;
    constructor(public payload: { files: File[], path: string }) {
    }
}

export class AddNewItem implements Action {
    readonly type = ADD_NEW_ITEM;
    constructor(public payload: { name: string, type: string, appId: number, isCommon: boolean }) {
    }
}

export type Any = InitTemplateDirectory | GetAppList | GetAppListSuccess | GetAppListFail | SelectApp | ToggleAppListExpand |
    GetTemplateList | GetTemplateListSuccess | GetTemplateListFail | ViewTemplate | SelectTemplate |
    ChangeSort | ChangeFilter | ChangeSearchText | GetCheckedOutFilesSuccess | ChangeShowCommonTemplates |
    CutOrCopyTemplates | PasteItems | DeleteItems | DeleteItemsSuccess | RenameItem | RenameItemSuccess;
