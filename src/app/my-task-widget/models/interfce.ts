export interface DataObjectResponse {
    data: GridDataObject;
    status: StatusType;
}

export interface GridDataObject {
    data: GridData[];
    total: number;
}

export interface GridData {
    action: boolean;
    appCode: string;
    appID: number;
    branchID: number;
    client: string;
    columnFolderId: number;
    date: Date;
    dateBy: Date;
    dateDone: Date;
    datedn: Date;
    documentFlowStatus: string;
    fileID: number;
    folderName: string;
    hasPassword: boolean;
    letter: string;
    matterDetails: string;
    matterReferenceNo: string;
    note: string;
    putOnBy: string;
    taskFor: string;
    taskID: number;
    workflowActions: string;
    selected?: boolean;
    expanded?: boolean;
    checkTREnable?: boolean;
    isTimeRecordingEnabled?: boolean;
}

export enum StatusType {
    Fail = 0,
    Success = 1,
}

