import { DataSourceRequestViewModel, ColumnDef } from '../../core/lib/grid-model';
import { DetailStatusViewModel } from './../../core/lib/data-response';
import { LeaseHold, PropertyQuoteRequestKey, OpportunityType } from './enums';
import { MatterSearchGridData } from '../../core/lib/matter';
import { PropertyQuoteApp } from '../../core/lib/web-quote';

export class GridRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public OpportunityStatus: number) { }
    public GridRequestToPost() {
        return {
            DataSourceRequestViewModel: this.dataSourceInfo,
            OpportunityStatus: this.OpportunityStatus
        };
    }
}
export interface DropdownList {
    key: number;
    value: string;
    isSelected?: boolean;
    description1: string;
    description2: string;
}
export interface FeeEarnerList {
    key: string;
    value: string;
    isSelected?: boolean;
    description1: string;
    description2: string;
}
export interface StatusList {
    key: number;
    value: string;
    isSelected?: boolean;
}
export interface LookupInputData {
    lookupTypeTag: string;
}
export interface Introducer {
    luP_Code: string;
    luP_Description: string;
    luP_Hidden: boolean;
    luP_ID: number;
    luP_LUTID: number;
    luP_LookupID: any;
    luP_VariantValue: any;
    lookupType_LUT_ID: number;
    isDirty?: boolean;
    isDelete?: boolean;
    isSelected?: boolean;
}
export interface GridDataResponceViewModel {
    data: OpportunityGridDataViewModel[];
    total?: number;
    aggregates?: Array<AggregatorViewModel>;
    group?: any[];
}
export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}

export interface QuoteEditData {
    propertyQuoteData: PropertyQuoteRequest;
    enquiryInfo: EnquiryInfoViewModel;
    amount?: number;
    quoteDis?: number;
    otherFees?: number;
    templete?: string;
}
export interface OpportunityGridDataViewModel extends QuoteEditData {
    address1: string;
    address2: string;
    clientName: string;
    clientRef: string;
    closeNote: string;
    closedDate?: string;
    companyName: string;
    conflictCount: number;
    conflictRunDate?: string;
    country: string;
    department: string;
    departmentId?: number;
    email1: string;
    email2: string;
    enquiryDateOn: string;
    enquiryId: number;
    feeEarner: string;
    firstName: string;
    introducer: number;
    introducerDescription: string;
    lastName: string;
    matterRef: string;
    notes: string;
    opportunityNumber: string;
    postCode: string;
    quoteCount; number;
    quoteRunDate?: string;
    town: string;
    workTypeId?: number;
    workType: string;
    selected: boolean;
    appCode: string;
    opportunityType?: OpportunityType;
    isVisibleMatDetails2?: boolean;
}
export interface OpportunitySaveViewModel extends QuoteEditData {
    clientRef: string;
    lastName: string;
    firstName: string;
    companyName: string;
    houseNumber: string;
    address1: string;
    address2: string | number;
    town: string | number;
    country: string | number;
    postCode: string;
    email1: string;
    email2: string;
    introducer: string | number;
    introducerDescription: string;
    departmentId: number;
    workTypeId: number;
    feeEarner: string;
    note: string;
    contactId?: string | number;
    enquiryId: number;
    clientName?: string;
    quoteCount?: number;
    workType: string;
    enquiryDateOn: string;
    conflictCount: number;
    matterRef?: string;
    appCode: string;
    matterDetails1?: string;
    matterDetails2?: string;
    isWebQuoteOpportunity?: boolean;
    opportunityNumber?: string;
    opportunityType?: OpportunityType;
    isVisibleMatDetails2?: boolean;
    mobileNo: string;
    workTelNo: string;
    birthDate: string;
    title: number;
}

