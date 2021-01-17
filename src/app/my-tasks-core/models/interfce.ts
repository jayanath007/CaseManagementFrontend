import { gridFilterKind, GridButtonType } from './enumeration';
import { WorkflowMenuMetaDataWrapper } from '../../workflow-menu-core/models/interfaces';
import { eBillingType } from '../../core/lib/matter';
// import { MessageItemWrapper } from '../../mail-item-core/index';


export interface Department {
    readonly groupId: number;
    readonly groupName: string;
}


export interface UserPermission {
    readonly isAllGroups: boolean;
    readonly isAllUsers: boolean;
}

export interface SelectedInfo {
    departmentId: number;
    user: string;
    searchText: string;
}

export enum StatusType {
    Fail = 0,
    Success = 1,
}

export interface DepartmentResponse {
    data: Department[];
    status: StatusType;
}

export interface UserPermissionResponse {
    data: UserPermission;
    status: StatusType;
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
    groupHash?: string;
    groupRow?: GridGroupData;
    matterCounter?: number;
    ufnValue?: string;
    eBilling?: eBillingType;
    isProspectMatter: boolean;
    isLegalAid: boolean;
    billRequestId: number;
}

export interface GridDataObject {
    data: GridData[];
    total: number;
}

export interface GridFilterUpdate {
    kind: gridFilterKind;
    value: any;
}

export interface SummeryResponse {
    data: Summery;
    status: StatusType;
}

export interface GridDataObjectResponse {
    data: GridDataObject;
    status: StatusType;
}

export interface Summery {
    totalTaskCount: number;
    totalTasksDue: number;
    totalTasksOverdue: number;
}

export interface GridButtonAction {
    kind: GridButtonType;
    value: GridData;
    menuInfo?: WorkflowMenuMetaDataWrapper;
}

export interface TREnableResponse {
    data: TREnable;
    status: StatusType;
}

export interface TREnable {
    isTimeRecordingEnabled: boolean;
}

export interface MsgModel {
    isShow: boolean;
    msg: string;
}


export enum GroupMode {
    Default = 'View',
    Folder = 'Folder',
    Date = 'Do By',
}

export interface GridGroupData {
    readonly data?: GroupDataResponse;
    isExpand?: boolean;
    isLefNode?: boolean;
    groupHash: string;
    groupIds?: { group1: string, group2: string, group1Value: string, group2Value: string, };
    groupMode?: GroupMode;
    items?: GridGroupData[];
    currentItems?: number;
    totalItems?: number;
}

export interface GroupDataResponse {
    aggregates: string;
    count: number;
    field: string;
    hasSubgroups: boolean;
    selectorField: string;
    filterValue: string;
    value: string;
    items: GroupDataResponse[];
}
