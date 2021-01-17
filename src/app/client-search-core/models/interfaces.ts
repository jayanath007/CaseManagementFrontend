import { PaginatorDef } from '../../core/lib/grid-model';
import { eBillingType } from '../../core/lib/matter';
export interface ClientGridData {
    clientBranch: string;
    clientCompanyName: string;
    clientName: string;
    clientRef: string;
    dateOfBirth: Date;
    email: string;
    feeEarner: string;
    firstName: string;
    fullAddress: string;
    lastName: string;
    matterCount: number;
    matterViewModel: MatterGridRowRapper[];
    postCode: string;
    telephone: string;
}
export interface ClientSearchPopupData {
    clientRef: string;
    branchId: number;
    clientName: string;

    firstName?: string;
    lastName?: string;
    clientTelephoneNo?: string;
    clientEmail?: string;
    clientSecondEmail?: string;
    clientAddress1?: string;
    clientAddress2?: string;
    clientCountry?: string;
    clientFaxNo?: string;
    clientTown?: string;
    clientPostCode?: string;
    clientMobileTelephoneNo?: string;
    clientWorkTelephoneNo?: string;
    clientContactName?: string;

    searchText: string;

    popupType: string;
    popupPara: OpportunityClientFilterOptionViewModel;
    isOpportunityEdit?: boolean;
}
export interface ClientGridRowList<T> {
    data: T;
    selected: boolean;
    expanded: boolean;
    matterPaginatorDef: PaginatorDef;
    matterLoading: boolean;
}
export type ClientGridRowRapper = ClientGridRowList<Readonly<ClientGridData>>;


export interface MatterViewModel {
    appID: number;
    app_Code: string;
    branchID: number;
    branchName: string;
    feeEarner: string;
    fileID: number;
    matterDetails: string;
    matterReferenceNo: string;
    startDateString: string;
    matterCounter: number;
    ufnValue: string;
    eBilling: eBillingType;
    isPlotMatter?: boolean;
    isPlotMasterMatter?: boolean;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}

export interface MatterGridRowList<T> {
    data: T;
    selected: boolean;
    expanded: boolean;
}
export type MatterGridRowRapper = MatterGridRowList<Readonly<MatterViewModel>>;

export interface MatterExpandData {
    client: ClientGridRowRapper;
    matter: MatterGridRowRapper;
}

export interface OpportunityClientFilterOptionViewModel {
    firstName: string;
    lastName: string;
    companyName: string;
    email1: string;
    isOpportunityEdit?: boolean;
}

// export interface GridRowListItem<MatterGridData> {
//     data: MatterGridData;
//     selected: boolean;
//     expanded: boolean;
//     loading?: boolean;
// }
// export type GridRowItemWrapper = GridRowListItem<Readonly<MatterGridData>>;

// export interface MatterResponse {
//     data: MatterDataObject;
//     status: string;
//     messageBody: string;
//     messageHeader: string;
//     detailStatus: DetailStatusViewModel[];
//     totalBillOutstandingBalance: number;
//     totalMatterCount: number;
// }

export interface ClientSearchResponse {
    data: ClientDataObject;
    status: string;
    messageBody: string;
    messageHeader: string;
    detailStatus: DetailStatusViewModel[];
}

export interface ClientDataObject {
    data: ClientGridRowResponce[];
    total: number;
    aggregates: Array<AggregatorViewModel>;
}

export interface ClientGridRowResponce {
    clientBranch: string;
    clientCompanyName: string;
    clientName: string;
    clientRef: string;
    dateOfBirth: Date;
    email: string;
    feeEarner: string;
    firstName: string;
    fullAddress: string;
    lastName: string;
    matterCount: number;
    matterViewModel: MatterViewModel[];
    postCode: string;
    telephone: string;
    // for opportunities //
    accountName: string;
    Address1: string;
    Address2: string;
    CompanyName: string;
    Country: string;
    Email1: string;
    Email2: string;
    SalesAccountRef: string;
    SalesContactId: number;
    SalesCounterId: number;
    SalesIntroductionId: number;
    Town: string;
    Type: string;
}
export interface MatterDataObject {
    data: MatterViewModel[];
    total: number;
    aggregates: Array<AggregatorViewModel>;
    group: any;
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

