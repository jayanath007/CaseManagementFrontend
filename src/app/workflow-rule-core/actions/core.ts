import { State } from '../reducers';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
// import { extend } from 'webdriver-js-extender';
import { WorkflowRuleSelectedItemData, WorkflowRuleListData, RuleOperator, WorkflowRuleFileData } from '../models/interfaces';

export const INIT_WORKFLOW_RULE = 'INIT_WORKFLOW_RULE';
export const INIT_WORKFLOW_RULE_SUCCESS = 'INIT_WORKFLOW_RULE_SUCCESS';
export const INIT_WORKFLOW_RULE_FAIL = 'INIT_WORKFLOW_RULE_FAIL';

export const CHANGE_WORKFLOW_RULE_OPERATOR = 'CHANGE_WORKFLOW_RULE_OPERATOR';
export const CHANGE_WORKFLOW_RULE_ACTION = 'CHANGE_WORKFLOW_RULE_ACTION';
export const CHANGE_WORKFLOW_RULE_TEXT_VAR_NO = 'CHANGE_WORKFLOW_RULE_TEXT_VAR_NO';
export const CHANGE_WORKFLOW_RULE_CRITERIA = 'CHANGE_WORKFLOW_RULE_CRITERIA';
export const CHANGE_WORKFLOW_RULE_ITEM = 'CHANGE_WORKFLOW_RULE_ITEM';
export const SELECT_WORKFLOW_RULE_ITEM = 'SELECT_WORKFLOW_RULE_ITEM';
export const CHANGE_WORKFLOW_RULE_DESCRIPTION = 'CHANGE_WORKFLOW_RULE_DESCRIPTION';

export const SELECT_WORKFLOW_RULE_ROW = 'SELECT_WORKFLOW_RULE_ROW';

export const SAVE_WORKFLOW_RULE = 'SAVE_WORKFLOW_RULE';
export const SAVE_WORKFLOW_RULE_SUCCESS = 'SAVE_WORKFLOW_RULE_SUCCESS';
export const SAVE_WORKFLOW_RULE_FAIL = 'SAVE_WORKFLOW_RULE_FAIL';

export const CHANGE_WORKFLOW_RULE_UP = 'CHANGE_WORKFLOW_RULE_UP';
export const CHANGE_WORKFLOW_RULE_DOWN = 'CHANGE_WORKFLOW_RULE_DOWN';
export const CHANGE_WORKFLOW_RULE_UP_DOWN = 'CHANGE_WORKFLOW_RULE_UP_DOWN';


export const WORKFLOW_RULE_EXPORT = 'WORKFLOW_RULE_EXPORT';
export const WORKFLOW_RULE_EXPORT_SUCCESS = 'WORKFLOW_RULE_EXPORT_SUCCESS';
export const WORKFLOW_RULE_EXPORT_FAIL = 'WORKFLOW_RULE_EXPORT_FAIL';

export const WORKFLOW_RULE_IMPORT = 'WORKFLOW_RULE_IMPORT';
export const WORKFLOW_RULE_IMPORT_SUCCESS = 'WORKFLOW_RULE_IMPORT_SUCCESS';
export const WORKFLOW_RULE_IMPORT_FAIL = 'WORKFLOW_RULE_IMPORT_FAIL';

export const ADD_NEW_WORKFLOW_RULE = 'ADD_NEW_WORKFLOW_RULE';
export const ADD_NEW_WORKFLOW_RULE_SUCCESS = 'ADD_NEW_WORKFLOW_RULE_SUCCESS';
export const ADD_NEW_WORKFLOW_RULE_REJECT = 'ADD_NEW_WORKFLOW_RULE_REJECT';

export const DELETE_WORKFLOW_RULE_SUBMIT = 'DELETE_WORKFLOW_RULE_SUBMIT';
export const DELETE_WORKFLOW_RULE = 'DELETE_WORKFLOW_RULE';

