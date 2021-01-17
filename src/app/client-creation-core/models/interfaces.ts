import { MatClientRefViewModel } from '../../core/lib/screen-edit';
import { Data } from '@angular/router/src/config';
import { DropdownListData, LookupViewModel } from '../../core';


export interface InitClientCreationData {
    branchList: DropdownListData[];
    clientTypeList: DropdownListData[];
    creditAccountTypeList: DropdownListData[];
    vatCodeAndDescriptionList: DropdownListData[];
    feeEarnerCodeAndNameList: DropdownListData[];
    ethnicOriginCodeAndNameList: DropdownListData[];
    creditControlStageList: DropdownListData[];
    amlRiskLevelResponceList: DropdownListData[];
    genderCodeAndNameList: DropdownListData[];
    currencyCodeAndNameList: DropdownListData[];
    disabilityCodeAndNameList: DropdownListData[];
    companyProofsList: DropdownListData[];
    clientInterestSchemeList: DropdownListData[];
    lookupTitleType: LookupViewModel;
    lookupIntroductionType: LookupViewModel;
    lookupTermsType: LookupViewModel;
    lookupProofIDType: LookupViewModel;
    lookupProofAddressType: LookupViewModel;
    isAMLShow: boolean;
    clientDefaults: ClientDefaultModel;
    matRefSetting: MatClientRefViewModel;
    loadInitData: boolean;
    userDefaultBranch: number;
    defuiltRiskAssesmentData: RiskAssessmentData;
    caseFileIdentity: CaseFileIdentity;
}

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
    postCode: string;
    telephone: string;
}

export interface ClientGridRowList<T> {
    data: T;
    selected: boolean;
    expanded: boolean;
}
export type ClientGridRowRapper = ClientGridRowList<Readonly<ClientGridData>>;




export interface ClientNoteModel {
    clientRef: String;
    noteDate?: Date | string;
    note: String;
    noteBy: String;
    noteNo: number;
    isEdit: boolean;
}


export interface ClientMatterModel {
    matterId: number;
    matterFileID?: number;
    matterRef: string;
    matterAppCode: string;
    matterDetails: string;
    matterFeeEarner: string;
    matterStartDate: string;
    isClosedMatter: boolean;
}

export interface ClientModel {
    client: Client;
    clientEvents: ClientEventModel[];
    matterBailConditions: MatterBailConditionModel[];
    clientDocumentRegistries: DocumentRegistryModel[];
    clientMatters: ClientMatterModel[];
    clientNotes: ClientNoteModel[];
    riskAssessment?: RiskAssessmentData;
}

export interface DocumentRegistryModel {
    documentRegistryId: number;
    documentRef: string;
    type: string;
    location: string;
    address: string;
    matterRef: string;
    matterDetails: string;
    reviewDate?: string;
    destroyDate?: string;
}

export interface MatterBailConditionModel {
    matterRef: string;
    bailConds: string;
}
export interface ClientEventModel {
    eventId: number;
    clientRef: string;
    user: string;
    dateAdded?: string;
    type: string;
    note: string;
    docPath: string;
    fileName?: number;
    fileExtension: string;
}

export interface Client {
    clientId: number;
    branchID?: number;
    firstName: string;
    lastName: string;
    clientReference: string;
    clientName: string;
    clientAddress1: string;
    clientAddress2: string;
    clientTown: string;
    clientCountry: string;
    clientPostCode: string;
    clientContactName: string;
    clientTelephoneNo: string;
    clientFaxNo: string;
    clientEmail: string;
    statementAddress1: string;
    statementAddress2: string;
    statementTown: string;
    statementCounty: string;
    statementPostCode: string;
    statementContentContactName: string;
    statementContentTelephone: string;
    statementContentFacsimile: string;
    statementContentEmail: string;
    currencyCode: string;
    vatCode: string;
    creditLimit?: number;
    terms: string;
    onHold?: number;
    balance?: number;
    accountType?: number;
    accountName: string;
    paymentSortCode: string;
    companyReg: string;
    vatRegNo: string;
    companyAddress1: string;
    companyAddress2: string;
    companyTown: string;
    companyCountry: string;
    companyPostCode: string;
    nameAtBirth: string;
    placeOfBirth: string;
    dateOfBirth?: string;
    niNumber: string;
    startDate?: string;
    feeEarner: string;
    accountNo: string;
    clientTitle?: number;
    gender: string;
    ethnicOrigin: string;
    disabilityMonitoring: string;
    clientLetterTitle: string;
    clientIntroduction?: number;
    clientMobileTelephoneNo: string;
    clientWorkTelephoneNo: string;
    clientSecondEmail: string;
    companySICCode: string;
    dateOfDeath?: string;
    clientCompanyName: string;
    clientType?: number;
    bacsPayment?: boolean;
    bacsCode: string;
    privetIndividual: boolean;
    companyName: string;
    companyProof1?: any;
    companyProof2?: any;
    directorForename: string;
    directorSurname: string;
    directorDOB?: string;
    directorProofIDinfo: string;
    directorAddressinfo: string;
    firstNameasdirector?: boolean;
    forename1: string;
    surname1: string;
    doB1?: string;
    percentageHeld1?: number;
    companyDetail: string;
    directorProofofID?: number;
    directorAddressProof?: number;
    clientNotoMarketing?: boolean;
    forename2: string;
    surname2: string;
    doB2?: string;
    percentageHeld2?: number;
    forename3: string;
    surname3: string;
    doB3?: string;
    percentageHeld3?: number;
    forename4: string;
    surname4: string;
    doB4?: string;
    percentageHeld4?: number;
    creditControlStage?: number;
    dateStageSet?: string;
    suspendCreditControl?: boolean;
    reasonToSuspend: string;
    amlSearchResult?: number;
    amlLastSearch?: string;
    amlRiskLevel?: number;
    additionalName1: string;
    additionalName2: string;
    additionalName3: string;
    riskAssessmentFailed?: boolean;
    cliBal?: number;
    clientAccountNo: string;
    privateMatter?: boolean;
    bUP?: number;
    dpu?: number;
    branch: string;
    mailMerge?: boolean;
    uCN: string;
    closeDate?: string;
    offBal?: number;
    dDABal?: number;
    introduction: string;
    termsDays?: number;
    deliveryAddress: string;
    nominalCode: string;
    initials: string;
    timBal?: number;
    contactID?: number;
    proofIdInfoDateAdded: string;
    proofAddrsInfoDateAdded: string;
    proofIdExpiryDate: string;
}

