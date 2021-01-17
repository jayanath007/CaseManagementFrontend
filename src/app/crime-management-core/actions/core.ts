import { RateChangeModel } from './../../time-information-core/models/interfaces';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { CrimeManagementInput } from '../../core/lib/crime-managment';
import { UpdateModelType } from '../models/enum';
import { AddNewClassRequest } from '../models/request';
import { ClassObj, ClassTotalsViewModel } from '../models/interfaces';
import { ClassType, CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';

export const INIT_CRIME_MANAGEMENT = 'DPS_INIT_CRIME_MANAGEMENT';
export const GET_CLASS_LIST = 'DPS_INIT_CRIME_MANAGEMENT_GET_CLASS_LIST';
export const GET_CLASS_LIST_SUCCESS = 'DPS_INIT_CRIME_MANAGEMENT_GET_CLASS_SUCCESS';
export const GET_CLASS_LIST_FAIL = 'DPS_INIT_CRIME_MANAGEMENT_GET_CLASS_FAIL';
export const GET_CLASS_TYPE = 'DPS_INIT_CRIME_MANAGEMENT_GET_CLASS_TYPE';
export const GET_CLASS_TYPE_SUCCESS = 'DPS_INIT_CRIME_MANAGEMENT_GET_CLASS_TYPE_SUCCESS';
export const GET_CLASS_TYPE_FAIL = 'DPS_INIT_CRIME_MANAGEMENT_GET_CLASS_TYPE_FAIL';
export const UPDATE_ADD_CLASS_MODEL = 'DPS_INIT_CRIME_MANAGEMENT_UPDATE_ADD_CLASS_MODEL';
export const ADD_NEW_CLASS = 'DPS_INIT_CRIME_MANAGEMENT_ADD_NEW_CLASS';
export const ADD_NEW_CLASS_REQUST = 'DPS_INIT_CRIME_MANAGEMENT_ADD_NEW_CLASS_REQUST';
export const ADD_NEW_CLASS_SUCCESS = 'DPS_INIT_CRIME_MANAGEMENT_ADD_NEW_CLASS_SUCCESS';
export const ADD_NEW_CLASS_FAIL = 'DPS_INIT_CRIME_MANAGEMENT_ADD_NEW_CLASS_Fail';
export const DELETE_CLASS = 'DPS_CRIME_MANAGEMENT_DELETE_CLASS';
export const DELETE_CLASS_SUCCESS = 'DPS_CRIME_MANAGEMENT_DELETE_CLASS_SUCCESS';
export const DELETE_CLASS_FAIL = 'DPS_CRIME_MANAGEMENT_DELETE_CLASS_FAIL';
export const SHOW_MSG = 'DPS_INIT_CRIME_MANAGEMENT_SHOW_MSG';
export const GET_CRIME_RATE_FILES = 'DPS_CRIME_MANAGEMENT_GET_CRIME_RATE_FILES';
export const GET_CRIME_RATE_FILES_SUCCESS = 'DPS_CRIME_MANAGEMENT_GET_CRIME_RATE_FILES_SUCCESS';
export const GET_CRIME_RATE_FILES_FAIL = 'DPS_CRIME_MANAGEMENT_GET_CRIME_RATE_FILES_FAIL';
export const REFRESH_CLASS_LIST = 'DPS_CRIME_MANAGEMENT_REFRESH_CLASS_LIST';
export const OPEN_CLASS_INFO_POPUP = 'DPS_CRIME_MANAGEMENT_OPEN_CLASS_INFO_POPUP';
export const GET_CLASS_TOTAL = 'DPS_CRIME_MANAGEMENT_GET_CLASS_TOTAL';
export const GET_CLASS_TOTAL_SUCCESS = 'DPS_CRIME_MANAGEMENT_GET_CLASS_TOTAL_SUCCESS';
export const GET_CLASS_TOTAL_FAIL = 'DPS_CRIME_MANAGEMENT_GET_CLASS_TOTAL_FAIL';
export const RUN_SCREEN_OPTION = 'DPS_CRIME_MANAGEMENT_RUN_SCREEN_OPTION';


export class InitCrimeManagement extends TokenizeAction implements Action {
    readonly type = INIT_CRIME_MANAGEMENT;
    constructor(public token: string,
        public payload: {
            inputData: CrimeManagementInput,
            isPopup: boolean,
            timeOffset: number
        }) { super(token); }
}

export class ClearCrimeRateFiles extends TokenizeAction implements Action {
    readonly type = GET_CRIME_RATE_FILES;
    constructor(public token: string) {
        super(token);
    }
}

export class GetClassList extends TokenizeAction implements Action {
    readonly type = GET_CLASS_LIST;
    constructor(public token: string, public payload: {
        branchId: number,
        appId: number,
        fileId: number

    }, public classObj?: ClassObj) { super(token); }
}

export class GetClassListSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLASS_LIST_SUCCESS;
    constructor(public token: string, public payload: { list: ClassObj[], classObj: ClassObj }) { super(token); }
}

