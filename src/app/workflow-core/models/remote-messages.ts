import { eBillingType } from './../../core/lib/matter';
import { DialogResult, MessageBoxIcon, MessageBoxButtons, MessageTypes, ScreenStateKind } from './enums';
import { DiaryRecType } from '../../add-note-core';

export interface IVarValue {
    controlerID: number;
    varNo: number;
    value: string;
}

export interface LLCommandRequest {
    template: string;
    step: string;
    do: boolean;
    done: boolean;
}

export interface CaseFileIdentityWithAppIdRequest {
    branchId: number;
    appId: number;
    fileId: number;
}

export interface ContactCompanyDTO {
    ctC_CompanyName: string;
    ctC_Address1: string;
    ctC_Address2: string;
    ctC_Town: string;
    ctC_County: string;
    ctC_PostCode: string;
    ctC_Telephone: string;
    ctC_Fax: string;
    ctC_DX: string;
    ctC_ID: string;
}

export interface UserScreenResult {
    dialogResult: DialogResult;
    ov: IVarValue[];
}

export interface BaseMessage {
    action: MessageTypes;
    isEditableDocx?: boolean;
}

export interface InternalPreStart extends BaseMessage {
    action: MessageTypes;
}

export interface SessionComplete extends BaseMessage {
    errorMessage: string;
}

export interface CloseUserScreen extends BaseMessage {
    interactionId: string;
}

export interface ScreenStateUpdate extends BaseMessage {
    interactionId: string;
    kind: ScreenStateKind;
    payload: any;
}

export interface BaseInteractionMessage extends BaseMessage {
    interactionId: string;
}

export interface ShowUserScreen extends BaseInteractionMessage {
    ov: IVarValue[];
    screenId: string;
    appId: number;
    fileId: number;
    branchId: number;
    screenTitle: string;
    screenCount: number;
    currentIndex: number;
    screenList: number[];
    isTabLogic: boolean;
    isLegalAid: boolean;
    isMasterMatter: boolean;
}

export interface FocusCurrentUserScreen extends BaseInteractionMessage {
    ov: IVarValue[];
    screenId: string;
    reason: string;
}

export interface ShowContactSearchScreen extends BaseInteractionMessage {
    ov: IVarValue[];
    screenId: number;
    appId: number;
    fileId: number;
    branchId: number;
    contactId: number;
    contactTypeId: number;
    searchFormType: string;
    resultsCount: number;
    contactLockedPermission: boolean;
}

export interface ShowContactSearchScreenOnFile extends BaseInteractionMessage {
    ov: IVarValue[];
    screenId: number;
    appId: number;
    fileId: number;
    branchId: number;
    contactId: number;
    contactTypeId: number;
    searchFormType: string;
    resultsCount: number;
}

export interface ContactMergeRespose extends BaseInteractionMessage {
    ov: IVarValue[];
    screenId: string;
    contactId: string;
}

export interface ScreenNavigationFail extends BaseInteractionMessage {
    screenId: string;
    kind: string;
}

export interface ShowOptionDialogBoxRequest extends BaseMessage {
    isCheckBox: boolean;
    isSelectFirstRadio: boolean;
    options: string[];
    caption: string;
}




export interface ShowLinkedLettersScreenRequest extends BaseMessage {
    caseFileIdentityWithAppIdRequest: CaseFileIdentityWithAppIdRequest;
    llCommandRequests: LLCommandRequest[];
    firstCall: boolean;
}

export interface ShowListLetterSaveButtonRequest extends ShowLinkedLettersScreenRequest {
    index: number;
}

export interface ShowEmailRequest extends BaseMessage {
    toRecipients: string[];
    cCRecipients: string[];
    bCCRecipients: string[];
    attachments: any[];
    subject: string;
    body: string;
    lookupID: number;
    id: string;
    appID: number;
    fileID: number;
    branchID: number;
}

export interface ShowXMmenuRequest extends BaseMessage {
    menuName: string;
}

export interface ShowEmailListScreenRequest extends BaseMessage {
    displayData: string;
    lookUpId: number;
    branchId: number;
    appId: number;
    fileId: number;
}

export interface ShowMessageBoxRequest extends BaseMessage {
    text: string;
    caption: string;
    buttons: MessageBoxButtons;
    icon: MessageBoxIcon;
}


export interface ShowEChitScreenRequest extends BaseMessage {
    text: string;
}


export interface ShowInputBoxRequest extends BaseMessage {
    prompt: string;
    title: string;
}

export interface ShowPostCodeMatchingPopupRequest extends BaseMessage {
    addressList: ContactCompanyDTO[];
    title: string;
}

export interface ViewOutputDocumentRequest extends BaseMessage {
    fileNumber: number;
    appId: number;
    branchId: number;
    letterName: string;
}

export interface ViewWebPage extends BaseMessage {
    url: string;
}

export interface LoadPdfViewerRequest extends BaseMessage {
    pdfOutputPathwithFilename: string;
}

export interface ShowDiaryScreenRequest extends BaseMessage {
    matterRef: string;
    branchId: number;
    appId: number;
    fileId: number;
    diaryRecType: DiaryRecType;
    note: string;
    letter: string;
    template: string;
    diaryAnchorType: string;
    columnFolderId: number;
    eBilling: eBillingType;
    isMasterMatter: boolean;
    appCode: string;
    feeEarner: string;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}

export interface LoadWebPageMessage extends BaseMessage {
    url: string;
}


export interface UpdateClientStateMessage extends BaseMessage {
    readOnly: boolean;
}


export interface PostCodeMatchingPopupRequestInitData {
    addressList: ContactCompanyDTO;
    title: string;
}

export interface OptionDialogResult {
    dialogResult: DialogResult;
    checkedIndexes: number[];
}

export interface DiaryScreenResult {
    dialogResult: DialogResult;
}
export interface ShowEChitScreenResult {
    dialogResult: DialogResult;
    data: any;
}

export interface InputBoxResult {
    dialogResult: DialogResult;
    response: string;
}


export interface LinkedLettersScreenResult {
    dialogResult: DialogResult;
    llCommandDto: LLCommandRequest[];
}

export interface SearchScreenResult {
    contactId: number;
    ov: IVarValue[];
    command: string;
}

export interface SearchParameters {
    searchFormType: string;
    contactTypeId: number;
    branchId: number;
    appId: number;
    sdAppId: number;
    fileId: number;
    screenId: number;
    resultsCount: number;
    mappedContactField: string;
    fieldValue: string;
    newContactPermission: boolean;
    statusLabel: string;
    contactsOnfileCount: string;
}

export interface SearchColumn {
    id: string;
    field: string;
    title: string;
}

export interface ShowShareScreenRequest extends BaseMessage {
    lookUpId: string;
    caseFileIdentityWithAppIdRequest: CaseFileIdentityWithAppIdRequest;
    eBilling: eBillingType;
    reviewNote: string;
    isPlotMasterMatter: boolean;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}

export interface PlotSyncScreenReques extends BaseInteractionMessage {
    caseFileIdentityWithAppIdRequest: CaseFileIdentityWithAppIdRequest;
    matterRef: string;
    screenId: string;
}

export interface ShareScreenResult {
    message: string;
    reviewNote: string;
    reviewDate: string;
    selectedEmailList: string[];
    shareScreenOption: string;
}

export interface SaveToDiaryConfirmationRequest extends BaseMessage {
    isEditableDocx: boolean;
}

export interface CDS7ReportDialogBoxRequest extends BaseMessage {
    branchId: number;
    fileId: number;
    classId: number;
}

export interface CDS7ReportDialogBoxResponse {
    dialogResult: DialogResult;
}



