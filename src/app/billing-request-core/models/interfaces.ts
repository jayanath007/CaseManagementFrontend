import { AddressType } from './enums';

export interface MatterData {
    readonly matterRef: string;
    readonly matterCode: string;
    readonly matterDetails: string;
    readonly clientRef: string;
    readonly clientName: string;
    readonly isClosed: boolean;
    readonly appId: number;
    readonly fileId: number;
    readonly branchId: number;
    readonly appCode: string;
    readonly branchName: string;
    readonly feeEarner: string;
    readonly eBilling: string;
    readonly isProspectMatter: string;
}
export interface DpsSelectModel<T> {
    data: T;
    selected: boolean;
}
export enum StatusType {
    Fail = 0,
    Success = 1,
}
export interface FeeEarner {
    key: string;
    value: string;
}
export interface FeeEarnerResponce {
    data: FeeEarner[];
    Status: StatusType;
}
export interface VatCode {
    vatCode: string;
    vatDescription: string;
    vatRate: number;
}
export interface NominalList { // need to change
    noM_Account_Ref: string;
    noM_Account_Name: string;
}
export interface DescriptionList { // need to change
    sC_ID: number;
    sC_Desc: string;
    sC_Code: string;
    sC_Type: string;
}
export interface KeyValue {
    key: string;
    value: string;
    other: string;
}
export interface BillingRequestViewModel {
    billingOption: string;
    billToAmount: string;
    billToDate?: string;
    matterRef: string;
    timRef: number;
}
export interface BillingDisbursmentRequestViewModel {
    billingOption: string;
    billToAmount: string;
    billToDate?: string;
    matterRef: string;
    disbursementsBeforeDate: string;
}
export interface BillingRequestImportGridData<T> {
    data: T;
    selected: boolean;
}
export interface BillingRequestImportGridDataWrapper<T> {
    gridData: T;
    unitTotal: number;
    total: number;
    billTo: string;
    vatCode: string;
    nominalVal: string;
    allocateTo: string;
}
// export type BillingRequestImportGridDataWrapper = BillingRequestImportGridData<Readonly<T>;

export interface BillingTimeRecordResponseModel {
    timMatterRef: string;
    timUniqueRef: number;
    timFeeEarner: string;
    timDate?: string;
    timUnits?: number;
    timDetails: string;
    timBilled?: number;
    timRate?: number;
    timVal?: number;
    timTsURN?: number;
    salVatCode: string;
    timTType: string;
    timInBill?: boolean;
    timNotes: string;
    timMPU?: number;
    timInBillrequest?: boolean;
    timUNposted?: number;
    uplift?: number;
    timVat?: number;
    timShowVal?: number;
    timBillEarner: string;
    nominalCode?: number;
    nominal: number;
    recordType: string; // selectUnSelectVal1: string;
}
export interface NominalCodeRequestViewModel {
    feeEarner: string;
    matterRef: string;
}
export interface BillingRequestProcessViewModel {
    billTo: string;
    vatCode: string;
    uplift: string;
    sumOfSelectedUnits: number;
    sumOfSelectedValues: number;
    allocatedTo: string;
    nominal: string;
    nominalCode: number;
    vatId: number;
    timFeeEarner: string;
    recordType: string;
    billingDetails: BillingTimeRecordResponseModel[];
}
export interface TimeProfitHeaderResponseModel<T> {
    data: T;
    rowId: string;
    selected: boolean;
    isTimeHeaderGrid: boolean;
    isTimeItem: boolean;
}
export interface BillingRequestTimeProfitHeaderResponseModel {
    billFeeEarner: string;
    feeEarner: string;
    details: string;
    itemNo: number;
    mpu: number;
    net: number;
    nominal: number;
    notes: string;
    oNet: number;
    oVat: number;
    recordType: string;
    timTType: string;
    uniqueRef: string;
    units: number;
    urn: string;
    vat: number;
    vatCode: string;
    billingDetails: BillingTimeRecordResponseModel[];
    grossVal: number;
}

export interface DisbursmentHeaderWrapperModel<T> {
    data: T;
    rowId: string;
    selected: boolean;
    isDisbursmenGrid: boolean;
    isDisbursmenItem: boolean;
}
export interface BillingRequestDisbursExpenseHeaderViewModel {
    feeEarner: string;
    details: string;
    net: number;
    vat: number;
    vatCode: string;
    itemDate: string;
    grossVal: number;
    recordType: string;
    nominal: string;
    disbursmentItemDetails: DisbursementResponseModel; // []
}
export interface DisbursementResponseModel {
    feeEarner: string;
    details: string;
    net?: number;
    vat?: number;
    nominal: string;
    itemDate?: string;
    uniqueRef: number;
    purRef: string;
    purAccountRef: string;
    recordType: string;
    purUniqueRef: string;
    purBankCode: string;
    purInBillRequest?: boolean;
    urN?: number;
    purPaid?: number;
    purInBill?: boolean;
    vatCode: string;
    onet: number;
    ovat: number;
    pdsb: number;
    itemNo: number;
    grossVal: number;
    selectUnSelectVal: string;
}
export interface SelectInput {
    key: any;
    value: any;
}
export interface HeaderGridDataModel<T> {
    popupType: string;
    selectedRow: T;
}
export interface ValidationInfo {
    status: boolean;
    msg: string;
}
export interface BillingRequestRequiredField {
    feeEarnerSelectedValue: SelectInput;
    descriptionSelectedValue: SelectInput;
    vatCodeSelectedValue: SelectInput;
    nominalSelectedValue: SelectInput;
    netVal: number;
    vatVal: number;
    grossVal: number;
}
export interface PrintSettingModel { // need to change
    userRef: string;
    isExsitBillLayoutLocation: number;
    chkShowTimeBreakdown: boolean;
    chkShowDisbBreakdown: boolean;
    chkGroupTimeReportByFeeEarner: boolean;
    chkShowGrandTotal: boolean;
    chkShowFESubTotals: boolean;
    chkShowValues: boolean;
    chkShowTimeNotes: boolean;
    chkShowMinutes: boolean;
    chkPromptForMoneyOnAccount: boolean;
    chkSaveAsWord: boolean;
    chkShowTimeDates: boolean;
    chkShowTimeDetails: boolean;

