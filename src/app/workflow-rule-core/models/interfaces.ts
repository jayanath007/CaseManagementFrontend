
export interface WorkflowRuleListDataResponse {
    data: WorkflowRuleListData;
    status: string;
    messageBody: string;
    messageHeader: string;
    detailStatus: DetailStatusViewModel[];
}

export interface DetailStatusViewModel {
    code: string;
    message: string;
    reference: string;
    messageType: string;
    severityLevel: string;
    exceptionType: string;
}

export interface MatterData {
    appId: number;
    fileId: number;
    branchId: number;
    isProspectMatter: boolean;
}

export interface WorkflowRuleListData {
    // ATN_ID: number;
    // ATN_ParentID: number;
    // ATN_AppID: number;
    // ATN_Type: number;
    // ATN_Order: number;
    // ATN_Command: string;
    // ATN_Desc: string;
    // ATN_Level: number;
    // ATN_Help: string;
    // ATN_ParentMenu: string;
    // NodeStatus: number;
    // CreateUser: string;
    // DateDone: string;
    // enabled: boolean;
    // isViewRowSelected: boolean;
    // isTreeNodeExpand: boolean;
    // isRowDeleted: boolean;
    // isRowMove: boolean;
    // isDirty: boolean;
    // isCutRowItem: boolean;

    wfR_Action: number;
    wfR_AppID: number;
    wfR_Command: string;
    wfR_CommandNodeID: number;
    wfR_Control: string;
    wfR_Description: string;
    wfR_ID: number;
    wfR_Operator: string;
    wfR_Position: number;
    wfR_Test: string;

    operatorText: string;
    actionText: string;
    itemText: string;
    rowOrder: number;
    isRowSelected: boolean;
    isDirty: boolean;
    isOperatorShow: boolean;
    isActionShow: boolean;
    isItemShow: boolean;
}

export interface WorkflowInputData {
    AppId: number;
    FileId: number;
    BranchId: number;
    isProspectMatter: boolean;
}

export interface WorkflowRuleSelectedItemData {
    item: WorkflowRuleListData;
    isWithShiftKey: boolean;
    isWithCtrlKey: boolean;
}

export interface WorkflowRuleTextValuChangeData {
    item: WorkflowRuleListData;
    value: string;
    value2?: string;
    atN_ID?: number;
}

export interface WorkflowRuleOperatorItemData {
    item: WorkflowRuleListData;
    operator: RuleOperator;
}

export interface WorkflowRuleFileData {
    fileData: any;
    isReplace: boolean;
}

export interface WorkflowRuleActionItemData {
    item: WorkflowRuleListData;
    action: number;
}

export enum RuleOperator {
    EQ = 'EQ',
    NE = 'NE',
    GT = 'GT',
    GE = 'GE',
    LT = 'LT',
    LE = 'LE',
    IN = 'IN'
}

export interface OperatorChangeData {
    selectedItem: WorkflowRuleListData;
    operator: RuleOperator;
}





