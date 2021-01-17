
import { EChitPopupInputType, ChequeRequestType } from './enum';


export interface ExtraEChitPopupInput {
    appCode: string;
    matterEBilling: string;
    matterIsLegalAid: boolean;
    branchId: number;
    appId: number;
    fileId: number;
}

export interface EChitPopupInput extends ExtraEChitPopupInput {
    type?: EChitPopupInputType;
    matterId: string;
    matterDetailsName: string;
    data?: WorkflowEchitData;
    matterInfo?: any;
}



export interface DropdownListData {
    key: number;
    value: string;
}

export interface VatCode {
    vatCode: number;
    vatDescription: string;
    vatRate: string;
}

export interface Branch {
    branchId: number;
    branchName: string;
}

export interface ShortcutType {
    sC_ID: number;
    sC_Desc: string;
    sC_Code: string;
    sC_Type: string;
}

export interface MatterBalance {
    billBal: number;
    cliBal: number;
    ddaBal: number;
    disbBal: number;
    row: string;
    timBal: number;
    clientCellString?: string;
}

export interface EChitPrint {
    appID: number;
    branchID: number;
    fileID: number;
    eChitID: number;
    diaryId: number;
    isAddDiaryEvent: boolean;
    precedentHWorkType?: number;
    isSameAmountOnMatter: boolean;
}

export interface EchitModel {

    typeValue: string;
    matterRef: string;
    supplier: string;
    path: string;
    net: string;
    receiptType: number;
    vatAmount: number;
    vatCode: string;
    payee: string;
    payer: string;
    feeEarner: string;
    feeEarnerName?: string;
    dateRequired: Date;
    reason: string;
    reference: string;
    supplierRef: string;
    supplierSearch: string;
    invoiceRef: string;
    toMatterRef: string;
    textRef: string;
    isCouncelFees: boolean;
    isIncludeSupplier: boolean;
    bankAccountName: string;
    bankAcc: string;
    bankSortCode: string;
    nominal: string;
    branch: string;
    gross: string;
    rate: string;
    isAlternativeCommand: boolean;
    councelFees: string; // c /p
    notes: string;
    isSupplierVisible: boolean;
    isSupplier: boolean;
    cqClient: boolean;
    cqType: number;
    cqAnticipated: boolean;
    isDoNotAddDiaryRecord: boolean;
    isAddDiaryEvent: boolean;
    isSinglePosting: boolean;
    isCheckSameAmount?: boolean;
    addDiaryEntry?: boolean;
    classId: number;
    subClassId: number;
    telephoneAdvice: boolean;
    fee?: number;
    disbType?: number;
    workType?: number;
}


export interface PostChequeData {
    matterRef: string;
    supplier: string;
    isSupplierVisible: boolean;
    isIncludeSupplier: boolean;
    path?: any;
    net?: any;
    isAlternativeCommand: boolean;
    typeValue?: any;
    receiptType?: any;
    vatAmount: string;
    vatCode: string;
    payee: string;
    payer: string;
    feeEarner: string;
    dateRequired: string;
    currentDate: Date;
    reason: string;
    reference: string;
    textRef: string;
    supplierRef: string;
    invoiceRef: string;
    bankAccountName?: any;
    bankAcc?: any;
    bankSortCode?: any;
    notes: string;
    nominal: string;
    isDoNotAddDiaryRecord: boolean;
    isAddDiaryEvent: boolean;
    isSinglePosting: boolean;
    isCouncelFees?: any;
    feeEarnerName: string;
    classId: number;
    subClassId: number;
    telephoneAdvice: boolean;

}

export interface WorkflowEchitData {
    postChequeData: PostChequeData;
    postingTypeID: ChequeRequestType;
    status: boolean;
    startVariable: number;
    addDiaryEntry: boolean;
    matterRef?: any;
    matterDetail: string;
    action: string;
}

export enum EchitCloseInfo {
    ExitByUser = 'ExitByUser',
    ExitWithSaveSuccess = 'ExitWithSaveSuccess'
}


export interface PrecedentHDis {
    disbursmentTypeList: DropdownDisb[];
    workTypeList: WorkTypeList[];
}

export interface DropdownDisb {
    itemValue: number;
    itemName: string;
}
export interface WorkTypeList {
    workTypeID: number;
    units: number;
    cost: number;
    workType: string;
    expDisb: number;
    courtFee: number;
    juniorCLFee: number;
    leadClFee: number;
    otherDisbs: number;
    expFee: number;
}


export interface PresidentHDisbRequest {
    dpsEventId: number;
    precedentHDisbCategory: number;
    precedentHWorktype: number;
    matRef: string;
    feeEarner: string;
    supplierRef: string;
    reason: string;
    dateRequested: Date;
    net: string;
    vat: number;
    precedentHExperCostCourtFeesNet: number;
    precedentHExperCostCourtFeesVAT: number;
    itemValue: number;
    disbVATTotal: number;
}

export interface DisburcementValus {
    disbuValue: number;
    disbuVat: number;
    feeValue: number;
    feeVat: number;
}

export interface IncDisbuBreakDown {
    type: number;
    incDisb: number;
}







export interface MatterRefData {
    matterRef: string;
    details: string;
    feeEarner: string;
    accountName: string;
}