export const EXIT_WORKFLOW_RULE = 'EXIT_WORKFLOW_RULE';


export class InitWorkFlowRule extends TokenizeAction implements Action {
    readonly type = INIT_WORKFLOW_RULE;
    constructor(public token: string, public payload: { appId: number, fileId: number, branchId: number, isProspectMatter: boolean }) {
        super(token);
    }
}

export class InitWorkFlowRuleSuccess extends TokenizeAction implements Action {
    readonly type = INIT_WORKFLOW_RULE_SUCCESS;
    constructor(public token: string, public payload: { workflowRuleList: any }) {
        super(token);
    }
}

export class InitWorkFlowRuleFail extends TokenizeAction implements Action {
    readonly type = INIT_WORKFLOW_RULE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export class SaveWorkflowRule extends TokenizeAction implements Action {
    readonly type = SAVE_WORKFLOW_RULE;
    constructor(public token: string) {
        super(token);
    }
}

export class SaveWorkflowRuleSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_WORKFLOW_RULE_SUCCESS;
    constructor(public token: string, public payload: { workflowRuleList: any }) {
        super(token);
    }
}

export class SaveWorkflowRuleFail extends TokenizeAction implements Action {
    readonly type = SAVE_WORKFLOW_RULE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}




export class ExitWorkFlowRule extends TokenizeAction implements Action {
    readonly type = EXIT_WORKFLOW_RULE;
    constructor(public token: string) {
        super(token);
    }
}

export class AddNewWorkFlowRule extends TokenizeAction implements Action {
    readonly type = ADD_NEW_WORKFLOW_RULE;
    constructor(public token: string) {
        super(token);
    }
}

