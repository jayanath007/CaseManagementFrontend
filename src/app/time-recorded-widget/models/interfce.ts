import { eBillingType } from '../../core/lib/matter';

export interface DataObjectResponse {
    data: GridDataObject;
    status: StatusType;
}

export interface GridDataObject {
    data: GridData[];
    total: number;
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
    fileId: number;
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
    matterCounter: number;
    ufnValue: string;
    eBilling: eBillingType;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}

export enum StatusType {
    Fail = 0,
    Success = 1,
}

export interface FromToDate {
    fromDate: Date;
    toDate: Date;
}

export interface FromToDateResponse {
    data: FromToDate;
    status: StatusType;
}