export interface ClientSearchResultViewModel {
    salesCounterId: number;
    salesAccountRef: string;
    type: string;
    lastName: string;
    firstName: string;
    houseNo: string;
    accountName: string;
    companyName: string;
    email1: string;
    email2: string;
    salesIntroductionId: number;
    salesContactId: string;
    address1: string;
    address2: number;
    town: number;
    country: number;
    postCode: string;
    mobileNo: string;
    workTelNo: string;
    birthDate: string;
    title: number;
}
export interface OpportunityValidationInfo {
    status: boolean;
    msg: string;
}
export interface OpportunityLoadingType {
    sendSaveQuoteLoading: boolean;
    savedGridLoading: boolean;
    closeOpportunityLoading: boolean;
    createCaseFileLoading: boolean;
    editData: boolean;
}
export interface QuoteGenarateResponce {
    data: { ewsId: string, id: string };
    detailStatus: DetailStatusViewModel[];
}
export interface OpportunityClosedViewModel {
    opportunityId: number;
    closeDate: string;
    clientName: string;
    department: number;
    workType: number;
    feeEarner: string;
    note: string;
}
export interface ExtraColumnDef {
    [token: number]: ColumnDef[];
}
export interface OppertunityHistory {
    date: string;
    details: string;
    documentPath: string;
    isDocumentExists: boolean;
    opportunityId: number;
    opportunityTransId: number;
    opportunityType: string;
    userBy: string;
    userFor: string;
}
export interface PropertyQuoteType {
    appId: PropertyQuoteApp;
    appDesc: string;
    enabled: boolean;
    order: number;
    info: string;
    icon: string;
    fontCollor: string;
    spitfireAppCode: string;
}

export interface PropertyQuoteRequest {
    [PropertyQuoteRequestKey.reportId]: number;
    [PropertyQuoteRequestKey.appId]: PropertyQuoteApp;
    [PropertyQuoteRequestKey.isEngProperty]: boolean;
    [PropertyQuoteRequestKey.martgage]: boolean;
    [PropertyQuoteRequestKey.sellShare]: boolean;
    [PropertyQuoteRequestKey.buyShare]: boolean;
    [PropertyQuoteRequestKey.buyLeasehold]: LeaseHold;
    [PropertyQuoteRequestKey.saleleasehold]: LeaseHold;
    [PropertyQuoteRequestKey.hipsLeasehold]: LeaseHold;
    [PropertyQuoteRequestKey.branchId]: number;
    [PropertyQuoteRequestKey.purchesValue]: number;
    [PropertyQuoteRequestKey.saleValue]: number;
    [PropertyQuoteRequestKey.hIPsValue]: number;
    [PropertyQuoteRequestKey.lasId]?: number;
    [PropertyQuoteRequestKey.isBuyHouse]: boolean;
    [PropertyQuoteRequestKey.isFirstTimeBuyer]: boolean;
    [PropertyQuoteRequestKey.isNewBuild]: boolean;
    [PropertyQuoteRequestKey.isBuyToLet]: boolean;
    [PropertyQuoteRequestKey.isSecondProperty]: boolean;
    [PropertyQuoteRequestKey.isRightToBuy]: boolean;
    [PropertyQuoteRequestKey.isSaleHouse]: boolean;
    [PropertyQuoteRequestKey.purchesProfCostDis]: CostDiscount;
    [PropertyQuoteRequestKey.saleProfCostDis]: CostDiscount;
    [PropertyQuoteRequestKey.hipsProfCostDis]: CostDiscount;
}
export interface WebQuoteLocalSearch {
    localSearchRateId: number;
    localAuthority: string;
    localSearchRates: number;
    companyId: number;
}

export interface WebQuoteBranch {
    branchId: number;
    spitfireBranchId: number;
    branchName: string;
    branchEmail: string;
    branchContact: string;
    branchAddress: string;
}

export interface WebQuoteCost {
    costId: number;
    itemName: string;
    description: string;
    price: number;
    vatable: boolean;
    isFee: boolean;
    optional: boolean;
    disable: boolean;
    tenure: LeaseHold;
    appId: string;
    companyId?: number;
    app: string;
    company?: string;
    isExtraCharges: boolean;
    varMappingId: string;
    branchId: number;
}

