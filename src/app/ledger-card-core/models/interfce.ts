import { PaginatorDef } from '../../core/lib/grid-model';
import { allGridFilterKind } from './enumeration';
import { ColumnDef } from '../../core/lib/grid-model';
import { eBillingType } from '../../core/lib/matter';

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

export interface MatterBalances {
    officeBalance: number;
    unpaidBills: number;
    currencyCode: string;
    dpuBalance: number;
    dubBalance: number;
    clientBalance: number;
    ddaBalance: number;
    wipBalance: number;
    utBalance: number;
    officeAMBalance: number;
    clientAMBalance: number;
    ddaamBalance: number;
    duuBalance: number;
}

export interface AllGridFilterModel {
    showDDA: boolean;
    showBalanceOnly: boolean;
    showCOS: boolean;
    showReversal: boolean;
    showURN: boolean;
    showSysBills: boolean;
    showTransPeriods: boolean;
    showOnlyOfficeTrans: boolean;
    showOnlyDisbuersements: boolean;
    periodText: string;
    isActiveClass: boolean;
    isBillsOnly: boolean;
}

export interface AllGridFilterUpdate {
    kind: allGridFilterKind;
    value: boolean;
}

export interface AllGrid {
    gridColumns: ColumnDef[];
    PaginatorDef: PaginatorDef;
    allGridPage: AllGridPageInfo;
    templet: SampleAllGridTemplet;

}

export interface DisbsGrid {
    gridColumns: ColumnDef[];
    PaginatorDef: PaginatorDef;
    disbsGridPage: DisbsGridPageInfo;

}

export interface BillGrid {
    gridColumns: ColumnDef[];
    PaginatorDef: PaginatorDef;
    billGridPage: BillGridPageInfo;
    total: BillGridTotal;
}

export interface GBPGrid {
    gridColumns: ColumnDef[];
    PaginatorDef: PaginatorDef;
    gbpGridPage: GBPGridPageInfo;

}

export interface DDAGrid {
    gridColumns: ColumnDef[];
    PaginatorDef: PaginatorDef;
    ddaGridPage: DDAGridPageInfo;

}

export interface SampleAllGridTemplet {
    allView: ColumnDef[];
    withOutDDA: ColumnDef[];
    balanceOnly: ColumnDef[];
    balanceWithDDA: ColumnDef[];
    allViewWithURN: ColumnDef[];
    withOutDDAAndURN: ColumnDef[];
    balanceOnlyWithURN: ColumnDef[];
    balanceWithDDAandURN: ColumnDef[];
    withOutDDAAndwithURN: ColumnDef[];
}

export interface BillGridPageInfo {
    total: number;
    data: BillGridData[];
}

export interface AllGridPageInfo {
    total: number;
    data: AllGridData;
}

export interface DisbsGridPageInfo {
    total: number;
    data: DisbsGridData;
}

export interface GBPGridPageInfo {
    total: number;
    data: GbpGridData;
}


export interface DDAGridPageInfo {
    total: number;
    data: DdaGridData;
}

export interface CurrenciesView {
    currencyCode: string;
    currencySign: string;
}

export interface ClientGrid {
    gridColumns: ColumnDef[];
    PaginatorDef: PaginatorDef;
    clientGridPage: ClientGridPageInfo;
}

export interface ClientGridPageInfo {
    total: number;
    data: ClientGridData;
}

export interface EChitGrid {
    gridColumns: ColumnDef[];
    PaginatorDef: PaginatorDef;
    data: EChitGridData;
}

export interface AllGridData {
    balance: number;
    clientBal: number;
    clientCr: number;
    clientDr: number;
    ddaCr: number;
    ddaDr: number;
    ddAbal: number;
    date: string;
    details: string;
    disbs: number;
    disputed: number;
    feeEarner: string;
    fullDetails: string;
    gross: number;
    id: string;
    net: number;
    office: number;
    officeBal: number;
    officeCr: number;
    officeDr: number;
    period: number;
    ref: string;
    reverse: number;
    table: string;
    type: string;
    uiType: number;
    URN: number;
    urn: number;
    vat: number;
}

export interface BillGridData {
    balance?: number;
    billedAmount?: number;
    dsbOVat?: number;
    dsbVat?: number;
    date?: string;
    details: string;
    disbs?: number;
    disputed: number;
    expensesNet: number;
    expensesVat: number;
    expenses: number;
    feeEarner: string;
    fullDetails: string;
    gross: number;
    id: string;
    net: number;
    outstandigAmount: number;
    pc: number;
    pdsb: number;
    paidAmount: number;
    period: number;
    ref: string;
    reverse: number;
    table: string;
    type: string;
    uiType: number;
    urn: number;
    unpaidAmount: number;
    vat: number;
}

export interface DisbsGridData {
    accountRef: string;
    amountPaid: number;
    amountPaidFC: number;
    balance: number;
    bank: string;
    billAmount: number;
    billNo: string;
    billURN: string;
    billed: string;
    chqLink: string;
    councelFee: number;
    currency: string;
    date: string;
    details: string;
    disputed: string;
    feeEarner: string;
    fullDetails: string;
    gross: number;
    iD: string;
    net: number;
    netFC: number;
    nominal: string;
    paid: number;
    period: string;
    ref: string;
    reverse: string;
    type: string;
    uIType: number;
    urn: string;
    vat: number;
    vatfc: string;
}

export interface GbpGridData {
    accountRef: string;
    balance: number;
    credit: number;
    date: string;
    debit: number;
    details: string;
    disputed: string;
    feeEarner: string;
    fullDetails: string;
    gross: number;
    id: string;
    net: number;
    period: number;
    ref: string;
    reverse: string;
    type: string;
    uiType: number;
    urn: string;
    vat: number;
}

export interface DdaGridData {
    accountRef: string;
    balance: number;
    credit: number;
    date: string;
    debit: number;
    details: string;
    disputed: string;
    feeEarner: string;
    fullDetails: string;
    gross: number;
    id: string;
    net: number;
    period: number;
    ref: string;
    reverse: string;
    type: string;
    uiType: string;
    urn: string;
    vat: number;
}

export interface ClientGridData {
    date: string;
    type: string;
    ref: string;
    details: string;
    debit: number;
    credit: number;
    balance: number;
}

export interface EChitGridData {
    iD: string;
    type: string;
    date: string;
    ref: string;
    reason: string;
    net: number;
    vat: number;
    gross: number;
    fee_Earner: string;
    payee: string;
    authorised: boolean;
}

export interface CurrencyLabel {
    lable1: string;
    lable2: string;
}

export interface BillGridTotal {
    vatTotal: number;
    pcTotal: number;
    expeTotal: number;
    disbsTotal: number;
    grossTotal: number;
    paidTotal: number;
    outsTotal: number;
}

export interface AllGridRespone {
    data: AllGridPageInfo;
}

export interface BillGridRespone {
    data: BillGridPageInfo;
}

export interface DisbsGridRespone {
    data: DisbsGridPageInfo;
}

export interface GBPGridRespone {
    data: GBPGridPageInfo;
}

export interface DDAGridRespone {
    data: DDAGridPageInfo;
}

export interface ClientGridRespone {
    data: ClientGridPageInfo;
}

export interface EChitGridRespone {
    data: EChitGridData;
}



