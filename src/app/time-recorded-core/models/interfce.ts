import { gridFilterKind, GridButtonType } from './enumeration';
import { ColumnDef } from '../../core/lib/grid-model';
import { eBillingType } from '../../core/lib/matter';


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
    appId: number;
    appCode: string;
    bigNote: string;
    billNo: number;
    billed: number;
    branchId: number;
    client: string;
    clientName: string;
    dateBilled: string;
    dateDone: string;
    department: string;
    fileId: number;
    matter: string;
    matterReferenceNo: string;
    mpu: number;
    netBilled: string;
    timeEditNote: string; // TimeEditNote
    postingDate: string; // PostingDate
    rate: number;
    reviewDate: Date;
    reviewNote: string;
    surname: string;
    timeBillFE: string;
    timeDetails: string;
    timeFeeEarner: string;
    timeUniqueRef: number;
    units: string;
    value: number;
    closed: boolean;
    lastUsed: Date;
    select?: boolean;
    groupHash?: string;
    timeEditDetails: string; // TimeEditDetails
    companyName?: string;
    matterCounter?: number;
    ufnValue: string;
    eBilling: eBillingType;
    workType: number;
    eBillingPhaseID: number;
    eBillingTaskID: number;
    eBillingActivityID: number;
    crimeTimeId: number;
    classId: number;
    note: string;
    isProspectMatter: boolean;
    isLegalAid: boolean;
    timeEventId?: number;
}



export interface ItemRepository { [materRef: string]: GridRowItemWrapper; }

export interface RequestHashInfo {
    hashKey: string;
    lastTouch: Date;
    order: string[];
    total: number;
    loading: boolean;
    totalBillOutstandingBalance: number;
    totalMatterCount: number;
}

export interface Department {
    readonly groupId: number;
    readonly groupName: string;
}


export interface GridTemplete {
    allColumnDef: ColumnDef[];
    billdColumnDef: ColumnDef[];
    unBilldColumnDef: ColumnDef[];
}

export interface EmployeeDetails {
    User: string;
    Path: string;
    Full_Name: string;
    Designation: string;
    User_Email: string;
    User_MobileNo: string;
}


export interface Department {
    readonly groupId: number;
    readonly groupName: string;
}

export interface Type {
    readonly groupId: number;
    readonly groupName: string;
}

export interface Periods {
    readonly groupId: number;
    readonly groupName: string;
}

export interface UserPermission {
    readonly isAllGroups: boolean;
    readonly isAllUsers: boolean;
}

export interface SelectedInfo {
    departmentId: number;
    typeId: number;
    periodId: number;
    dateFrom: string | Date;
    dateTo: string | Date;
    user: string;
    searchText: string;
    isBillDate: boolean;
}

export enum StatusType {
    Fail = 0,
    Success = 1,
}

export interface DepartmentResponse {
    data: Department[];
    status: StatusType;
}

export interface TypesResponse {
    data: Type[];
    status: StatusType;
}

export interface PeriodsResponse {
    data: Periods[];
    status: StatusType;
}

export interface UserPermissionResponse {
    data: UserPermission;
    status: StatusType;
}

export interface GridResponse {
    bigNote: string;
    billNo: string;
    billed: boolean;
    client: string;
    dateBilled: string;
    dateDone: string;
    department: string;
    matter: string;
    matterReferenceNo: string;
    netBilled: number;
    note: string;
    surname: string;
    timeBillFE: string;
    timeDetails: string;
    timeUniqueRef: number;
    units: number;
    value: number;
}

export interface GridDataObject {
    data: GridResponse[];
    total: number;
    aggregates: any;
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

export interface SummeryResponse {
    data: Summery;
    status: StatusType;
}

export interface GridDataObjectResponse {
    data: GridDataObject;
    status: StatusType;
}

export interface Summery {
    billed: string;
    unbilled: string;
    units: number;
    totalTime: string;
    value: string;
}

export interface GridButtonAction {
    kind: GridButtonType;
    value: GridData | any;
    token?: string;
}


