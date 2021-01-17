import { StatusType } from './enums';

export interface FeeEarner {
    user_ID: string;
    selected: boolean;
    groupName: string;
    groupId: number;
}

export interface Folder {
    text: string;
    value: number;
    selected: boolean;
}

export interface ActionType {
    selected: boolean;
    text: string;
    value: number;
}
export interface FeeEarnerResponce {
    data: FeeEarner[];
    status: StatusType;
}
export interface FolderResponce {
    data: Folder[];
    status: StatusType;
}
export interface ActionTypeResponce {
    data: ActionType[];
    status: StatusType;
}

export interface AddEditTaskSaveSuccessInfo {
    isSuccess: boolean;
    msg: string;
}

export interface AddEditTaskViewModel {
    password: string;
    newPassword: string;
    confirmPassword: string;
    isRemovedAttachment: boolean;
    isRemovedPassword: boolean;
    isChangedPassword: boolean;
    client: string;
    matterReferenceNo: string;
    workflowActions: string;
    note: string;
    taskID: number;
    dateBy: string;
    taskFor: string;
    date: Date;
    putOnBy: string;
    columnFolderId: number;
    appCode: string;
    appID: number;
    fileID: number;
    branchID: number;
}

// export interface MatterInfo {
//     branchID: number;
//     appID: number;
//     fileID: number;
// }
export interface GridData {
    action: boolean;
    appCode: string;
    appID: number;
    billRequestId: number;
    branchID: number;
    client: string;
    columnFolderId: number;
    datedn?: string | Date;
    date?: string | Date;
    dateBy?: string | Date;
    dateDone?: string | Date;
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
export interface MatterResponce {
    ClientName: string;
    MatterReferenceNo: string;
    BranchID: number;
    AppID: number;
    AppCode: string;
    FileID: number;
    FeeEarner: string;
    var1: string;
    var2: string;
    var3: string;
    selected?: boolean;
    RateCategory?: string;
    eBilling?: string;
}
// export interface AddEditTaskInput {
//     headerText: string;
//     loginUser: string;
// }
export interface AddEditTaskValidationInfo {
    status: boolean;
    msg: string;
}

export interface AddEditTaskSuccessInfo {
    isSuccess: boolean;
    msg: string;
}

export interface Attachments {
    id?: string;
    name?: string;
    fileNote?: string;
    contentType?: string;
    base64String?: string;
    data?: string;
    size?: any | Blob;
    isInline?: boolean;
    contentId?: string;
    attachmentType?: string;
    isSelected?: boolean;
    diaryFolderId?: string;
    isUncharge?: boolean;
    uniqueId?: number;
    requestToView?: boolean;
    viewUrl?: string;
    extention?: string;
}

export interface MSGInfo {
    showMsg: boolean;
    msg: string;
    exitPopUp: boolean;
}

