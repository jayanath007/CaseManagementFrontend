import { gridFilterKind, GridButtonType } from './enumeration';
import { MessageItemWrapper } from '../../mail-item-core';
import { eBillingType } from '../../core/lib/matter';


export interface Department {
    readonly groupId: number;
    readonly groupName: string;
}


export interface Periods {
    readonly groupId: number;
    readonly groupName: string;
}

export interface SelectedInfo {
    departmentId: number;
    periodId: number;
    dateFrom: string | Date;
    dateTo: string | Date;
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

export interface PeriodsResponse {
    data: Periods[];
    status: StatusType;
}

export interface GridData {
    anchorType: string;
    appCode: string;
    appID: number;
    branchID: number;
    by: string;
    client: string;
    dateDone: Date;
    details: string;
    diary_UID: number;
    emailFrom: string;
    emailTo: string;
    fileNumber: number;
    folder: number;
    folderName: string;
    for: string;
    hasPassword: boolean;
    letter_icon: string;
    letter_name: string;
    matterReferenceNo: string;
    note: string;
    offlineStates: number;
    type: string;
    type_GlyphIcon: string;
    type_icon: string;
    matterFinance: MatterFinance;
    docUrl?: string;
    password?: string;
    emailItem?: boolean;
    view?: boolean;
    groupHash?: string;
    matterCounter: number;
    ufnValue: string;
    eBilling: eBillingType;
    checkedOutByUser: string;
    checkedOutHashKey: string;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}

export interface MatterFinance {
    clientBal: number;
    dateLastBill: string;
    unpaidBill: number;
    wipLimit: number;
    wipSum: number;
}

export interface GridDataObject {
    data: GridData[];
    total: number;
    group: any[];
}

export interface GridFilterUpdate {
    kind: gridFilterKind;
    value: any;
    fromDate?: any;
    toDate?: any;
}

export interface FromToDate {
    fromDate: Date;
    toDate: Date;
}

export interface FromToDateResponse {
    data: FromToDate;
    status: StatusType;
}

export interface MatterFinanceResponse {
    data: MatterFinance;
    status: StatusType;
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
    callsIn: number;
    callsOut: number;
    emailsIn: number;
    emailsOut: number;
    lettersIn: number;
    lettersOut: number;
}

export interface GridButtonAction {
    kind: GridButtonType;
    value: GridData;
}export interface GridButtonAction {
    kind: GridButtonType;
    value: GridData;
}

export enum GroupMode {
    Default = 'View',
    ByUser = 'By',
    Date = 'DateGroup',
    ByUserDate = 'ByUserDate',
    DateByUser = 'DateByUser',
}



