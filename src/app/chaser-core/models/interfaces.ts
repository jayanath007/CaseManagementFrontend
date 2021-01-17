import { BooleanColumn } from './../../core/lib/microsoft-graph';
import { eBillingType } from './../../core/lib/matter';
import { StatusType } from './enums';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { Recipient } from '../../core/lib/microsoft-graph';

export interface FeeEarner {
    user_ID: string;
    selected: boolean;
}
export interface FeeEarnerResponce {
    data: FeeEarner[];
    status: StatusType;
}
export interface TimeType {
    selected: boolean;
    dtL_Label: string;
    dtL_RecType: number;
}

export interface TimeTypeResponce {
    data: TimeType[];
    status: StatusType;
}
export interface DefaultFolderResponce {
    data: number;
    status: StatusType;
}
export interface Folder {
    text: string;
    value: string;
    selected: boolean;
}
export interface FolderResponce {
    data: Folder[];
    status: StatusType;
}

export interface UnMapEmail {
    data: ContactMapResponce;
    status: StatusType;
}

export interface MatterInfo {
    ClientName: string;
    MatterReferenceNo: string;
    BranchID: number;
    AppID: number;
    AppCode: string;
    FileID: number;
    FeeEarner: string;
    var1: string;
    var2: string;
    var3: string;
    selected?: boolean;
    RateCategory?: string;
    source?: string;
    isPlotMasterMatter: boolean;
    eBilling?: eBillingType;
    matterDetails: string;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}
export interface ChaserOutPut {
    fileNo: string;
    fileNote: string;
    diaryFolder: string;
    feeEarner: string;
    timeType: number;
    timeUnits: number;
    fileHeaderText: string;
    branchID: number;
    appID: number;
    appCode: string;
    fileID: number;
    matterReferenceNo: string;
    isOptMeChecked: boolean;
    mailSubject: string;
}
export interface ChaserInput {
    token: string;
    fileNote: string;
    loginUser?: string;
    unitValue: number;
    openCaseList: OpenCaseMenueData[];
    dpsSubject: string;
    toRecipients: Recipient[];
    isLoginUser?: boolean;
    from: Recipient;
}
export interface ItemIdTypeDTO {
    id: string;
    changeKey: string;
}
export interface ChaserViewModel {
    branchId: number;
    appId: number;
    appCode: string;
    fileId: number;
    matterReferenceNo: string;
    fileHeaderText: string;
    feeEarner: string;
    diaryFoldersValue: number;
    extraTimeUnits: number;
    extraTimeType: string;
    extraTimeTypeValue: number;
    note: string;
    rateCategory: string;

    courtValue: number;
    numEntries: number;
    prepUnits: number;

    classId: number;
    subClassId: number;
    uncharge: boolean;
    eBillingPhaseId: number;
    eBillingActivityId: number;
    eBillingTaskId: number;

    chaseDays: number;

    IsOptMeChecked: boolean;
    chaserTextId?: number;
    fileNo: string;
    // IsChaseEmailChecked: boolean;

    classSelectedIndex: number;
    workTypeSelectedIndex: number;
    classValue: number;
    workTypeValue: number;
    courtSelectedIndex: number;
    eBilling?: string;
    workType: number;
    itemRate: number | string;
    itemUnits: number;
    legalAidCaseInfoId: number;
    lafundLevel: number;
}
export interface ChaserError {
    isError: boolean;
    msg: string;
}
export class ChaserRequest {
    constructor(public chaserModel: ChaserViewModel, public from: Recipient) { }
}
export interface ContactEmailsViewModel {
    contactId: number;
    type: number;
    typeName: string;
    email: string;
}
export interface OneToOneTypeListViewModel {
    type: number;
    typeName: string;
    haveContact: string;
    existingContactId: number;
    message: string;
    unableToLinkContact: boolean;
}
export interface ContactMapResponce {
    contactEmailsViewModel: ContactEmailsViewModel[];
    haveOneToOneTypes: boolean;
    oneToOneTypeListViewModel: OneToOneTypeListViewModel[];
}

export interface ContactMapRequest {
    BranchId: number;
    AppId: number;
    FileId: number;
    ContactEmailsViewModel: ContactEmailsViewModel[];
}
export interface RequiredField {
    eBillingType: string;
    workType: any;
    activiti: any;
    phase: any;
    phaseWiseTask: any;
}
export interface ChaserValidationInfo {
    status: boolean;
    msg: string;
}

