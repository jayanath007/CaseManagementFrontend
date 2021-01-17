import { Action } from '@ngrx/store';
import { FileAttachment, Message } from '../../core/lib/microsoft-graph';
import { WindowSpec } from '../models/interfaces';
import { DocumentURLRequest } from '../../file-history-core/models/file-history-request';
import { OfficeUriSchemes } from '../../core/lib/office-uri-schemes';
import { ReplyForwardType } from '../../mail-item-core';
import { MatterInfo } from '../../core';
export const OPEN_EMAIL_ATTACHEMENT = 'DPS_OPEN_EMAIL_ATTACHEMENT';
export const OPEN_EMAIL_ATTACHEMENT_WITH_WOPI = 'DPS_OPEN_EMAIL_ATTACHEMENT_WITH_WOPI';
export const OPEN_EMAIL_ATTACHEMENT_BY_LINK = 'DPS_OPEN_EMAIL_ATTACHEMENT_BY_LINK';

export const OPEN_BY_URL = 'DPS_OPEN_WINDOW_BY_URL';
export const OPEN_WOPI_URL = 'DPS_OPEN_WOPI_WINDOW_URL';
export const GET_WOPI_HOST_URL = 'DPS_GET_WOPI_HOST_URL';
export const OPEN_MSG_VIEW = 'DPS_OPEN_MSG_VIEW';
export const OPEN_BY_OFFICE_URI_SCHEMES = 'DPS_OPEN_WINDOW_BY_OFFICE_URI_SCHEMES';

export const OPEN_WOPI_DOCUMENT_EDIT_POUP = 'OPEN_WOPI_DOCUMENT_EDIT_POUP';
export const OPEN_PDF_DOCUMENT_EDIT_POUP = 'OPEN_PDF_DOCUMENT_EDIT_POUP';
export const OPEN_DRIVE_EDITABLE_DOC = 'OPEN_DRIVE_EDITABLE_DOC';

export const DOWNLOAD_DIARY_INLINE_ATTACHMENT_TO_CLOUD = 'DPS_DOWNLOAD_DIARY_INLINE_ATTACHMENT_TO_CLOUD';
export const GET_MSG_DATA_BY_DIARY_ID = 'DPS_GET_MSG_DATA_BY_DIARY_ID';
export const GET_ATTACHMENT_OF_MSG_WOPI_FILE_URL = 'GET_ATTACHMENT_OF_MSG_WOPI_FILE_URL';
export const GET_ATTACHMENT_OF_MSG_WOPI_FILE_URL_SUCCESS = 'GET_ATTACHMENT_OF_MSG_WOPI_FILE_URL_SUCCESS';

export const DOWNLOAD_DPS_FILE_TO_ONE_DRIVE = 'DPS_DOWNLOAD_DPS_FILE_TO_ONE_DRIVE';
export const DOWNLOAD_DPS_FILE_TO_LOCAL = 'DPS_DOWNLOAD_DPS_FILE_TO_LOCAL';
export const DOWNLOAD_TEMPLATE_DATA = 'DPS_DOWNLOAD_TEMPLATE_DATA';
export const OPEN_DPS_FILE_IN_POPUP = 'DPS_OPEN_DPS_FILE_IN_POPUP';

export const REQUST_REPLAY_TO_MAIL_FOR_DIARY_MSG = 'REQUST_REPLAY_TO_MAIL_FOR_DIARY_MSG';


export class OpenEmailAttachemnt implements Action {
    readonly type = OPEN_EMAIL_ATTACHEMENT;
    constructor(public payload: {
        owner: string, itemId: string, attachement: FileAttachment,
        attachmentId?: string, isEmail?: boolean
    }) { }
}


export class RequstReplayToMailForDiaryMsg implements Action {
    readonly type = REQUST_REPLAY_TO_MAIL_FOR_DIARY_MSG;
    constructor(public payload: { diaryId: string | number, password: string, type: ReplyForwardType }) { }
}