export class GetClassListFail extends TokenizeAction implements Action {
    readonly type = GET_CLASS_LIST_FAIL;
    constructor(public token: string) { super(token); }
}

export class GetClassType extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE;
    constructor(public token: string) { super(token); }
}

export class GetClassTypeSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE_SUCCESS;
    constructor(public token: string, public payload: { list: ClassType[] }) { super(token); }
}

export class GetClassTypeFail extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE_FAIL;
    constructor(public token: string) { super(token); }
}

export class UpdateAddClassModelData extends TokenizeAction implements Action {
    readonly type = UPDATE_ADD_CLASS_MODEL;
    constructor(public token: string, public payload: { changes: { kind: UpdateModelType, value: string | number } }) { super(token); }
}

export class NewClassRequest extends TokenizeAction implements Action {
    readonly type = ADD_NEW_CLASS_REQUST;
    constructor(public token: string, public payload: { request: AddNewClassRequest }) { super(token); }
}

export class AddNewClass extends TokenizeAction implements Action {
    readonly type = ADD_NEW_CLASS;
    constructor(public token: string) { super(token); }
}

export class AddNewClassSuccess extends TokenizeAction implements Action {
    readonly type = ADD_NEW_CLASS_SUCCESS;
    constructor(public token: string) { super(token); }
}

export class AddNewClassFail extends TokenizeAction implements Action {
    readonly type = ADD_NEW_CLASS_FAIL;
    constructor(public token: string) { super(token); }
}

export class ShowMessage extends TokenizeAction implements Action {
    readonly type = SHOW_MSG;
    constructor(public token: string, public payload: { msg: string }) { super(token); }
}

export class DeleteClass extends TokenizeAction implements Action {
    readonly type = DELETE_CLASS;
    constructor(public token: string, public classInfo: ClassObj) {
        super(token);
    }
}


export class DeleteClassSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_CLASS_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class DeleteClassFall extends TokenizeAction implements Action {
    readonly type = DELETE_CLASS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class RefreshClassList extends TokenizeAction implements Action {
    readonly type = REFRESH_CLASS_LIST;
    constructor(public token: string, public classObj?: ClassObj) {
        super(token);
    }
}


export class OpenClassInfoPopup extends TokenizeAction implements Action {
    readonly type = OPEN_CLASS_INFO_POPUP;
    constructor(public token, public classObj: ClassObj) {
        super(token);
    }
}


export class GetClassTotal extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TOTAL;
    constructor(public token: string, public classInfo: ClassObj) {
        super(token);
    }
}


export class GetClassTotalSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TOTAL_SUCCESS;
    constructor(public token: string, public payLoad: { classId: number, total: ClassTotalsViewModel }) {
        super(token);
    }
}

export class GetClassTotalFall extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TOTAL_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class RunScreenOption extends TokenizeAction {
    readonly type = RUN_SCREEN_OPTION;
    constructor(public token: string, public classObj: ClassObj, public screenOption: string) {
        super(token);
    }
}

export type Any = InitCrimeManagement | GetClassList | GetClassListSuccess | GetClassListFail
    | GetClassType | GetClassTypeSuccess | GetClassTypeFail | UpdateAddClassModelData
    | AddNewClass | AddNewClassSuccess | AddNewClassFail | NewClassRequest | ShowMessage
    | ClearCrimeRateFiles | DeleteClass
    | DeleteClassSuccess | DeleteClassFall | RefreshClassList | GetClassTotal | GetClassTotalSuccess | GetClassTotalFall | RunScreenOption;