export interface ClientNotes {
    ClientRef: string;
    NoteDate: string;
    Note: string;
    NoteBy: string;
    NoteNo: number;
}

export interface ClientDefaultModel {
    cD_ID: number;
    cD_TermDays: number;
    cD_TermStart: string;
    cD_Period1: string;
    cD_Period2: string;
    cD_Period3: string;
    cD_Period4: string;
    cD_PostInv: boolean;
    cD_CLAutoInc: boolean;
    cD_MTAutoInc: boolean;
    cD_ReqAuthPB: boolean;
    cD_NextCLNum: number;
    cD_NextMTNum: number;
    cD_NextJRNum: number;
    cD_NextSPNum: number;
    cD_SPAutoInc: number;
    cD_CliPlace: number;
    cD_MatPlace: number;
    cD_CliAlpha: number;
    cD_Priority: number;
    cD_ShowVat: boolean;
    cD_AudioWarn: boolean;
    cD_MADateGrp: boolean;
    cD_MAPrnNotes: boolean;
    cD_MAPrnColors: boolean;
    cD_DUB: boolean;
    cD_WarnOff: boolean;
    cD_GblDebtor: boolean;
    cD_GblClearDays: number;
    cD_AutoArch: boolean;
    cD_AutoArchNo: number;
    cD_ForceBranch: boolean;
    cD_FilterDept: boolean;
    cD_BrnCDSImport: boolean;
    cD_ShowDDACols: boolean;
    cD_ShowBalsOnls: boolean;
    cD_ShowRev: boolean;
    cD_ShowCOS: boolean;
    cD_ShowPRF: boolean;
    cD_HideSysBills: boolean;
    cD_ShowClearFunds: boolean;
    cD_ChqAuthorise: boolean;
    cD_ImportDiaryNet: boolean;
    cD_SwitchMA: boolean;
    cD_SwitchPurRef: boolean;
    cD_ShowCouncil: boolean;
    cD_ShowMatPrefix: boolean;
    cD_AllowNegDUU: boolean;
    cD_AutoDocReg: boolean;
    cD_AutoDocRegNo: number;
    cD_ForceMatterConflictSearch: boolean;
    cD_ForceClientConflictSearch: boolean;
    cD_ShowFEonPIPP: boolean;
    cD_InvoiceApprovalRequired: boolean;
    cD_OverdueInterestRate: number;
    cD_FESupplierLedger: boolean;
    cD_TTClearDays: number;
    cD_BACSClearDays: number;
    cD_ChqClearDays: number;
    cD_SwitchOffBillPrint: boolean;
    cD_HomeCurrencyCode: string;
}


// export interface Client {
//     clientId: number;
//     clientRef: string;
//     firstName: string;
//     lastName: string;
//     letterTitle: string;
//     contactName: string;
//     email1: string;
//     email2: string;
//     phone: any;
//     workPhone: any;
//     mobilePhone: any;
//     fax: any;
// }




export interface MatterGridData {
    clientFileID: string;
    clientId: string;
    clientRef: string;
    clientDetails: string;
    clientStartDate: string;
    clientFeeEarner: string;
    clientAppCode: string;
}

export interface GridRowItem<T> {
    data: T;
    selected: boolean;
    index: number;
}
export type MatterGridRowItemWrapper = GridRowItem<Readonly<MatterGridData>>;

export interface CrimeGridData {
    clientRef: string;
    bailConds: string;
}
export type CrimeGridRowItemWrapper = GridRowItem<Readonly<CrimeGridData>>;

export interface DocumentGridRow {
    clientRef: string;
    bailConds: string;
}
export type DocumentGridRowItemWrapper = GridRowItem<Readonly<DocumentGridRow>>;

export interface RiskAssessmentData {
    headerId: number;
    threshold: number;
    action: number;
    notActive: boolean;
    emailAddress: string;
    riskAssessmentRequired: boolean;
    clientRiskAssessmentQuestions: ClientRiskAssessmentQuestion[];
    assessmentDetails: ClientRiskAssessmentDetails;
}

export interface ClientRiskAssessmentQuestion {
    uniqueQuestionId: number;
    questionId: number;
    subQuestionId: number;
    text: string;
    order: number;
    answerId: number;
    value: number;
    weight: number;
    dormant: boolean;
    question: string;
}

interface ClientRiskAssessmentDetails {
    doneBy: string;
    overRiddenByBy: string;
    overRiddenDate: string;
    threshold: number;
    date: string;
    id: number;
    clientRef: string;
    matterRef: string;
    score?: number;
    status?: number;
    note?: string;
}

export interface MatterGridResponce {
    data: ClientMatterModel;
    total: number;
}
export interface CaseFileIdentity {
    fileId: number;
    appId: number;
    branchId: number;
}