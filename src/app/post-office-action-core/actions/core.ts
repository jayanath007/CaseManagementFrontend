import { Group } from './../../post-office-core/models/interfce';
import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';

import { PostOfficeActionModel, PostOfficeActionInputData } from '../models/interfaces';
import { TeamMember } from '../../team-core';


export const INIT_POST_OFFICE = 'DPS_INIT_POST_OFFICE';
export const POST_OFFICE_MODEL_CHANGE = 'DPS_POST_OFFICE_MODEL_CHANGE';
export const NEW_FORM = 'DPS_POST_OFFICE_NEW_FORM';
export const GROUP_VALUE_CHANGE = 'DPS_POST_OFFICE_GROUP_VALUE_CHANGE';
export const LOAD_DIARY_FOLDERS_LIST = 'DPS_LOAD_DIARY_FOLDERS_LIST';
export const LOAD_DIARY_FOLDERS_LIST_SUCCESS = 'DPS_LOAD_DIARY_FOLDERS_LIST_SUCCESS';
export const LOAD_DIARY_FOLDERS_LIST_FAIL = 'DPS_LOAD_DIARY_FOLDERS_LIST_FAIL';
export const LOAD_ITEM_TYPE_LIST = 'DPS_POST_OFFICE_LOAD_ITEM_TYPE_LIST';
export const LOAD_ITEM_TYPE_LIST_SUCCESS = 'DPS_POST_OFFICE_LOAD_ITEM_TYPE_LIST_SUCCESS';
export const LOAD_ITEM_TYPE_LIST_FAIL = 'DPS_POST_OFFICE_LOAD_ITEM_TYPE_LIST_FOLDERS_LIST_FAIL';
export const LOAD_GROUP_LIST = 'DPS_POST_OFFICE_LOAD_GROUP_LIST';
export const LOAD_GROUP_LIST_SUCCESS = 'DPS_POST_OFFICE_LOAD_GROUP_LIST_SUCCESS';
export const LOAD_GROUP_LIST_FAIL = 'DPS_POST_OFFICE_LOAD_GROUP_LIST_FAIL';


export const LOAD_FEEEARNER_LIST = 'DPS_POST_OFFICE_LOAD_FEEEARNER_LIST';
export const LOAD_FEEEARNER_LIST_SUCCESS = 'DPS_POST_OFFICE_LOAD_FEEEARNER_LIST_SUCCESS';
export const LOAD_FEEEARNER_LIST_FAIL = 'DPS_POST_OFFICE_LOAD_FEEEARNER_LIST_FAIL';
export const LOAD_FEEEARNER_LIST_CANCELLED = 'DPS_POST_OFFICE_LOAD_FEEEARNER_LIST_CANCELLED';


export const SAVE = 'DPS_POST_OFFICE_SAVE';
export const SAVE_SUCCESS = 'DPS_POST_OFFICE_SAVE_SUCCESS';
export const SAVE_FAIL = 'DPS_POST_OFFICE_SAVE_FAIL';
export const CLOSE_POPUP = 'DPS_POST_OFFICE_CLOSE_POPUP';
export const PRINT_DOC = 'DPS_POST_OFFICE_PRINT_DOC';

export const LOAD_DEPARTMENTS = 'PO_DPS_LOAD_DEPARTMENTS';
export const LOAD_DEPARTMENTS_SUCCESS = 'PO_DPS_LOAD_DEPARTMENT_SUCESS';
export const LOAD_DEPARTMENTS_FAIL = 'PO_DPS_LOAD_DEPARTMENT_FAIL';



export class InitPostOfficeAction extends TokenizeAction implements Action {
    readonly type = INIT_POST_OFFICE;
    constructor(public token: string, public payload: {
        inputData: PostOfficeActionInputData
    }) {
        super(token);
    }
}

export class PostOfficeActionModelChange extends TokenizeAction implements Action {
    readonly type = POST_OFFICE_MODEL_CHANGE;
    constructor(public token: string, public payload: {
        oldModel: PostOfficeActionModel,
        newModel: PostOfficeActionModel
    }) {
        super(token);
    }
}
export class LoadDiaryFoldersList extends TokenizeAction implements Action {
    readonly type = LOAD_DIARY_FOLDERS_LIST;
    constructor(public token: string, public payload: { appId: number }) {
        super(token);
    }
}
export class LoadDiaryFoldersListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DIARY_FOLDERS_LIST_SUCCESS;
    constructor(public token: string, public payload: { folders: any[] }) {
        super(token);
    }
}
export class LoadDiaryFoldersListFail extends TokenizeAction implements Action {
    readonly type = LOAD_DIARY_FOLDERS_LIST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadItemTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_ITEM_TYPE_LIST;
    constructor(public token: string, public payload: { appId: number }) {
        super(token);
    }
}
export class LoadItemTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ITEM_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { actions: any[] }) {
        super(token);
    }
}
export class LoadItemTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ITEM_TYPE_LIST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadGroupList extends TokenizeAction implements Action {
    readonly type = LOAD_GROUP_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadGroupListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_GROUP_LIST_SUCCESS;
    constructor(public token: string, public payload: { groups: Group[] }) {
        super(token);
    }
}
export class LoadGroupListFail extends TokenizeAction implements Action {
    readonly type = LOAD_GROUP_LIST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFeeEarnerList extends TokenizeAction implements Action {
    readonly type = LOAD_FEEEARNER_LIST;
    constructor(public token: string, public payload: { groupId: number }) {
        super(token);
    }
}
export class LoadFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FEEEARNER_LIST_SUCCESS;
    constructor(public token: string, public payload: { feeEarnerList: TeamMember[], groupId: number }) {
        super(token);
    }
}
export class LoadFeeEarnerListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FEEEARNER_LIST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadFeeEarnerListCancelled extends TokenizeAction implements Action {
    readonly type = LOAD_FEEEARNER_LIST_CANCELLED;
    constructor(public token: string) {
        super(token);
    }
}
export class NewForm extends TokenizeAction implements Action {
    readonly type = NEW_FORM;
    constructor(public token: string) {
        super(token);
    }
}
export class SaveTimeRecords extends TokenizeAction implements Action {
    readonly type = SAVE;
    constructor(public token: string) {
        super(token);
    }
}
export class SaveTimeRecordsSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}
export class SaveTimeRecordsFail extends TokenizeAction implements Action {
    readonly type = SAVE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class ClosePopup extends TokenizeAction implements Action {
    readonly type = CLOSE_POPUP;
    constructor(public token: string) {
        super(token);
    }
}
export class PrintDoc extends TokenizeAction implements Action {
    readonly type = PRINT_DOC;
    constructor(public token: string) {
        super(token);
    }
}


export type Any = InitPostOfficeAction
    | LoadFeeEarnerList | LoadFeeEarnerListSuccess | LoadFeeEarnerListFail |
    LoadDiaryFoldersList | LoadDiaryFoldersListSuccess | LoadDiaryFoldersListFail |
    LoadItemTypeList | LoadItemTypeListSuccess | LoadItemTypeListFail |
    LoadGroupList | LoadGroupListSuccess | LoadGroupListFail |
    PostOfficeActionModelChange | NewForm |
    SaveTimeRecords | SaveTimeRecordsSuccess | SaveTimeRecordsFail |
    ClosePopup | PrintDoc | LoadFeeEarnerListCancelled;
