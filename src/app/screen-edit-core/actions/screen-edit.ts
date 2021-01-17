
import { Action } from '@ngrx/store';
import { TokenizeAction, ScreenEditComponentTreeData } from '../../core';
import { ScreenEditUpdateSuccessInfo } from '../models/interfaces';

export const INIT_SCREEN_EDIT = 'DPS_SE_INIT_SCREEN_EDIT';

export const LOAD_SCREEN_EDIT_RULE_LIST = 'DPS_SE_LOAD_SCREEN_EDIT_RULE_LIST';
export const LOAD_SCREEN_EDIT_RULE_LIST_SUCCESS = 'DPS_SE_LOAD_SCREEN_EDIT_RULE_LIST_SUCCESS';
export const LOAD_SCREEN_EDIT_RULE_LIST_FAIL = 'DPS_SE_LOAD_SCREEN_EDIT_RULE_LIST_FAIL';

export const LOAD_SCREEN_EDIT_COMPONENT_LIST = 'DPS_SE_LOAD_SCREEN_EDIT_COMPONENT_LIST';
export const LOAD_SCREEN_EDIT_COMPONENT_LIST_SUCCESS = 'DPS_SE_LOAD_SCREEN_EDIT_COMPONENT_LIST_SUCCESS';
export const LOAD_SCREEN_EDIT_COMPONENT_LIST_FAIL = 'DPS_SE_LOAD_SCREEN_EDIT_COMPONENT_LIST_FAIL';

export const SCREEN_EDIT_CLOSE = 'DPS_SCREEN_EDIT_CLOSE';

export const SCREEN_EDIT_SUBMIT = 'DPS_SCREEN_EDIT_SUBMIT';
export const SCREEN_EDIT_SUBMIT_FAIL = 'DPS_SCREEN_EDIT_SUBMIT_FAIL';
export const SCREEN_EDIT_SUBMIT_SUCCESS = 'DPS_SCREEN_EDIT_SUBMIT_SUCCESS';

export class InitScreenEdit extends TokenizeAction implements Action {
    readonly type = INIT_SCREEN_EDIT;
    constructor(public token: string, public payload: { type: any }) {
        super(token);
    }
}

export class LoadScreenEditRuleList extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_EDIT_RULE_LIST;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadScreenEditRuleListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_EDIT_RULE_LIST_SUCCESS;
    constructor(public token: string, public payload: { response: any, }) {
        super(token);
    }
}

export class LoadScreenEditRuleListFail extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_EDIT_RULE_LIST_FAIL;
    constructor(public token: string, error: string) {
        super(token);
    }
}

export class LoadScreenEditComponentList extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_EDIT_COMPONENT_LIST;
    constructor(public token: string, public payload: { type: string }) {
        super(token);
    }
}

export class LoadScreenEditComponentListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_EDIT_COMPONENT_LIST_SUCCESS;
    constructor(public token: string, public payload: { response: any, }) {
        super(token);
    }
}

export class LoadScreenEditComponentListFail extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_EDIT_COMPONENT_LIST_FAIL;
    constructor(public token: string, error: string) {
        super(token);
    }
}

export class ScreenEditClose extends TokenizeAction implements Action {
    readonly type = SCREEN_EDIT_CLOSE;
    constructor(public token: string) {
        super(token);
    }
}

export class SubmitScreenEdit extends TokenizeAction implements Action {
    readonly type = SCREEN_EDIT_SUBMIT;
    constructor(public token: string, public payload: {
        updatedData: ScreenEditComponentTreeData[],
        treeData: ScreenEditComponentTreeData[]
    }) {
        super(token);
    }
}
export class SubmitScreenEditFail extends TokenizeAction implements Action {
    readonly type = SCREEN_EDIT_SUBMIT_FAIL;
    constructor(public token: string, error: string) {
        super(token);
    }
}

export class SubmitScreenEditSuccess extends TokenizeAction implements Action {
    readonly type = SCREEN_EDIT_SUBMIT_SUCCESS;
    constructor(public token: string, public payload: {
        treeData: ScreenEditComponentTreeData[]
    }) {
        super(token);
    }
}

export type Any = InitScreenEdit | LoadScreenEditRuleList | LoadScreenEditRuleListSuccess | LoadScreenEditRuleListFail
    | LoadScreenEditComponentList | LoadScreenEditComponentListSuccess | LoadScreenEditComponentListFail | ScreenEditClose
    | SubmitScreenEdit | SubmitScreenEditSuccess |SubmitScreenEditFail;
