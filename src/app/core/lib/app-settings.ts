import { User } from './microsoft-graph';
import { MessageFormat } from '../../auth';

export interface SettingsInfo {
    status: boolean;
    data: SettingsData;
}

export interface SettingsData {
    id: string;
    isChaserEnable: boolean;
    isSignaturAutoAdd: boolean;
    dpsSharedMailBoxes: User[];
    reminderSoundEnable: boolean;
    newMailSoundEnable: boolean;
    messageFormat: MessageFormat;
    useGlobalSignature: boolean;
}

// export interface ModuleInfomation {
//     moduleId: Module;
//     hidden: boolean;
// }

export enum Module {
    Common = 'Common',
    LedgerCard = 'LedgerCard',
    TimeRecorded = 'TimeRecording',
    Contact = 'Contacts',
    WorkToDo = 'WorkToDo',
    WorkDone = 'WorkDone',
    DictationDictation = 'DictationDictate',
    DictationSend = 'DictationSent',
    DictationComplete = 'DictationComplete',
    DictationSummery = 'DictationSummary',
    Dialler = 'Dialler',
    TeamTalk = 'TeamTalk',
    PrecidentH = 'PrecidentH',
    PostOfficeInbox = 'PostOfficeInbox',
    Matter = 'Matters',
    Client = 'Clients',
    MarketingCampaign = 'MarketingCampaign',
    MarketingGroup = 'MarketingGroup',
    MarketingCampaignPreview = 'MarketingCampaignPreview',
    GlobleDocumentSearch = 'GlobalDocumentSearch',
    Dictations = 'Dictations',
    ChequeRequest = 'ChequeRequest',
    Accounts = 'Accounts',
    Opportunity = 'Opportunity',
    ActivityMonitor = 'ActivityMonitor',
    Crime = 'Crime',
    EchitAuthorisation = 'EchitAuthorisation',
    FormsLibrary = 'FormsLibrary',
    AmmendScreens = 'AmmendScreens',
    Workflow = 'Workflow',
    WorkflowRules = 'WorkflowRules',
    RiskAssessment = 'RiskAssessment',
    IHTEstate = 'IHTEstate'
}
export enum SettingKey {
    AllowEditBilledItem = 'AllowEditBilledItem',
    AllowEditBilledItemDetails = 'AllowEditBilledItemDetails',
    MultipleClientsOnMatter = 'MultipleClientsOnMatter',
    UserClientLock = 'UserClientLock',
    AddEmailAttachmentsUncharged = 'AddEmailAttachmentsUncharged',
    AmendScreensWorkflow = 'AmendScreensWorkflow',
    IsPlotUser = 'IsPlotUser',
    IsLoginUserSupervisor = 'IsLoginUserSupervisor',
    IsAzureSafeBoxEnabled = 'IsAzureSafeBoxEnabled',
    TeamTalkDataBase = 'TeamTalkDataBase',
    UserBranchId = 'UserBranchId'
}

export enum UserPermissionKey {
    isAllGroups = 'isAllGroups',
    isAllUsers = 'isAllUsers',
    ammendTemplatesMenus = 'ammendTemplatesMenus',
    addClients = 'addClients',
    deleteClients = 'deleteClients',
    addMatters = 'addMatters',
    approveRiskAssessments = 'approveRiskAssessments',
    diaryDeleteEntry = 'diaryDeleteEntry'
}

