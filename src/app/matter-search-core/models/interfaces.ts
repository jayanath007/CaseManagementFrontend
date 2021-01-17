import { StatusType } from './enums';
import { eBillingType } from '../../core/lib/matter';

export interface MatterSearchGridData {

    appID: number;
    fileID: number;
    closed: number;
    lastUsed: Date;
    app_Code: string;
    branchID: number;
    feeEarner: string;
    reviewDate: Date;
    clientName: string;
    client_Ref: string;
    reviewNote: string;
    company_Name: string;
    matterDetails: string;
    matterReferenceNo: string;
    matterCounter: number;
    rateCategory?: string;
    eBilling?: eBillingType;
    isCompleteMatter: boolean;
    isLegalAid: boolean;
    isProspectMatter: boolean;
    legalLAACivilBilling: boolean;
    ufnValue: string;
    var1?: string;
    var2?: string;
    var3?: string;
    var4?: string;
    var5?: string;
    isPlotMasterMatter?: boolean;
}
export interface MatterWrapResponse {
    total: number;
    data: GridRowItemWrapper[];
    loading: boolean;
    aggregates: Array<AggregatorViewModel>;
}

export interface GridRowListItem<T> {
    data: T;
    selected?: boolean;
    expanded?: boolean;
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
    totalBillOutstandingBalance: number;
    totalMatterCount: number;
}
export interface MatterDataObject {
    data: MatterSearchGridData[];
    total: number;
    aggregates: Array<AggregatorViewModel>;
}

export interface MatterDataResponse {
    data: {
        matters: MatterSearchGridData[];
        totalBillOutstandingBalance: number;
        totalMatterCount: number;
    };
    total: number;
    aggregates: Array<AggregatorViewModel>;
}

export interface Department {
    readonly groupId: number;
    readonly selected: boolean;
    readonly groupName: string;
}

export interface DepartmentResponse {
    data: Department[];
    status: StatusType;
}

export interface EmployeeDetails {
    User: string;
    Path: string;
    Full_Name: string;
    Designation: string;
    User_Email: string;
    User_MobileNo: string;
}
export interface MatterFinanceResponse {
    data: MatterFinance; // { DateLastBill: string, UnpaidBill: number, ClientBal: number, WIPSum: number, WIPLimit: number };
    status: string;
}
export interface MatterFinance {
    wipSum: number;
    wipLimit: number;
    clientBal: number;
    unpaidBill: number;
    dateLastBill: string;
}

export interface DetailStatusViewModel {
    code: string;
    message: string;
    reference: string;
    messageType: string;
    severityLevel: string;
    exceptionType: string;
}
export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}
export interface MatterInfoViewModel {
    matterCounter: number;
    matterRef: string;
    isPlotMasterMatter: boolean;
    isPlotMatter: boolean;
}


export interface ReviewNoteResponce {
    keyMessage: string;
    reviewDate: string;
    reviewNote: string;

}

export interface MatterInfoResponse {
    data: MatterInfoViewModel;
    status: string;
}