export interface PropertyQuReport {
    pData: PropertyQuReportview;
    sData: PropertyQuReportview;
    hData: PropertyQuReportview;
}
export interface PropertyQuReportview {
    price: number;
    mortVal: number;
    owner: number;
    stampDuty: number;
    landRegFee: number;
    lasRate: number;
    profCosts: number;
    total: number;
    vat: number;
    ourtot: number;
    repVatItem: Cost[];
    repNonVatItem: Cost[];
    extraCostItems: Cost[];
    feeCostItems: Cost[];
    repVatItemTotal: number;
    repNonVatItemTotal: number;
    extraCostItemsTotal: number;
    feeCostItemsTotal: number;
    vatPercentage: number;
}
export interface Cost {
    costId?: number;
    itemName: string;
    description: string;
    price: number;
    vatable: boolean;
    optional: boolean;
    disable: boolean;
    tenure: LeaseHold;
    appId: string;
    companyId?: number;
    app?: string;
    company?: string;
    varMappingId: string;
    isFee: boolean;
}


export interface ProfertyQuoteSaveModal {
    OpportunityId: number;
    BranchId: number;
    HtmlContent: string;
    Email1: string;
    EmailTitle: string;
    PropertyQuoteRequest: any;
    PropertyQuoteViewModels: PropertyQuoteViewModel[];
    HasDiscount: boolean;
}

export interface PropertyQuoteViewModel {
    propertyQuoteType: PropertyQuoteApp;
    propertyQuoteValuesViewModel: PropertyQuoteValuesViewModel;
    varList: MatterVarsViewModel[];
}

export interface PropertyQuoteValuesViewModel {
    appCode: string;
    price: number;
    profCosts: number;
    total: number;
    costs: number;
    disbursement: number;
}

export interface MatterVarsViewModel {
    var: string;
    value: string;
}

export interface MatterValidationData {
    data: MatterSearchGridData;
    detailStatus: DetailStatusViewModel[];
}

export interface OpertunityState {
    elevenDaysPassedCount: number;
    oneDayCount: number;
    opportunityStatus: string;
    quoteSummaryViewModel: QuoteSummaryView[];
    sixDaysPassedCount: number;
    todayCount: number;
    total: number;
    twoDaysPassedCount: number;
    totalPrior: number;
}

export interface QuoteSummaryView {
    monthCount: number;
    opportunityStatus: string;
    todayCount: number;
    total: number;
    weekCount: number;
    yearCount: number;
}

export interface Screen {
    appId: number;
    screens: ScreenItem[];
}

export interface ScreenItem {
    screenAppId: number;
    screenNumber: any;
    screenTitle: string;
}

export interface SaveScreenItem {
    appId: number;
    screenName: string;
    note: string;
}

export class CostDiscount {
    discountPer: number;
    discountAmount: number;
    allowanceText: string;
    // editedProfesionalFee: number;
}

export interface WebQuoteVars {
    id: number; // company id
    varMappingId: 'Client' | 'Purchase' | 'Sale' | 'Equity_Release' | 'Re-Mortgage' | 'Transfer_of_Equity';
    title: string;
    firstName: string;
    surName: string;
    house: string;
    address1: string;
    address2: string;
    town: string;
    country: string;
    postCode: string;
    telephone: string;
    email: string;
    price: string;
    lease: string;
    professionalCost: string;
    disbursements: string;
    companyId: string;
    company: string;
}
export interface WebQuoteCompnayDetails {
    emailQuoteMeSubject: string;
    emailAcceptedQuoteSubject: string;
    branches: boolean;
    domain: string;
}

export interface EnquiryInfoViewModel {
    typeDetails: OpportunityApiTypeDetailsViewModel;
    quoteType: OpportunityApiTypeDetailsViewModel;
}

export interface OpportunityApiTypeDetailsViewModel {
    question: string;
    answer: string;
}

export function propertyQuoteItemDisplayName(item: Cost): string {
    if (!item.itemName || !!item.itemName.includes('_')) {
        return item.description;
    }
    return item.itemName;
}

export interface WebQuoteData {
    branch: WebQuoteBranch[];
    loclAuth: WebQuoteLocalSearch[];
    cost: WebQuoteCost[];
}



