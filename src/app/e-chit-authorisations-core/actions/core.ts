import { FileDataViewModel } from './../models/interfaces';
import { FeeEarner, AuthorisationsGroup, AuthorisationsGridDataObject, AuthorisationsGridData } from '../models/interfaces';
import { ColumnDef, PaginatorDef } from './../../core/lib/grid-model';
import { PropertyNameList } from '../models/enums';
import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';

export const INIT_ECHIT_AUTHORISATIONS = 'DPS_INIT_ECHIT_AUTHORISATIONS';

export const ECHIT_AUTHORISATIONS_FEEEARNER_LIST = 'DPS_ECHIT_AUTHORISATIONS_FEEEARNER_LIST';
export const ECHIT_AUTHORISATIONS_FEEEARNER_LIST_SUCCESS = 'DPS_ECHIT_AUTHORISATIONS_FEEEARNER_LIST_SUCCESS';
export const ECHIT_AUTHORISATIONS_FEEEARNER_LIST_FAIL = 'DPS_ECHIT_AUTHORISATIONS_FEEEARNER_LIST_FAIL';

export const ECHIT_AUTHORISATIONS_USER_GROUP_LIST = 'DPS_ECHIT_AUTHORISATIONS_USER_GROUP_LIST';
export const ECHIT_AUTHORISATIONS_USER_GROUP_LIST_SUCCESS = 'DPS_ECHIT_AUTHORISATIONS_USER_GROUP_LIST_SUCCESS';
export const ECHIT_AUTHORISATIONS_USER_GROUP_LIST_FAIL = 'DPS_ECHIT_AUTHORISATIONS_USER_GROUP_LIST_FAIL';

export const ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE = 'DPS_ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE';
export const ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE_SUCCESS = 'DPS_ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE_SUCCESS';
export const ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE_FAIL = 'DPS_ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE_FAIL';

export const ECHIT_AUTHORISATIONS_SAVE = 'DPS_ECHIT_AUTHORISATIONS_SAVE';
export const ECHIT_AUTHORISATIONS_SAVE_SUCCESS = 'DPS_ECHIT_AUTHORISATIONS_SAVE_SUCCESS';
export const ECHIT_AUTHORISATIONS_SAVE_FAIL = 'DPS_ECHIT_AUTHORISATIONS_SAVE_FAIL';

export const ECHIT_AUTHORISATIONS_REJECT = 'ECHIT_AUTHORISATIONS_REJECT';
export const ECHIT_AUTHORISATIONS_REJECT_SUCCESS = 'ECHIT_AUTHORISATIONS_REJECT_SUCCESS';
export const ECHIT_AUTHORISATIONS_REJECT_FAIL = 'ECHIT_AUTHORISATIONS_REJECT_FAIL';

export const ECHIT_AUTHORISATIONS_SHOW_DOCUMENT = 'DPS_ECHIT_AUTHORISATIONS_SHOW_DOCUMENT';
export const ECHIT_AUTHORISATIONS_SHOW_DOCUMENT_SUCCESS = 'DPS_ECHIT_AUTHORISATIONS_SHOW_DOCUMENT_SUCCESS';
export const ECHIT_AUTHORISATIONS_SHOW_DOCUMENT_FAIL = 'DPS_ECHIT_AUTHORISATIONS_SHOW_DOCUMENT_FAIL';

export const ECHIT_AUTHORISATIONS_EMAIL_ITEM = 'DPS_ECHIT_AUTHORISATIONS_EMAIL_ITEM';
export const ECHIT_AUTHORISATIONS_EMAIL_ITEM_SUCCESS = 'DPS_ECHIT_AUTHORISATIONS_EMAIL_ITEM_SUCCESS';
export const ECHIT_AUTHORISATIONS_EMAIL_ITEM_FAIL = 'DPS_ECHIT_AUTHORISATIONS_EMAIL_ITEM_FAIL';

export const ECHIT_AUTHORISATIONS_DROPDOWN_VALUE_CHANGE = 'DPS_ECHIT_AUTHORISATIONS_DROPDOWN_VALUE_CHANGE';
export const ECHIT_AUTHORISATIONS_SELECTED_ROW_ITEM = 'DPS_ECHIT_AUTHORISATIONS_SELECTED_ROW_ITEM';
export const ECHIT_AUTHORISATIONS_CHECKBOX_CHANGE = 'DPS_ECHIT_AUTHORISATIONS_CHECKBOX_CHANGE';
export const ECHIT_AUTHORISATIONS_SHOW_MESSAGE = 'DPS_ECHIT_AUTHORISATIONS_SHOW_MESSAGE';
export const ECHIT_AUTHORISATIONS_CHANGE_PAGE = 'DPS_ECHIT_AUTHORISATIONS_CHANGE_PAGE';
export const ECHIT_AUTHORISATIONS_COLUM_SORTING = 'DPS_ECHIT_AUTHORISATIONS_COLUM_SORTING';

