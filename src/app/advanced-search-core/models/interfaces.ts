import { StatusType } from './enums';

// export interface AdvancedSearchViewModel {
//     searchClients: string;
//     searchMatters: string;
//     BranchId: number;
//     appID: number;
//     SearchColumnOption: string;
//     SearchMode: string;
//     SearchFields: string[];
// }
export interface MatterSearchGridData {
    appID: number;
    fileID: number;
    closed: boolean;
    lastUsed: Date;
    app_Code: string;
    branchID: string;
    feeEarner: string;
    reviewDate: Date;
    clientName: string;
    reviewNote: string;
    company_Name: string;
    matterDetails: string;
    matterReferenceNo: string;
    rateCategory?: string;
    eBilling?: string;
}
export interface MatterWrapResponse {
    total: number;
    data: GridRowItemWrapper[];
    loading: boolean;
    aggregates: Array<AggregatorViewModel>;
}

export interface GridRowListItem<T> {
    data: T;
    selected: boolean;
    expanded: boolean;
    loading?: boolean;
    financeDetails?: MatterFinance;
}
export type GridRowItemWrapper = GridRowListItem<Readonly<MatterSearchGridData>>;

export interface MatterResponse {
    data: MatterDataObject;
    status: string;
    messageBody: string;
    messageHeader: string;
    detailStatus: DetailStatusViewModel[];
   // totalBillOutstandingBalance: number;
   // totalMatterCount: number;
}
export interface MatterDataObject {
    data: MatterSearchGridData[];
    total: number;
    aggregates: Array<AggregatorViewModel>;
}
export interface DetailStatusViewModel {
    code: string;
    message: string;
    reference: string;
    messageType: string;
    severityLevel: string;
    exceptionType: string;
}
// export interface Department {
//     readonly groupId: number;
//     readonly selected: boolean;
//     readonly groupName: string;
// }
export interface Branch {
    branchId: number;
    branchName: string;
}
// export interface DepartmentResponse {
//     data: Department[];
//     status: StatusType;
// }

// export interface EmployeeDetails {
//     User: string;
//     Path: string;
//     Full_Name: string;
//     Designation: string;
//     User_Email: string;
//     User_MobileNo: string;
// }
// export interface MatterFinanceResponse {
//     data: MatterFinance; // { DateLastBill: string, UnpaidBill: number, ClientBal: number, WIPSum: number, WIPLimit: number };
//     status: string;
// }
export interface MatterFinance {
    wipSum: number;
    wipLimit: number;
    clientBal: number;
    unpaidBill: number;
    dateLastBill: string;
}


export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}


export interface DropdownListData {
    key: number;
    value: string;
    headers?: string[];
}