    groupTime: boolean;
    bIL_ShowPreviousDPB: boolean;

    billDefaultLayout: number;
    timeDefaultLayout: number;
    disbDefaultLayout: number;
    billLayoutSelectedLocation: string; // for save only
    timeLayOutSelectedLocation: string; // for save only
    disLayOutSelectedLocation: string; // for save only
}

export interface MatterBalancesModel { // need to change
    vatVal: number;
    grossVal: number;
}
export interface ProformaText { // need to change
    headerText: string;
    billText: string;
    billNumber: string;
    billDate: string;
    billAddressee: string;
    requestButtonText: string;
}
export interface TotalValues {
    totalFeesValue: number;
    totalFeesVat: number;
    totalDisbursmentValue: number;
    totalDisbursmentVat: number;
    totalExpenseValue: number;
    totalExpenseVat: number;
    totalNetSum: number;
    totalVatSum: number;
    billTotal: number;
}
export interface PrintAllDropDownData {
    printLayOutBillDropDown: [];
    printLayOutTimeDropDown: [];
    printLayOutDisbDropDown: [];
}
export interface QuickBillResponseModel {
    billingTimes: BillingRequestTimeProfitHeaderResponseModel[];
    billingDisb: DisbursementResponseModel[];
}
export interface ControllerDataModel {
    controllerName: string;
    value: any;
}
export interface CaseFileIdentity {
    branchId: number;
    appId: number;
    fileId: number;
}
export interface BillingRequestSavePrintViewModel {
    billRequestType: string;
    printSaveMode: string;
    billFormMode: string; // CreateBill =1;
    caseFileIdentity: CaseFileIdentity;
    matterRef: string;
    billRequestID: number;
    billNo: string;
    billText: string;
    matterDetails: string;
    billDate: string;
    narrative: string;
    billAddressee: string;
    adminNotes: string;

    radAddCorrespondence: boolean;
    radAddStatement: boolean;
    radAddBilling: boolean;
    letterAddressee: string;
    clientRef: string;
    clientName: string;
    addressBillingAddr1: string;
    addressBillingAddr2: string;
    addressBillingTown: string;
    addressBillingCounty: string;
    addressBillingPostcode: string;
    amountOnAccount: number;
    vatTotal: number;
    timeVAT: number;
    netTotal: number;
    grossTotal: number;
    chkProforma: boolean;
    chkBill: boolean;

    isMultiCurrency: boolean; // backend
    showIndividualWIPOnBill: boolean; // backend

    billingRequestOptions: PrintSettingModel;
    billingHeaderOptions: PrintSettingModel;
    billingReport: []; // empty arry erquest by Suren
    billingTime: BillingTimeRecordResponseModel[];
    billingDisbs: DisbursementResponseModel[];
}
export interface BillingAddressResponceModel {
    addresType: AddressType;
    addressBillingAddr1: string;
    addressBillingAddr2: string;
    addressBillingAddr3: string;
    addressBillingAddr4: string;
    addressBillingPostcode: string;
}
export interface BillingAddressRequestViewModel {
    matterRef: string;
    clientRef: string;
    addCorrespondence: boolean;
    addStatement: boolean;
    addBilling: boolean;
    addOther: boolean;
}

export interface BillingAddressRequestModel {
    matterRef: string;
    clientRef: string;
    addCorrespondence: boolean;
    addStatement: boolean;
    addBilling: boolean;
    addOther: boolean;
}
export interface DropdownDataResponceModel {
    userDefault: string;
    userRepArchive: boolean;
    userRepID: number;
    userRepLocation: string;
    userRepName: string;
    userRepType: number;
    userReportTypeDescription: string;
}
export interface BillingAddressUpdateRequestViewModel {
    billingAddressRequestViewModel: BillingAddressRequestModel;
    billingAddressUpdateViewModels: BillingAddressResponceModel[];
}
export interface BillingRequestReportViewModel {
    attachmentType: number;
    base64String: string;
    contentType: string;
    data: string;
    dpsDiaryNetInfo: string;
    filePath: string;
    id: number;
    isInline: boolean;
    name: string;
    size: number;
}
export interface NominalRequestModelModel {
    feeEarner: string;
    matterRef: string;
    branchId: number;
}
export interface EditTimeRecordData {
    timUniqueRef: number;
    timDetails: string;
    timNotes: string;
}

export interface PrintPreviewPathResponce {
    fileName: string;
    filePath: string;
}

export interface BillRequestEditData {
    billingDisbursments: DisbursementResponseModel[];
    billingRequestTimes: BillingTimeRecordResponseModel[];
    enableEditData: boolean;
    postingDateText: string;
    adminNotes: string;
    narrative: string;
    billAddressee: string;
    billDate: string;
    billNo: string;
    billText: string;
}

export interface BillingRequestInputData {
    matterData: { matterReferenceNo: string, branchID: number };
    billRequestId?: number;
    diaryId?: number;
}

