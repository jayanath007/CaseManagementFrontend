
import * as Graph from './../../core/lib/microsoft-graph';
import { Module, SettingKey, UserPermissionKey } from '../../core/lib/app-settings';

export class AzureAuthInfo {
    constructor(public accessToken: string, public user: User, public isGoogle: boolean = false) { }
}

export interface User {
    userName: string;
    general: GeneralData;
    profile: { upn: string, name: string };
    isChaserEnable: boolean;
    isSignaturAutoAdd: boolean;
    dpsSharedMailBoxes: Graph.User[];
    signature: string;
    userTimeZone: { value: string, info: Graph.TimeZoneInformation };
    userImage: any;
    isLoadingUserImage?: boolean;
    userImageUid?: string;
    selectedCalendars: string[];
    emailReadingPaneMode: ReadingPaneMode;
    pdfViewerJwtToken: string;
    reminderSoundEnable: boolean;
    newMailSoundEnable: boolean;
    messageFormat: MessageFormat;
    useGlobalSignature: boolean;
}

export interface MessageFormat {
    contentType: Graph.BodyType;
    fontFamily: string;
    fontSize: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    fontColor: string;
}

export interface GeneralData {
    companyCode: string;
    isDocumentVersioning: boolean;
    dateTimeOffset: number;
    signature: {
        isUserHasSignature: boolean,
        message: string
    };
    settingValues: SettingValues;
    companyBannerUrl: string;
    companyLogoUrl: string;
    isUserHasEmailSendAsPermission: boolean;
    hiddenModule: Module[];
    plotVarValues: string[];
    amendScreensWorkflow: boolean;
    isLoginUserSupervisor: boolean;
    anticipatedWIPCredit: any;
    teamTalkDataBase: string;
    branchAddress1: string;
    branchAddress2: string;
    branchCounty: string;
    branchEmail: string;
    branchFax: string;
    branchMisc1: string;
    branchMisc2: string;
    branchPostCode: string;
    branchTelephone: string;
    companyMisc1: string;
    companyMisc2: string;
    companyMisc3: string;
    companyMisc4: string;
    companyName: string;
    environmentName: string;
    isDiaryDeleteEntryHasRight: boolean;
    timeZone: string;
    userId: number;
    user: string;
    userAskForName: string;
    userDirectDialNo: string;
    userEmail: string;
    userName: string;
    userSignatureName: string;
    userBranchId: number;
    userBranchName: string;
    userMobile: string;
    userJobTitle: string;
    userAccessRights: UserPermission;
}

export interface SettingValues {
    [SettingKey.AllowEditBilledItem]: boolean;
    [SettingKey.AllowEditBilledItemDetails]: boolean;
    [SettingKey.MultipleClientsOnMatter]: boolean;
    [SettingKey.UserClientLock]: boolean;
    [SettingKey.AddEmailAttachmentsUncharged]: boolean;
    [SettingKey.IsPlotUser]: boolean;
    [SettingKey.IsAzureSafeBoxEnabled]: boolean;
}


export enum ReadingPaneMode {
    Hide = 'hide',
    Right = 'right',
    Bottom = 'bottom'
}

export enum LoginMode {
    Google = 'Google',
    AzureV2 = 'G',
    Azure = 'right'
}

export interface TenentValidated {
    detailStatus: DetailStatus[];
    messageBody: string;
    messageHeader: string;
    status: string;
}

export interface DetailStatus {
    code: string; exceptionType: string; message: string; messageType: string; reference: string; severityLevel: string;
}

export interface DbSource {
    name: string;
    id: string;
}

export interface UserPermission {
    [UserPermissionKey.isAllGroups]: boolean;
    [UserPermissionKey.isAllUsers]: boolean;
    [UserPermissionKey.ammendTemplatesMenus]: boolean;
    [UserPermissionKey.addClients]: boolean;
    [UserPermissionKey.deleteClients]: boolean;
    [UserPermissionKey.addMatters]: boolean;
    [UserPermissionKey.approveRiskAssessments]: boolean;
    [UserPermissionKey.diaryDeleteEntry]: boolean;
}

export enum StatusType {
    Fail = 0,
    Success = 1,
}
// export interface UserPermissionResponse {
//     data: UserPermission;
//     status: StatusType;
// }



