// import { extend } from 'webdriver-js-extender';
import { GridFilterKind, GridButtonType } from './enumeration';
import { MessageItemWrapper } from '../../mail-item-core';


export interface Group {
    readonly groupId: number;
    readonly groupName: string;
}


export enum RowItemChangeKind {
    IsExpand = 'IS_EXPAND',
    IsChecked = 'IS_CHECKED',
}

export interface Users {
    readonly groupId: number;
    readonly groupName: string;
}

export interface SelectedInfo {
    departmentId: number;
    userId: number;
    searchText: string;
    // dateFrom: string | Date;
    // dateTo: string | Date;
    // user: string;
   
}

export enum StatusType {
    Fail = 0,
    Success = 1,
}

export interface GroupResponse {
    data: Group[];
    status: StatusType;
}

export interface UsersResponse {
    data: Users[];
    status: StatusType;
}

export interface PostOfficeInboxSaveRequestViewModel {

    postOfficeInboxViewModels: PostOfficeInboxViewModel[];

}

export interface PostOfficeInboxViewModel {
    inboxId: number;
    inboxCurUser: string;
    inboxDocType: number;
    inboxDateCreated: string;
    inboxNote: string;
    inboxDocPath: string;
    inboxStatus: number;
    inboxInUseBy: string;
    inboxFirstMovedBy: string;
    inboxFirstMoveDate?;
    inboxLastMovedBy: string;
    inboxLastMoveDate?;
    inboxLastMovedTo: string;
    inboxGroupId: number;
    inboxDiarynetId?: number;
    inboxBarCode: string;
    inboxDepartment: string;
    inboxStatusName: string;
    inboxGroupName: string;
    inboxLettericon: string;
    inboxAction: number;
    inboxMessage: string;
}


export interface GridData extends PostOfficeInboxViewModel {
    isChecked: boolean;
    groupHash: string;
    docUrl?: string;
    type_icon: string;
    type_GlyphIcon: string;
    emailItem?: MessageItemWrapper;
    view?: boolean;
    letter_icon: string;
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
    kind: GridFilterKind;
    value: any;
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
}

export interface GridButtonAction {
    kind: GridButtonType;
    value: GridData;
}

export interface Department {
    readonly groupId: number;
    readonly groupName: string;
}