export class InitPage extends TokenizeAction implements Action {
    readonly type = INIT_ECHIT_AUTHORISATIONS;
    constructor(public token: string,
        public payload: {
            inputData: any,
            columnDef: ColumnDef[],
            paginatorDef: PaginatorDef
        }) {
        super(token);
    }
}
// FreeEarner data load
export class LoadFeeEarnerList extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_FEEEARNER_LIST;
    constructor(public token: string, public payload: { userGroupId: number; }) {
        super(token);
    }
}
export class LoadFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_FEEEARNER_LIST_SUCCESS;
    constructor(public token: string, public payload: { feeEarnerList: FeeEarner[] }) {
        super(token);
    }
}
export class LoadFeeEarnerListFail extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_FEEEARNER_LIST_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
// Group data load
export class LoadUserGroupList extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_USER_GROUP_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadUserGroupListSuccess extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_USER_GROUP_LIST_SUCCESS;
    constructor(public token: string, public payload: { userGroupList: AuthorisationsGroup[] }) {
        super(token);
    }
}
export class LoadUserGroupListFail extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_USER_GROUP_LIST_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
// Refresh, User  and Group change action
export class GridDataByUserAndGroupChange extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE;
    constructor(public token: string) {
        super(token);
    } // , public payload: { feeEarnerId: number, userGroupId: number; }
}
export class GridDataByUserAndGroupChangeSuccess extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE_SUCCESS;
    constructor(public token: string, public payload: { gridDataObject: AuthorisationsGridDataObject }) {
        super(token);
    }
}
export class GridDataByUserAndGroupChangeFail extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
// Save echitathorisations
export class EChitAuthoriseSave extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_SAVE;
    constructor(public token: string) {
        super(token);
    } // , public payload: { userGroupId: number; }
}
export class EChitAuthoriseSaveSuccess extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_SAVE_SUCCESS;
    constructor(public token: string, public payload: { responceData: any }) {
        super(token);
    }
}
export class EChitAuthoriseSaveFail extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_SAVE_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class EChitAuthoriseReject extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_REJECT;
    constructor(public token: string) {
        super(token);
    } // , public payload: { userGroupId: number; }
}
export class EChitAuthoriseRejectSuccess extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_REJECT_SUCCESS;
    constructor(public token: string, public payload: { responceData: any }) {
        super(token);
    }
}
export class EChitAuthoriseRejectFail extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_REJECT_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class DropDownValueChange extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_DROPDOWN_VALUE_CHANGE;
    constructor(public token: string, public payload: { propertyName: PropertyNameList, selectedValue: any }) {
        super(token);
    }
}
export class SelectedRowChange extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_SELECTED_ROW_ITEM;
    constructor(public token: string, public payload: { selectedRow: AuthorisationsGridData; }) {
        super(token);
    }
}
export class CheckBoxChange extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_CHECKBOX_CHANGE;
    constructor(public token: string, public payload: { rowId: number, CheckBoxValue: boolean }) {
        super(token);
    }
}
export class ShowMessage extends TokenizeAction {
    readonly type = ECHIT_AUTHORISATIONS_SHOW_MESSAGE;
    constructor(public token: string, public payload: { actionType: PropertyNameList, responceData: any }) {
        super(token);
    }
}
export class ChangePaginator extends TokenizeAction {
    readonly type = ECHIT_AUTHORISATIONS_CHANGE_PAGE;
    constructor(public token, public pageDef: PaginatorDef) {
        super(token);
    }
}
export class ShowDocument extends TokenizeAction {
    readonly type = ECHIT_AUTHORISATIONS_SHOW_DOCUMENT;
    constructor(public token, public payload: { fileDataViewModel: FileDataViewModel }) {
        super(token);
    }
}
export class ShowDocumentSuccess extends TokenizeAction {
    readonly type = ECHIT_AUTHORISATIONS_SHOW_DOCUMENT_SUCCESS;
    constructor(public token, public url) {
        super(token);
    }
}
export class ShowDocumentFail extends TokenizeAction {
    readonly type = ECHIT_AUTHORISATIONS_SHOW_DOCUMENT_FAIL;
    constructor(public token) {
        super(token);
    }
}
export class ApplyColumSort extends TokenizeAction {
    readonly type = ECHIT_AUTHORISATIONS_COLUM_SORTING;
    constructor(public token: string, public columDef: ColumnDef) {
        super(token);
    }
}
export class GetEmailItem extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_EMAIL_ITEM;
    constructor(public token: string, public payload: { fileDataViewModel: FileDataViewModel }) {
        super(token);
    }
}
export class GetEmailItemSuccess extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_EMAIL_ITEM_SUCCESS;
    constructor(public token: string, public payload: { emailItem: any }) { // MessageItemWrapper
        super(token);
    }
};
export class GetEmailItemFail extends TokenizeAction implements Action {
    readonly type = ECHIT_AUTHORISATIONS_EMAIL_ITEM_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export type Any = InitPage | LoadFeeEarnerList | LoadFeeEarnerListSuccess | LoadFeeEarnerListFail | ShowMessage |
    LoadUserGroupList | LoadUserGroupListSuccess | LoadUserGroupListFail | GridDataByUserAndGroupChange |
    GridDataByUserAndGroupChangeSuccess | GridDataByUserAndGroupChangeFail | EChitAuthoriseSave | ChangePaginator |
    EChitAuthoriseSaveSuccess | EChitAuthoriseSaveFail | DropDownValueChange | SelectedRowChange | CheckBoxChange |
    ShowDocument | ShowDocumentSuccess | ShowDocumentFail | ApplyColumSort | GetEmailItem | GetEmailItemSuccess | GetEmailItemFail |
    EChitAuthoriseReject | EChitAuthoriseRejectSuccess | EChitAuthoriseRejectFail;
