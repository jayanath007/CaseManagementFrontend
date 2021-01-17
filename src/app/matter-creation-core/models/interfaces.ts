// import { extend } from 'webdriver-js-extender';
import { DropdownListData } from '../../core';
import { eBillingType } from '../../core/lib/matter';


export interface Matter {
    clientRef: string;
    clientName: string;
    branchID: number;
    matterRef: string;
    private: boolean;
    matterDetails: string;
    fileID: number;
    matterId: number;
    matterCloseMatter: boolean;
    matterStartDate: string;
    matterClosedate: string;
    isMatterCompleted: boolean;
    // matterCompletedBy: string;
    matterCompletedDate: string;
    matterFeeEarner: string;
    matterSupervisor: any;
    appCode: string;
    appId: number;
    matterDepartment: number;
    matterCategory: any;
    matterRateCategory: any;
    matterInterestScheme: any;
    matterIntroduction: any;
    matterPrecedentHScheme: number;
    eBilling: eBillingType;
    matterFileSecurity: boolean;
    matterUnderDefined1: any;
    matterUnderDefined2: any;
    matterUnderDefined3: any;
    matterUnderDefined4: any;
    creditLimitCost: any;
    creditLimitDibs: any;
    creditLimitExpenses: any;
    anticipatedWIPCredit: any;
    anticipatedDisbCredit: any;
    anticipatedBillCredit: any;
    legalPublicFunded: number;
    legalLAACivilBilling: boolean;
    legalMatterType: any;
    legalMatterType1: any;
    legalMatterType2: any;
    legalCaseStageLevel: any;
    legalCaseStageReached: any;
    legalCaseOutcome: any;
    legalCaseStarted: any;
    completionDocLocation: any;
    completionArchiveRef: any;
    completionDistroyDate: any;
    completionDistroyed: boolean;
    sundryTrustAccount: string;
    sundryOldReference: any;
    sundryOtherMatter: any;
    sundryDPSFileNumber: number;
    sundryCrediteConrtolStage: number;
    sundryStageSet: string;
    sundrySuspendCrediteControl: boolean;
    sundryReasonToSuspend: any;
    sundryBullingAddress1: any;
    sundryBullingAddress2: any;
    sundryTown: any;
    sundryCountry: any;
    sundryPostCode: any;
    sundryLablePriented: boolean;
    sundryProfitCost: any;
    sundryDefaultDDABank: any;
    crimeUFN: string;
    crimeLeadUFN: string;
    crimeBailCondition1: any;
    crimeBailCondition2: any;
    crimeBailCondition3: any;
    crimeBailCondition4: any;
    crimeBailCondition5: any;
    clientRef2: string;
    outSideSurname1: any;
    outsidePostCode1: any;
    outsideDOB1: any;
    outSideSurname2: any;
    outsidePostCode2: any;
    outsideDOB2: any;
    ufnValue?: string;
    masterMatterId?: number;
    isPlotMatter?: boolean;
    isPlotMasterMatter?: boolean;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}

export interface FullMatterViewModel extends Matter {
    clientContactLink: ClientContackLinkDetailViewModel[];
}

export interface Client {
    clientId: number;
    clientRef: string;
    clientTitle: string;
    firstName: string;
    lastName: string;
    letterTitle: string;
    contactName: string;
    email1: string;
    email2: string;
    phone: any;
    workPhone: any;
    mobilePhone: any;
    fax: any;
}
export interface MatterModel {
    matter: Matter;
    client1: Client;
    client2: Client;
    clientContactLink: ClientContackLinkDetailViewModel[];
    matterDocumentRegistries: DocRegisterGridData[];
}
export interface ClientContackLinkDetailViewModel {
    linkID: number;
    accountRef: string;
    accountName: string;
    address: string;
    postcode: string;
    contactID: number;
    screenNo: number;
    leadClient: boolean;
    clientId: number;
}
export interface InputData {
    matterId?: number;
    clientReference?: string;
    clientName?: string;
    branchID?: number;
    matterModel?: Matter;
    opportunityId?: number;
    clientList?: ClientContackLinkDetailViewModel[];
    confirmBeforeOpenCase?: boolean;
    client1?: Client;
    client2?: Client;
    matterIntroduction?: number;
}
export interface MatterInfomation {
    clientName: string;
    matterReferenceNo: string;
    branchID: number;
    appID: number;
    appCode: string;
    fileID: number;
    feeEarner: string;
    rateCategory?: string;
    matterCounter: number;
}

export interface LegalAidCombos {
    caseStageLevel: DropdownListData[];
    criteria: DropdownListData[];
    matterType1: DropdownListData[];
    matterType2: DropdownListData[];
    outcome: DropdownListData[];
    stageReached: DropdownListData[];
}
export interface DocRegisterGridData {
    documentRef: string;
    location: string;
    reviewDate: string;
    destroyDate: string;
}

export interface GridRowItem<T> {
    data: T;
    selected: boolean;
    index: number;
}

export interface CloserProcessing {
    balancesOrAllocationsOrProformasExist: boolean;
    isCompletionNegWOEnabled: boolean;
    cannotCloseMessage: string;
}
export type DocRegisterGridRowItemWrapper = GridRowItem<Readonly<DocRegisterGridData>>;

export interface DiaryRecordViewModel {
    matterRef: string;
    opportunityId: number;
}