export class DownloadDiaryInlineAttachmentToCloud implements Action {
    readonly type = DOWNLOAD_DIARY_INLINE_ATTACHMENT_TO_CLOUD;
    constructor(public payload: { diaryId: number | string, attachmentName: string }) { }
}

export class GetAttachmentOfMSGWOPIFileUrl {
    readonly type = GET_ATTACHMENT_OF_MSG_WOPI_FILE_URL;
    constructor(public payload: { diaryId: number, password: string, attachmentName: string, WopiActionType: string }) { }
}

export class GetAttachmentOfMSGWOPIFileUrlSuccess {
    readonly type = GET_ATTACHMENT_OF_MSG_WOPI_FILE_URL_SUCCESS;
    constructor(public payload: { fileName: string, base64Data: string }) { }
}


export class OpenByUrl implements Action {
    readonly type = OPEN_BY_URL;
    constructor(public payload: { url: string, id: string, spec: WindowSpec, attachmentName: string }) { }
}

export class OpenByOfficeUriSchemes implements Action {
    readonly type = OPEN_BY_OFFICE_URI_SCHEMES;
    constructor(public schemes: OfficeUriSchemes, public isEdit?: boolean) { }
}

export class OpenMsgView implements Action {
    readonly type = OPEN_MSG_VIEW;
    constructor(public payload: { data: Message }) { }
}

export class OpenEmailAttachemntWithWopi implements Action {
    readonly type = OPEN_EMAIL_ATTACHEMENT_WITH_WOPI;
    constructor(public payload: { itemId: string, attachement: FileAttachment }) { }
}

export class OpenWopiDocumentEditPoup implements Action {
    readonly type = OPEN_WOPI_DOCUMENT_EDIT_POUP;
    constructor(public request: DocumentURLRequest | any) { }
}

export class OpenPDFDocumentEditPoup implements Action {
    readonly type = OPEN_PDF_DOCUMENT_EDIT_POUP;
    constructor(public letterName: string, public matterInfo: MatterInfo) { }
}

// export class OpenDriveEditableDoc implements Action {
//     readonly type = OPEN_DRIVE_EDITABLE_DOC;
//     constructor(public docCheckin: DocumentCheckin, data?:any) { }
// }

export class OpenEmailAttachemntByLink implements Action {
    readonly type = OPEN_EMAIL_ATTACHEMENT_BY_LINK;
    constructor(public payload: { itemId: string, attachement: FileAttachment }) { }
}

export class GetWopiHostUrl implements Action {
    readonly type = GET_WOPI_HOST_URL;
    constructor(public payload: { url: string, accessToken: string, tokenTtl: string }) { }
}
export class DownloadDPSFileToOneDrive implements Action {
    readonly type = DOWNLOAD_DPS_FILE_TO_ONE_DRIVE;
    constructor(public payload: { diaryId: number }) { }
}

export class DownloadDPSFileToLocal implements Action {
    readonly type = DOWNLOAD_DPS_FILE_TO_LOCAL;
    constructor(public payload: { appCode: string, branchId: number, fileId: number, itemRef: string | number, attachmentName: string }) { }
}

export class OpenDPSFileInPopup implements Action {
    readonly type = OPEN_DPS_FILE_IN_POPUP;
    constructor(public payload: { appCode: string, branchId: number, fileId: number, itemRef: string | number, attachmentName: string }) { }
}

export class DownloadTemplateData implements Action {
    readonly type = DOWNLOAD_TEMPLATE_DATA;
    constructor(public payload: { appId: number, name: string, isCommon: boolean }) { }
}

export type Any = OpenEmailAttachemnt | GetWopiHostUrl | OpenWopiDocumentEditPoup | OpenMsgView |
    DownloadDiaryInlineAttachmentToCloud |
    GetAttachmentOfMSGWOPIFileUrl | GetAttachmentOfMSGWOPIFileUrlSuccess | OpenByOfficeUriSchemes | OpenPDFDocumentEditPoup;