export class AddNewWorkFlowRuleSuccess extends TokenizeAction implements Action {
    readonly type = ADD_NEW_WORKFLOW_RULE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class AddNewWorkFlowRuleReject extends TokenizeAction implements Action {
    readonly type = ADD_NEW_WORKFLOW_RULE_REJECT;
    constructor(public token: string) {
        super(token);
    }
}

export class SelectWorkflowRule extends TokenizeAction implements Action {
    readonly type = SELECT_WORKFLOW_RULE_ROW;
    constructor(public token: string, public payload: { selectedItemData: WorkflowRuleSelectedItemData }) {
        super(token);
    }
}

export class ChangeWorkflowRuleUp extends TokenizeAction implements Action {
    readonly type = CHANGE_WORKFLOW_RULE_UP;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangeWorkflowRuleDown extends TokenizeAction implements Action {
    readonly type = CHANGE_WORKFLOW_RULE_DOWN;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangeWorkflowRuleOperator extends TokenizeAction implements Action {
    readonly type = CHANGE_WORKFLOW_RULE_OPERATOR;
    constructor(public token: string, public payload: { selectedItem: WorkflowRuleListData, operator: RuleOperator }) {
        super(token);
    }
}




export class ChangeWorkflowRuleAction extends TokenizeAction implements Action {
    readonly type = CHANGE_WORKFLOW_RULE_ACTION;
    constructor(public token: string, public payload: { selectedItem: WorkflowRuleListData, action: number }) {
        super(token);
    }
}


export class ChangeWorkflowRuleTextVarNo extends TokenizeAction implements Action {
    readonly type = CHANGE_WORKFLOW_RULE_TEXT_VAR_NO;
    constructor(public token: string, public payload: { selectedItem: WorkflowRuleListData, wfR_Test: string }) {
        super(token);
    }
}



export class ChangeWorkflowRuleCriteria extends TokenizeAction implements Action {
    readonly type = CHANGE_WORKFLOW_RULE_CRITERIA;
    constructor(public token: string, public payload: { selectedItem: WorkflowRuleListData, wfR_Control: string }) {
        super(token);
    }
}

export class ChangeWorkflowRuleItem extends TokenizeAction implements Action {
    readonly type = CHANGE_WORKFLOW_RULE_ITEM;
    constructor(public token: string, public payload: { selectedItem: WorkflowRuleListData, wfR_Command: string }) {
        super(token);
    }
}


export class SelectWorkflowRuleItem extends TokenizeAction implements Action {
    readonly type = SELECT_WORKFLOW_RULE_ITEM;
    constructor(public token: string,
        public payload: {
            selectedItem: WorkflowRuleListData, wfR_Command: string, wfR_Description: string,
            wfR_CommandNodeID: number
        }) {
        super(token);
    }
}

export class ChangeWorkflowRuleDescription extends TokenizeAction implements Action {
    readonly type = CHANGE_WORKFLOW_RULE_DESCRIPTION;
    constructor(public token: string, public payload: { selectedItem: WorkflowRuleListData, wfR_Description: string }) {
        super(token);
    }
}

export class ChangeWorkflowRuleUpDown extends TokenizeAction implements Action {
    readonly type = CHANGE_WORKFLOW_RULE_UP_DOWN;
    constructor(public token: string, public payload: { selectedItemList: WorkflowRuleListData, isUp: boolean }) {
        super(token);
    }
}

export class DeleteWorkflowRuleSubmit extends TokenizeAction implements Action {
    readonly type = DELETE_WORKFLOW_RULE_SUBMIT;
    constructor(public token: string) {
        super(token);
    }
}

export class DeleteWorkflowRule extends TokenizeAction implements Action {
    readonly type = DELETE_WORKFLOW_RULE;
    constructor(public token: string) {
        super(token);
    }
}

export class ExportWorkflowRule extends TokenizeAction implements Action {
    readonly type = WORKFLOW_RULE_EXPORT;
    constructor(public token: string) {
        super(token);
    }
}

export class ExportWorkflowRuleSuccess extends TokenizeAction implements Action {
    readonly type = WORKFLOW_RULE_EXPORT_SUCCESS;
    constructor(public token: string, public payload: { exportedData: any }) {
        super(token);
    }
}

export class ExportWorkflowRuleFail extends TokenizeAction implements Action {
    readonly type = WORKFLOW_RULE_EXPORT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ImportWorkflowRule extends TokenizeAction implements Action {
    readonly type = WORKFLOW_RULE_IMPORT;
    constructor(public token: string, public payload: { fullFileData: WorkflowRuleFileData }) {
        super(token);
    }
}

export class ImportWorkflowRuleSuccess extends TokenizeAction implements Action {
    readonly type = WORKFLOW_RULE_IMPORT_SUCCESS;
    constructor(public token: string, public payload: { importedData: any, isReplace: boolean }) {
        super(token);
    }
}

export class ImportWorkflowRuleFail extends TokenizeAction implements Action {
    readonly type = WORKFLOW_RULE_IMPORT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export type Any = InitWorkFlowRule | InitWorkFlowRuleSuccess | InitWorkFlowRuleFail |
    AddNewWorkFlowRule | AddNewWorkFlowRuleSuccess | AddNewWorkFlowRuleReject |
    SelectWorkflowRule |
    ChangeWorkflowRuleUp | ChangeWorkflowRuleDown | ChangeWorkflowRuleUpDown |
    DeleteWorkflowRuleSubmit | DeleteWorkflowRule |
    ExitWorkFlowRule |
    SaveWorkflowRule | SaveWorkflowRuleSuccess | SaveWorkflowRuleFail |
    ChangeWorkflowRuleOperator | ChangeWorkflowRuleAction |
    ChangeWorkflowRuleTextVarNo | ChangeWorkflowRuleCriteria | ChangeWorkflowRuleItem | ChangeWorkflowRuleDescription |
    SelectWorkflowRuleItem |
    ExportWorkflowRule | ExportWorkflowRuleSuccess | ExportWorkflowRuleFail |
    ImportWorkflowRule | ImportWorkflowRuleSuccess | ImportWorkflowRuleFail;


