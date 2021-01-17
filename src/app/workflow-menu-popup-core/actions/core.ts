// import { ItemChangeKind } from './../models/enums';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { WorkflowMenuMetaItem } from '../models/interfaces';
import { State } from '../reducers';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
// import { extend } from 'webdriver-js-extender';
import { WorkFlowMenuPopupInput } from '../../core/lib/workflow';

export const INIT_WORKFLOW_MENU = 'DPS_WFP_INIT_WORKFLOW_MENU_POPUP';
export const CLEAR_WORKFLOW_MENU = 'DPS_WFP_CLEAR_WORKFLOW_MENU_POPUP';

export const LOAD_WORKFLOW_MENU_LIST = 'DPS_WFP_WORKFLOW_LOAD_MENU_LIST';
export const LOAD_WORKFLOW_MENU_LIST_SUCCESS = 'DPS_WFP_WORKFLOW_LOAD_MENU_LIST_SUCCESS';
export const LOAD_WORKFLOW_MENU_LIST_FAIL = 'DPS_WFP_WORKFLOW_LOAD_MENU_LIST_FAIL';

export const ALL_DATA_UPDATED = 'DPS_WFP_ALL_DATA_UPDATED';

export class InitWorkFlowMenu extends TokenizeAction implements Action {
    readonly type = INIT_WORKFLOW_MENU;
    constructor(public token: string, public payload: { inputData: WorkFlowMenuPopupInput }) {
        super(token);
    }
}

export class ClearData extends TokenizeAction implements Action {
    readonly type = CLEAR_WORKFLOW_MENU;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadMenuList extends TokenizeAction implements Action {
    readonly type = LOAD_WORKFLOW_MENU_LIST;
    constructor(public token: string, public payload: { inputData: WorkFlowMenuPopupInput }) {
        super(token);
    }
}

export class LoadMenuListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_WORKFLOW_MENU_LIST_SUCCESS;
    constructor(public token: string, public payload: { menuList: WorkflowMenuMetaItem[] }) {
        super(token);
    }
}

export class LoadMenuListFail extends TokenizeAction implements Action {
    readonly type = LOAD_WORKFLOW_MENU_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class AllDataUpdate extends TokenizeAction implements Action {
    readonly type = ALL_DATA_UPDATED;
    constructor(public token: string) {
        super(token);
    }
}

export type Any = InitWorkFlowMenu | AllDataUpdate |
    LoadMenuList | LoadMenuListSuccess | LoadMenuListFail | ClearData;

