import { Action } from '@ngrx/store';
import { OpenCaseMenueData } from './open-case';
import { MainMenuItem } from '../../layout-desktop/models/interfaces';
import { Injector } from '@angular/core';

export abstract class TokenizeAction {
    constructor(public token: string) { }
}

export const MENU_TAB_CLOSE = 'MENU_TAB_CLOSE';
export const MENU_OPEN_CASE_ADD_TAB = 'MENU_OPEN_CASE_ADD_TAB';
export const DPS_APP_INIT = 'DPS_APP_INIT';
export const DPS_EMPTY_TAB_CLOSED_ACTION = 'DPS_EMPTY_TAB_CLOSED_ACTION';
export const WORKFLOW_XM_COMMAND_EXECUTED = 'DPS_WORKFLOW_XM_COMMAND_EXECUTED';
export const CREATE_WORKFLOW_SESSION = 'DPS_CREATE_WORKFLOW_SESSION';
export const FILE_LOGIG_STATUS_CHANGE = 'DPS_FILE_LOGIG_STATUS_CHANGE';

export class DpsAppInit implements Action {
    readonly type = DPS_APP_INIT;
}

export class MenuTabClose<Data> implements Action {
    readonly type = MENU_TAB_CLOSE;
    constructor(public payload: { item: MainMenuItem<OpenCaseMenueData>, nextIndex: number }) {
    }
}

export class MenueOpenCaseAddTab implements Action {
    readonly type = MENU_OPEN_CASE_ADD_TAB;
    constructor(public paylod: { token: string, menuItem: MainMenuItem<OpenCaseMenueData> }) { }
}

export class EmptyTabCloseAction implements Action {
    readonly type = DPS_EMPTY_TAB_CLOSED_ACTION;
    constructor(public payload: { item: any }) {
    }
}

export class WorkflowXmCommondExecuted {
    readonly type = WORKFLOW_XM_COMMAND_EXECUTED;
    constructor(public menuName: string, public token: string) { }
}

export class CreateWorkflowSession {
    readonly type = CREATE_WORKFLOW_SESSION;
    constructor(public token: string, public injector: Injector, public appId: number, public fileId: number, public branchId: number) { }
}

export class FileLogicStatsChange {
    readonly type = FILE_LOGIG_STATUS_CHANGE;
    constructor(public logicType: 'ENTRY' | 'EXIT',
        public appId: number, public fileId: number, public branchId: number,
        public status: number, public data?: any) { }
}

export type Any = MenuTabClose<any> | MenueOpenCaseAddTab | EmptyTabCloseAction | FileLogicStatsChange;
