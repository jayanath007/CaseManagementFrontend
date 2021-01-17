import { TokenizeAction } from '../../core';
import { CivilClassObj, CivilManagementModuleInput } from '../model/interfaces';

export const INIT_MODULE = 'CIVIL_CLASS_MNG_INIT_MODULE';
export const GET_CLASS_LIST = 'CIVIL_CLASS_MNG_GET_CLASS_LIST';
export const GET_CLASS_LIST_SUCCESS = 'CIVIL_CLASS_MNG_GET_CLASS_SUCCESS';
export const GET_CLASS_LIST_FAIL = 'CIVIL_CLASS_MNG_GET_CLASS_FAIL';

export class InitCivilManagement extends TokenizeAction {
    readonly type = INIT_MODULE;
    constructor(public token: string,
        public payload: {
            inputData: CivilManagementModuleInput
        }) { super(token); }
}

export class GetClassList extends TokenizeAction {
    readonly type = GET_CLASS_LIST;
    constructor(public token: string) { super(token); }
}

export class GetClassListSuccess extends TokenizeAction {
    readonly type = GET_CLASS_LIST_SUCCESS;
    constructor(public token: string, public payload: { list: CivilClassObj[] }) { super(token); }
}

export class GetClassListFail extends TokenizeAction {
    readonly type = GET_CLASS_LIST_FAIL;
    constructor(public token: string) { super(token); }
}

export type Any = InitCivilManagement | GetClassList | GetClassListSuccess | GetClassListFail;
