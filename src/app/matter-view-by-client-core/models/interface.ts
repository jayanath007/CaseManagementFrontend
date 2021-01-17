export interface GridDataObjectResponse {
    data: GridDataObject;
    status: StatusType;
}


// import { gridFilterKind } from './enumeration';
import { ColumnDef } from '../../core/lib/grid-model';


export interface GridRowListItem<T> {
    data: T;
    selected: boolean;
    expanded: boolean;
    loading?: boolean;
    financeDetails?: MatterFinance;
}
export type GridRowItemWrapper = GridRowListItem<Readonly<GridData>>;

export interface MatterFinance {
    wipSum: number;
    wipLimit: number;
    clientBal: number;
    unpaidBill: number;
    dateLastBill: string;
}

export interface GridData {
    appID: number;
    fileID: number;
    closed: boolean;
    isCompleteMatter: boolean;
    lastUsed: Date;
    app_Code: string;
    branchID: number;
    feeEarner: string;
    reviewDate: Date;
    clientName: string;
    reviewNote: string;
    company_Name: string;
    matterDetails: string;
    matterReferenceNo: string;
    rateCategory?: string;
    select?: boolean;
    eBilling?: string;
    isLegalAid?: boolean;
}

export interface ItemRepository { [materRef: string]: GridRowItemWrapper; }

export enum StatusType {
    Fail = 0,
    Success = 1,
}

export interface GridResponse {
    appID: number;
    fileID: number;
    closed: boolean;
    isCompleteMatter: boolean;
    lastUsed: Date;
    app_Code: string;
    branchID: number;
    feeEarner: string;
    reviewDate: Date;
    clientName: string;
    reviewNote: string;
    company_Name: string;
    matterDetails: string;
    matterReferenceNo: string;
    rateCategory?: string;
}

export interface GridDataObject {
    data: GridResponse[];
    total: number;
    aggregates: any;
}

// export interface GridFilterUpdate {
//     kind: gridFilterKind;
//     value: any;
//     fromDate?: any;
//     toDate?: any;
// }


export interface GridDataObjectResponse {
    data: GridDataObject;
    status: StatusType;
}

