import { eBillingType } from './../../core/lib/matter';
import { PaginatorDef } from './../../core/lib/grid-model';
import { ColumnDef } from '../../core/lib/grid-model';
import { Condition, FieldSort, Filter } from '../../odata';

export interface PreviousTransGrid {
    gridColumns: ColumnDef[];
    PaginatorDef: PaginatorDef;
    allGridPage: AllGridPageInfo;
}
export interface FilterOptionsViewModel {
    showDDA: boolean;
    showCOS: boolean;
    showReversal: boolean;
    hideSystemBills: boolean;
    showOnlyOfficeTrans: boolean;
    showOnlyDisbuersements: boolean;
    Period?: string;
}
export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: Filter<Filter<Condition>> | Filter<Condition>;
    aggregators?: Array<AggregatorViewModel>;
}
export interface AggregatorViewModel {
    Field: string;
    Aggregate: string;
}
export interface AllGridRespone {
    total: number;
    data: AllGridPageInfo;
    group?: {};
    aggregates?: string;
}
export interface AllGridPageInfo {
    total: number;
    data: AllGridData;
    group?: {};
    aggregates?: string;
}
export interface AllGridData {
    account: string;
    clientBal: number;
    clientCr?: number;
    clientDr?: number;
    date: string;
    ddDbal: number;
    ddaDr?: number;
    ddaCr?: number;
    details: string;
    disputed?: number;
    feeEarner?: string;
    fullDetails?: string;
    gross?: number;
    id?: string;
    net?: number;
    officeBal: number;
    officeCr?: number;
    officeDr: number;
    period?: number;
    ptId: number;
    ref: string;
    reverse?: number;
    type: string;
    uiType: number;
    urn?: number;
    vat?: number;
    // disbs: number;
    // office: number;
    // table: string;
    // ddAbal: number;
    // balance: number;
}
export interface PreviousTransInput {
    matterData: MatterData;
}

export interface GridFilterModel {
    showAll: boolean;
    showOffice: boolean;
    showClient: boolean;
}
export interface MatterData {
    appDescription: string;
    appID: number;
    app_Code: string;
    branchID: number;
    branchName: string;
    clientBal: string;
    clientName: string;
    clientRef: string;
    client_Address1: string;
    client_Address2: string;
    client_FirstName: string;
    client_LastName: string;
    client_Ref: string;
    closed: number;
    closedDate: string;
    company_Name: string;
    completionDate: string;
    dateLastBill: string;
    department_Name: string;
    feeEarner: string;
    fileID: number;
    lastUsed: string;
    location: string;
    matterCounter: number;
    matterDetails: string;
    matterReferenceNo: string;
    officeBalance: number;
    rateCategory: string;
    reviewDate: Date;
    reviewNote: string;
    startDate: string;
    unpaidBill: number;
    wipLimit: number;
    wipsum: number;
    ufnValue: string;
    eBilling: eBillingType;
    isPlotMatter?: boolean;
    matterData: boolean;
    isPlotMasterMatter?: boolean;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}
